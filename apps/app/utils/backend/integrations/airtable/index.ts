import airtable from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base";
import AirtableError from "airtable/lib/airtable_error";
import axios, { AxiosInstance } from "axios";
import moment from "moment-timezone";
import { graphql } from "~/graphql/backend";
import { Integrations_Enum } from "~/graphql/backend/sdk";
import { GetAirtableBasesResponse, GetDestinationTablesResponse, ValidateDestinationCredentialsResponse } from "~/types/shared/functions";
import _ from "lodash";

import { AirtableAuthentication, DestinationErrorCode, TableConfig, TableConfigFields } from "~/types/shared/models";
import { IntegrationBase, IntegrationBaseProps, IntegrationRecord, ValidateTableConfigProps, ValidateTableConfigResponse } from "../base";
import { GetBasesResponse, GetBaseTablesResponse } from "./types";
import { getAuthorizationHeader, parseAirtableError } from "./_helpers";
import * as formatter from "./formatter";
import { parseRecordProperties } from "./formatter/helper";

export class Airtable extends IntegrationBase {
  baseId: string;
  base: AirtableBase;
  client: AxiosInstance;
  isLegacy: boolean;

  constructor({ authentication, logger, userId }: IntegrationBaseProps) { 
    super({ authentication, userId, logger }); 
    this.integration = Integrations_Enum.Airtable;
    this.isLegacy = !!(authentication as AirtableAuthentication).api_key;
  }  

  formatter = formatter

  async init(): Promise<void> {
    const { api_key: apiKey, base_id: baseId } = this.authentication as AirtableAuthentication;
    this.baseId = baseId;

    if ( apiKey ) {
      this.logger.info("Destination uses legacy Airtable integration");
      this.base = new airtable({ apiKey }).base(baseId)
      this.client = axios.create({
        baseURL: "https://api.airtable.com/v0",
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      return;
    }

    // Oauth Integrations
    const token = await graphql.GetAirtableToken({ userId: this.userId })
      .then(async response => {
        this.logger.info("Fetched Airtable token", { response });
        const token = response.airtableTokens[0];

        if ( !token ) { throw new Error("No accessToken Token") }

        if ( moment(token.accessTokenExpiresAt).isAfter(moment().add('5', 'minutes')) ) { return token; }

        this.logger.info("Refreshing token");
        const refreshResponse = await axios.post(
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
        );
        const data = refreshResponse.data;
        this.logger.info("Refresh response", { data });
        return graphql.UpdateAirtableToken({ id: token.id, _set: {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          refreshedAt: moment().toDate(),
          accessTokenExpiresAt: moment().add(parseInt(data.expires_in), 'seconds'),
          refreshTokenExpiresAt: moment().add(parseInt(data.refresh_expires_in), 'seconds')
        }}).then(resp => {
          this.logger.info("Updated Airtable token", { response: resp });
          return resp.airtableToken!
        })

      })

    this.base = new airtable({ apiKey: token.accessToken }).base(this.baseId);
    this.client = axios.create({
      baseURL: "https://api.airtable.com/v0",
      headers: { 'Authorization': `Bearer ${token.accessToken}` }
    })
  }

  async validateAuthentication(): Promise<ValidateDestinationCredentialsResponse> {
    return this.client.get('/meta/whoami')
    .then(response => {
      this.logger.info("Meta whoami response", { data: response.data });
      return { isValid: true }
    })
    .catch(error => {
      const data = error.response.data;
      this.logger.info("Meta whoami response", { data });
      if ( data.error.type === 'NOT_FOUND' ) { return { isValid: true }};
      return { isValid: false, error: DestinationErrorCode.INVALID_CREDENTIALS, message: "Finta is unable to access Airtable with the given credentials" }
    })
  }

  async getTables(): Promise<GetDestinationTablesResponse> {
    if ( this.isLegacy ) { return { tables: []} };
    return this.client.get(`/meta/bases/${this.baseId}/tables`)
      .then(response => {
        this.logger.info("Get tables response", { response: response.data });
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

    async getBases(): Promise<GetAirtableBasesResponse> {
    return this.client.get('/meta/bases')
      .then(response => {
        const bases = (response.data as GetBasesResponse).bases
          .filter(base => [ 'edit', 'create' ].includes(base.permissionLevel))
          .map(base => ({ id: base.id, name: base.name }))
        return { bases }
      })
  }

  async _validateTableConfig({ tableId, tableType, fields }: ValidateTableConfigProps): Promise<ValidateTableConfigResponse> {
    return this.base(tableId).select({ fields: fields.map(field => field.field_id), maxRecords: 1}).all()
      .then(() => ({ isValid: true }))
      .catch(async (err: AirtableError) => {
        const error = await parseAirtableError(err, tableId, tableType);
        return { isValid: false, error }
      })
  }

  async queryTable({ tableId, tableConfigFields }: { tableId: string; tableConfigFields: { field: TableConfigFields; field_id: string; }[]; }): Promise<IntegrationRecord[]> {
    const returnFieldsByFieldId = tableConfigFields.filter(field => !field.field_id.startsWith('fld')).length === 0;
    const records = await this.base(tableId).select({ returnFieldsByFieldId }).all()
    return records.map(record => ({ 
      id: record.id, 
      object: record, 
      properties: parseRecordProperties({ record, tableConfigFields })
    }))
  }

  async createRecords({ tableId, data, tableConfigFields }: { tableId: string; data: Record<string, any>[]; tableConfigFields: TableConfig['fields']}): Promise<IntegrationRecord[]> {
    const returnFieldsByFieldId = tableConfigFields.filter(field => !field.field_id.startsWith('fld')).length === 0;
    if ( data.length === 0 ) { return [] };
    return Promise.all(
      _.chunk(data, 10)
        .map(async dataChunk => {
          // @ts-ignore
          return this.base(tableId).create(dataChunk.map(fields => ({ fields })), { typecast: true, returnFieldsByFieldId })
            .then(records => records.map(record => ({ id: record.id, object: record, properties: parseRecordProperties({ record, tableConfigFields })})))
        })
    )
      .then(responses => responses.reduce(( all, response ) => all.concat(response), []))
  }

  async updateRecords({ tableId, data, tableConfigFields }: { tableId: string, data: { fields: Record<string, any>, record: IntegrationRecord }[]; tableConfigFields: TableConfig['fields']}): Promise<IntegrationRecord[]> { 
    const returnFieldsByFieldId = tableConfigFields.filter(field => !field.field_id.startsWith('fld')).length === 0;
    if ( data.length === 0 ) { return [] };
    return Promise.all(
      _.chunk(data, 10)
      .map(async dataChunk => {
        const formattedRecords = dataChunk.map(dc => ({ id: dc.record.id as string, fields: dc.fields }))
        return this.base(tableId).update(formattedRecords)
          .then(records => records.map(record => ({ id: record.id, object: record, properties: {} as Record<TableConfigFields, any>}))) // Waiting for Airtable to allow returnFieldsByFieldId
      })
    )
      .then(responses => responses.reduce((all, response) => all.concat(response), []))
  }

  async deleteRecords({ tableId, records }: { tableId: string; records: IntegrationRecord[]}) {
    if ( records.length ) { return; }
    await Promise.all(
      _.chunk(records, 10)
      .map(async recordChunk => {
        return this.base(tableId).destroy(recordChunk.map(record => record.id as string))
      })
    )
  }
}