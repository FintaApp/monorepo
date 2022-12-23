import airtable from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base";
import axios, { AxiosInstance } from "axios";
import { AirtableCredential, Integration, SyncError } from "@prisma/client";
import { GetDestinationTablesRepsonse, IntegrationBase, IntegrationBaseProps, ValidateDestinationCredentialsResponse } from "../base";
import { db } from "~/lib/db";
import moment from "moment-timezone";
import { getAuthorizationHeader } from "./_helpers";
import { GetBasesResponse, GetBaseTablesResponse } from "./types";

interface AirtableProps extends IntegrationBaseProps {
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

  async validateCredentials(): Promise<ValidateDestinationCredentialsResponse> {
    if ( !this.client ) { throw new Error("Didn't initialize Airtable")}
    return this.client.get('/meta/whoami')
    .then(() => ({ isValid: true }))
    .catch(error => {
      const data = error.response.data;
      if ( data.error.type === 'NOT_FOUND' ) { return { isValid: true }};
      return { isValid: false, error: { code: SyncError.InvalidCredentials, message: "Finta is unable to access Airtable with the given credentials" }}
    })
  }  

  async getTables(): Promise<GetDestinationTablesRepsonse> {
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
}