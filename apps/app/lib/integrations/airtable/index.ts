import airtable from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base";
import axios, { AxiosInstance } from "axios";
import { AirtableCredential, Field, Integration, SyncError } from "@prisma/client";
import { IntegrationBase } from "../base";
import * as types from "../base/types"
import { db } from "~/lib/db";
import moment from "moment-timezone";
import { getAuthorizationHeader, parseAirtableError } from "./_helpers";
import { GetBasesResponse, GetBaseTablesResponse } from "./types";
import AirtableError from "airtable/lib/airtable_error";
import * as formatter from "./formatter";
import { parseRecordProperties } from "./formatter/helper";
import _ from "lodash";

interface AirtableProps extends types.IntegrationBaseProps {
  credentials: AirtableCredential
}

export class Airtable extends IntegrationBase {
  baseId: string;
  base?: AirtableBase;
  client?: AxiosInstance;
  apiKey: string | null;

  constructor({ userId, credentials}: AirtableProps) {
    super({ userId, credentials });
    this.integration = Integration.Airtable;
    this.isLegacy = !!credentials.apiKey;
    this.baseId = credentials.baseId;
    this.apiKey = credentials.apiKey;
    this.formatter = formatter;
  }

  async init(): Promise<void> {
    const { apiKey, baseId, userId } = this;

    if ( apiKey ) {
      this.base = new airtable({ apiKey }).base(baseId)
      this.client = axios.create({
        baseURL: "https://api.airtable.com/v0",
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      return;
    }

    // Oauth Integrations
    const token = await db.airtableToken.findFirstOrThrow({ where: { userId }})
      .then(async token => {
        if ( moment(token.accessTokenExpiresAt).isAfter(moment().add('5', 'minutes')) ) { return token; };

        // Refresh token
        const data = await axios.post(
          'https://www.airtable.com/oauth2/v1/token', 
          {
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken
          }, 
          {
            headers: {
              'Authorization': getAuthorizationHeader(),
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        ).then(response => response.data);

        return db.airtableToken.update({ where: { userId }, data: {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          refreshedAt: moment().toDate(),
          accessTokenExpiresAt: moment().add(parseInt(data.expires_in), 'seconds').toDate(),
          refreshTokenExpiresAt: moment().add(parseInt(data.refresh_expires_in), 'seconds').toDate()
        }})
      })
    this.base = new airtable({ apiKey: token.accessToken }).base(this.baseId);
    this.client = axios.create({
      baseURL: "https://api.airtable.com/v0",
      headers: { 'Authorization': `Bearer ${token.accessToken}` }
    })
  };

  async validateCredentials(): Promise<types.ValidateDestinationCredentialsResponse> {
    if ( !this.client ) { throw new Error("Didn't initialize Airtable")}
    return this.client.get('/meta/whoami')
    .then(() => ({ isValid: true }))
    .catch(error => {
      const data = error.response.data;
      if ( data.error.type === 'NOT_FOUND' ) { return { isValid: true }};
      return { isValid: false, error: { code: SyncError.InvalidCredentials, message: "Finta is unable to access Airtable with the given credentials" }}
    })
  }  

  async getTables(): Promise<types.GetDestinationTablesRepsonse> {
    if ( !this.client ) { throw new Error("Didn't initialize Airtable")}
    if ( this.isLegacy ) { return { tables: []} };
    return this.client.get(`/meta/bases/${this.baseId}/tables`)
      .then(response => {
        const { tables } = response.data as GetBaseTablesResponse;
        return {
          tables: tables.map(table => ({
            tableId: table.id,
            name: table.name,
            fields: table.fields.map(field => ({
              fieldId: field.id,
              name: field.name,
              type: field.id === table.primaryFieldId ? 'primary' : field.type
            }))
          }))
        }
      })
  }

  async getBases() {
    if ( !this.client ) { throw new Error("Didn't initialize Airtable")}
    return this.client.get('/meta/bases')
      .then(response => {
        const bases = (response.data as GetBasesResponse).bases
          .filter(base => [ 'edit', 'create' ].includes(base.permissionLevel))
          .map(base => ({ id: base.id, name: base.name }))
        return { bases }
      })
  }

  async _validateTableConfig({ tableId, table, fields }: types.ValidateTableConfigProps): Promise<types.AirtableLegacyValidateResponse> {
    if ( !this.base ) { throw new Error("Didn't initialize Airtable")};
    return this.base(tableId).select({ fields: fields.map(field => field.fieldId), maxRecords: 1}).all()
      .then(() => ({ isValid: true, errors: [] }))
      .catch(async (err: AirtableError) => {
        const error = await parseAirtableError(err, tableId, table);
        return { isValid: false, errors: [ error ] }
      })
  }

  async queryTable({ tableId, fieldConfigs }: { tableId: string; fieldConfigs: { id?: string | undefined; field: Field; fieldId: string; tableConfigId?: string | undefined; }[]; }): Promise<types.IntegrationRecord[]> {
    if ( !this.base ) { throw new Error("Didn't initialize Airtable")}
    const returnFieldsByFieldId = fieldConfigs.filter(field => !field.fieldId.startsWith('fld')).length === 0;
    const params = returnFieldsByFieldId ? { returnFieldsByFieldId } : {};
    const records = await this.base(tableId).select(params).all();
    return records.map(record => ({ 
      id: record.id, 
      object: record, 
      properties: parseRecordProperties({ record, fieldConfigs })
    }))
  }

  async createRecords({ tableId, data, fieldConfigs }: { tableId: string; data: Record<string, any>[]; fieldConfigs: { id?: string | undefined; field: Field; fieldId: string; tableConfigId?: string | undefined; }[]; }): Promise<types.IntegrationRecord[]> {
    if ( data.length === 0 ) { return [] };
    if ( !this.base ) { throw new Error("Didn't initialize Airtable")};
    const returnFieldsByFieldId = fieldConfigs.filter(field => !field.fieldId.startsWith('fld')).length === 0;
    const params = returnFieldsByFieldId ? { typecast: true, returnFieldsByFieldId } : { typecast: true };

    return Promise.all(
      _.chunk(data, 10)
        .map(async dataChunk => {
          return this.base!(tableId).create(dataChunk.map(fields => ({ fields })), params)
            .then(records => records.map(record => ({ id: record.id, object: record, properties: parseRecordProperties({ record, fieldConfigs })})))
        })
    )
    .then(responses => responses.reduce(( prevValue, curValue ) => prevValue.concat(curValue), []))
  }

  async updateRecords({ tableId, data, fieldConfigs }: { tableId: string; data: { fields: Record<string, any>; record: types.IntegrationRecord; }[]; fieldConfigs: { id?: string | undefined; field: Field; fieldId: string; tableConfigId?: string | undefined; }[]; }): Promise<types.IntegrationRecord[]> {
    if ( data.length === 0 ) { return [] };
    if ( !this.base ) { throw new Error("Didn't initialize Airtable")};
    return Promise.all(
      _.chunk(data, 10)
      .map(async dataChunk => {
        const formattedRecords = dataChunk.map(dc => ({ id: dc.record.id as string, fields: dc.fields }))
        return this.base!(tableId).update(formattedRecords)
          .then(records => records.map(record => ({ id: record.id, object: record, properties: {} as Record<Field, any>}))) // Waiting for Airtable to allow returnFieldsByFieldId
      })
    )
      .then(responses => responses.reduce((all, response) => all.concat(response), []))
  }

  async deleteRecords({ tableId, records }: { tableId: string; records: types.IntegrationRecord[]; }): Promise<void> {
    if ( !this.base ) { throw new Error("Didn't initialize Airtable")};
    if ( records.length ) { return; }
    await Promise.all(
      _.chunk(records, 10)
      .map(async recordChunk => {
        return this.base!(tableId).destroy(recordChunk.map(record => record.id as string))
      })
    )
  }
}