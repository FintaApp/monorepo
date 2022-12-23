import { z } from "zod";
import * as PrismaClient from "@prisma/client";

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

// PRISMA GENERATED ENUMS
//------------------------------------------------------

export const AccountScalarFieldEnumSchema = z.nativeEnum(PrismaClient.Prisma.AccountScalarFieldEnum);

export const AirtableAuthorizationCacheScalarFieldEnumSchema = z.nativeEnum(PrismaClient.Prisma.AirtableAuthorizationCacheScalarFieldEnum);

export const AirtableCredentialScalarFieldEnumSchema = z.nativeEnum(PrismaClient.Prisma.AirtableCredentialScalarFieldEnum);

export const AirtableTokenScalarFieldEnumSchema = z.nativeEnum(PrismaClient.Prisma.AirtableTokenScalarFieldEnum);

export const CodaCredentialScalarFieldEnumSchema = z.nativeEnum(PrismaClient.Prisma.CodaCredentialScalarFieldEnum);

export const DestinationFieldConfigScalarFieldEnumSchema = z.nativeEnum(PrismaClient.Prisma.DestinationFieldConfigScalarFieldEnum);

export const DestinationScalarFieldEnumSchema = z.nativeEnum(PrismaClient.Prisma.DestinationScalarFieldEnum);

export const DestinationTableConfigScalarFieldEnumSchema = z.nativeEnum(PrismaClient.Prisma.DestinationTableConfigScalarFieldEnum);

export const GoogleSheetsCredentialScalarFieldEnumSchema = z.nativeEnum(PrismaClient.Prisma.GoogleSheetsCredentialScalarFieldEnum);

export const JsonNullValueFilterSchema = z.enum(['DbNull', 'JsonNull', 'AnyNull',]);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]);

export const LinkTokenScalarFieldEnumSchema = z.nativeEnum(PrismaClient.Prisma.LinkTokenScalarFieldEnum);

export const NotionCredentialScalarFieldEnumSchema = z.nativeEnum(PrismaClient.Prisma.NotionCredentialScalarFieldEnum);

export const PlaidAccountScalarFieldEnumSchema = z.nativeEnum(PrismaClient.Prisma.PlaidAccountScalarFieldEnum);

export const PlaidInstitutionScalarFieldEnumSchema = z.nativeEnum(PrismaClient.Prisma.PlaidInstitutionScalarFieldEnum);

export const PlaidItemScalarFieldEnumSchema = z.nativeEnum(PrismaClient.Prisma.PlaidItemScalarFieldEnum);

export const SessionScalarFieldEnumSchema = z.nativeEnum(PrismaClient.Prisma.SessionScalarFieldEnum);

export const SortOrderSchema = z.nativeEnum(PrismaClient.Prisma.SortOrder);

export const SyncLogScalarFieldEnumSchema = z.nativeEnum(PrismaClient.Prisma.SyncLogScalarFieldEnum);

export const TransactionIsolationLevelSchema = z.nativeEnum(PrismaClient.Prisma.TransactionIsolationLevel);

export const UserScalarFieldEnumSchema = z.nativeEnum(PrismaClient.Prisma.UserScalarFieldEnum);

export const VerificationTokenScalarFieldEnumSchema = z.nativeEnum(PrismaClient.Prisma.VerificationTokenScalarFieldEnum);

// CUSTOM ENUMS
//------------------------------------------------------

export const FrequencySchema = z.nativeEnum(PrismaClient.Frequency);

export const IntegrationSchema = z.nativeEnum(PrismaClient.Integration);

export const TableSchema = z.nativeEnum(PrismaClient.Table);

export const FieldSchema = z.nativeEnum(PrismaClient.Field);

export const SyncErrorSchema = z.nativeEnum(PrismaClient.SyncError);

/////////////////////////////////////////
// HELPER TYPES
/////////////////////////////////////////

type NullableJsonInput = PrismaClient.Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | PrismaClient.Prisma.NullTypes.DbNull | PrismaClient.Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return PrismaClient.Prisma.DbNull;
  if (v === 'JsonNull') return PrismaClient.Prisma.JsonNull;
  return v;
};

export const JsonValue: z.ZodType<PrismaClient.Prisma.JsonValue> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.lazy(() => z.array(JsonValue)),
  z.lazy(() => z.record(JsonValue)),
]);

export const NullableJsonValue = z
  .union([JsonValue, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export const InputJsonValue: z.ZodType<PrismaClient.Prisma.InputJsonValue> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.lazy(() => z.array(InputJsonValue.nullable())),
  z.lazy(() => z.record(InputJsonValue.nullable())),
]);

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

// ACCOUNT
//------------------------------------------------------

export const AccountSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullish(),
  access_token: z.string().nullish(),
  expires_at: z.date().nullish(),
  token_type: z.string().nullish(),
  scope: z.string(),
  id_token: z.string().nullish(),
  session_state: z.string().nullish(),
});

// SESSION
//------------------------------------------------------

export const SessionSchema = z.object({
  id: z.string(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.date(),
});

// USER
//------------------------------------------------------

export const UserSchema = z.object({
  periodicUpdatesFrequency: FrequencySchema,
  id: z.string(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  emailVerified: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  image: z.string().nullish(),
  disabledAt: z.date().nullish(),
  timezone: z.string(),
  stripeCustomerId: z.string(),
  isSubsribedGeneral: z.boolean(),
  isSubscribedPeriodicUpdates: z.boolean(),
  periodicUpdatesJobId: z.string().nullish(),
});

// VERIFICATION TOKEN
//------------------------------------------------------

export const VerificationTokenSchema = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.date(),
});

// PLAID INSTITUTION
//------------------------------------------------------

export const PlaidInstitutionSchema = z.object({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string().nullish(),
});

// PLAID ITEM
//------------------------------------------------------

export const PlaidItemSchema = z.object({
  id: z.string(),
  institutionId: z.string(),
  userId: z.string(),
  isInitialUpdateComplete: z.boolean(),
  isHistoricalUpdateComplete: z.boolean(),
  error: z.string().nullish(),
  accessToken: z.string(),
  plaidSyncCursor: z.string().nullish(),
  availableProducts: InputJsonValue,
  billedProducts: InputJsonValue,
  lastSyncedAt: z.date().nullish(),
  consentExpiresAt: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  disabledAt: z.date().nullish(),
});

// PLAID ACCOUNT
//------------------------------------------------------

export const PlaidAccountSchema = z.object({
  id: z.string(),
  plaidItemId: z.string(),
  name: z.string(),
  mask: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// LINK TOKEN
//------------------------------------------------------

export const LinkTokenSchema = z.object({
  id: z.string(),
  token: z.string(),
  userId: z.string(),
});

// DESTINATION
//------------------------------------------------------

export const DestinationSchema = z.object({
  integration: IntegrationSchema,
  id: z.string(),
  userId: z.string(),
  airtableCredentialId: z.string().nullish(),
  codaCredentialId: z.string().nullish(),
  googleSheetsCredentialId: z.string().nullish(),
  notionCredentialId: z.string().nullish(),
  name: z.string(),
  syncStartDate: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  disabledAt: z.date().nullish(),
});

// DESTINATION TABLE CONFIG
//------------------------------------------------------

export const DestinationTableConfigSchema = z.object({
  table: TableSchema,
  id: z.string(),
  destinationId: z.string(),
  isEnabled: z.boolean(),
  tableId: z.string(),
});

// DESTINATION FIELD CONFIG
//------------------------------------------------------

export const DestinationFieldConfigSchema = z.object({
  field: FieldSchema,
  id: z.string(),
  tableConfigId: z.string(),
  fieldId: z.string(),
});

// AIRTABLE CREDENTIAL
//------------------------------------------------------

export const AirtableCredentialSchema = z.object({
  id: z.string(),
  baseId: z.string(),
  apiKey: z.string().nullish(),
});

// AIRTABLE AUTHORIZATION CACHE
//------------------------------------------------------

export const AirtableAuthorizationCacheSchema = z.object({
  id: z.string(),
  userId: z.string(),
  state: z.string(),
  codeVerifier: z.string(),
});

// AIRTABLE TOKEN
//------------------------------------------------------

export const AirtableTokenSchema = z.object({
  id: z.string(),
  userId: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
  tokenType: z.string(),
  scope: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  refreshedAt: z.date(),
  accessTokenExpiresAt: z.date(),
  refreshTokenExpiresAt: z.date(),
});

// CODA CREDENTIAL
//------------------------------------------------------

export const CodaCredentialSchema = z.object({
  id: z.string(),
  accessToken: z.string(),
  accessTokenHash: z.string(),
});

// GOOGLE SHEETS CREDENTIAL
//------------------------------------------------------

export const GoogleSheetsCredentialSchema = z.object({
  id: z.string(),
  spreadsheetId: z.string(),
});

// NOTION CREDENTIAL
//------------------------------------------------------

export const NotionCredentialSchema = z.object({
  id: z.string(),
  botId: z.string(),
  userId: z.string(),
  accessToken: z.string(),
  workspaceId: z.string(),
  workspaceName: z.string().nullish(),
  workspaceIcon: z.string().nullish(),
  owner: InputJsonValue,
  createdAt: z.date(),
  updatedAt: z.date(),
});

// SYNC LOG
//------------------------------------------------------

export const SyncLogSchema = z.object({
  error: SyncErrorSchema.nullish(),
  id: z.string(),
});

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// ACCOUNT
//------------------------------------------------------

export const AccountArgsSchema: z.ZodType<PrismaClient.Prisma.AccountArgs> = z.object({
  select: z.lazy(() => AccountSelectSchema).optional(),
  include: z.lazy(() => AccountIncludeSchema).optional(),
}).strict();

export const AccountIncludeSchema: z.ZodType<PrismaClient.Prisma.AccountInclude> = z.object({
  user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

export const AccountSelectSchema: z.ZodType<PrismaClient.Prisma.AccountSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  type: z.boolean().optional(),
  provider: z.boolean().optional(),
  providerAccountId: z.boolean().optional(),
  refresh_token: z.boolean().optional(),
  access_token: z.boolean().optional(),
  expires_at: z.boolean().optional(),
  token_type: z.boolean().optional(),
  scope: z.boolean().optional(),
  id_token: z.boolean().optional(),
  session_state: z.boolean().optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

// SESSION
//------------------------------------------------------

export const SessionArgsSchema: z.ZodType<PrismaClient.Prisma.SessionArgs> = z.object({
  select: z.lazy(() => SessionSelectSchema).optional(),
  include: z.lazy(() => SessionIncludeSchema).optional(),
}).strict();

export const SessionIncludeSchema: z.ZodType<PrismaClient.Prisma.SessionInclude> = z.object({
  user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

export const SessionSelectSchema: z.ZodType<PrismaClient.Prisma.SessionSelect> = z.object({
  id: z.boolean().optional(),
  sessionToken: z.boolean().optional(),
  userId: z.boolean().optional(),
  expires: z.boolean().optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

// USER
//------------------------------------------------------

export const UserArgsSchema: z.ZodType<PrismaClient.Prisma.UserArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserIncludeSchema: z.ZodType<PrismaClient.Prisma.UserInclude> = z.object({
  linkTokens: z.union([z.boolean(), z.lazy(() => LinkTokenFindManyArgsSchema)]).optional(),
  accounts: z.union([z.boolean(), z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  sessions: z.union([z.boolean(), z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  plaidItems: z.union([z.boolean(), z.lazy(() => PlaidItemFindManyArgsSchema)]).optional(),
  airtableTokens: z.union([z.boolean(), z.lazy(() => AirtableTokenFindManyArgsSchema)]).optional(),
  airtableAuthorizationCache: z.union([z.boolean(), z.lazy(() => AirtableAuthorizationCacheArgsSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<PrismaClient.Prisma.UserCountOutputTypeArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<PrismaClient.Prisma.UserCountOutputTypeSelect> = z.object({
  linkTokens: z.boolean().optional(),
  accounts: z.boolean().optional(),
  sessions: z.boolean().optional(),
  plaidItems: z.boolean().optional(),
  airtableTokens: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<PrismaClient.Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  image: z.boolean().optional(),
  disabledAt: z.boolean().optional(),
  timezone: z.boolean().optional(),
  stripeCustomerId: z.boolean().optional(),
  isSubsribedGeneral: z.boolean().optional(),
  isSubscribedPeriodicUpdates: z.boolean().optional(),
  periodicUpdatesFrequency: z.boolean().optional(),
  periodicUpdatesJobId: z.boolean().optional(),
  linkTokens: z.union([z.boolean(), z.lazy(() => LinkTokenFindManyArgsSchema)]).optional(),
  accounts: z.union([z.boolean(), z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  sessions: z.union([z.boolean(), z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  plaidItems: z.union([z.boolean(), z.lazy(() => PlaidItemFindManyArgsSchema)]).optional(),
  airtableTokens: z.union([z.boolean(), z.lazy(() => AirtableTokenFindManyArgsSchema)]).optional(),
  airtableAuthorizationCache: z.union([z.boolean(), z.lazy(() => AirtableAuthorizationCacheArgsSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict();

// VERIFICATION TOKEN
//------------------------------------------------------

export const VerificationTokenSelectSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenSelect> = z.object({
  identifier: z.boolean().optional(),
  token: z.boolean().optional(),
  expires: z.boolean().optional(),
}).strict();

// PLAID INSTITUTION
//------------------------------------------------------

export const PlaidInstitutionArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionArgs> = z.object({
  select: z.lazy(() => PlaidInstitutionSelectSchema).optional(),
  include: z.lazy(() => PlaidInstitutionIncludeSchema).optional(),
}).strict();

export const PlaidInstitutionIncludeSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionInclude> = z.object({
  items: z.union([z.boolean(), z.lazy(() => PlaidItemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => PlaidInstitutionCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const PlaidInstitutionCountOutputTypeArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionCountOutputTypeArgs> = z.object({
  select: z.lazy(() => PlaidInstitutionCountOutputTypeSelectSchema).nullish(),
}).strict();

export const PlaidInstitutionCountOutputTypeSelectSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionCountOutputTypeSelect> = z.object({
  items: z.boolean().optional(),
}).strict();

export const PlaidInstitutionSelectSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  logoUrl: z.boolean().optional(),
  items: z.union([z.boolean(), z.lazy(() => PlaidItemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => PlaidInstitutionCountOutputTypeArgsSchema)]).optional(),
}).strict();

// PLAID ITEM
//------------------------------------------------------

export const PlaidItemArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidItemArgs> = z.object({
  select: z.lazy(() => PlaidItemSelectSchema).optional(),
  include: z.lazy(() => PlaidItemIncludeSchema).optional(),
}).strict();

export const PlaidItemIncludeSchema: z.ZodType<PrismaClient.Prisma.PlaidItemInclude> = z.object({
  user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
  institution: z.union([z.boolean(), z.lazy(() => PlaidInstitutionArgsSchema)]).optional(),
  accounts: z.union([z.boolean(), z.lazy(() => PlaidAccountFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => PlaidItemCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const PlaidItemCountOutputTypeArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidItemCountOutputTypeArgs> = z.object({
  select: z.lazy(() => PlaidItemCountOutputTypeSelectSchema).nullish(),
}).strict();

export const PlaidItemCountOutputTypeSelectSchema: z.ZodType<PrismaClient.Prisma.PlaidItemCountOutputTypeSelect> = z.object({
  accounts: z.boolean().optional(),
}).strict();

export const PlaidItemSelectSchema: z.ZodType<PrismaClient.Prisma.PlaidItemSelect> = z.object({
  id: z.boolean().optional(),
  institutionId: z.boolean().optional(),
  userId: z.boolean().optional(),
  isInitialUpdateComplete: z.boolean().optional(),
  isHistoricalUpdateComplete: z.boolean().optional(),
  error: z.boolean().optional(),
  accessToken: z.boolean().optional(),
  plaidSyncCursor: z.boolean().optional(),
  availableProducts: z.boolean().optional(),
  billedProducts: z.boolean().optional(),
  lastSyncedAt: z.boolean().optional(),
  consentExpiresAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  disabledAt: z.boolean().optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
  institution: z.union([z.boolean(), z.lazy(() => PlaidInstitutionArgsSchema)]).optional(),
  accounts: z.union([z.boolean(), z.lazy(() => PlaidAccountFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => PlaidItemCountOutputTypeArgsSchema)]).optional(),
}).strict();

// PLAID ACCOUNT
//------------------------------------------------------

export const PlaidAccountArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountArgs> = z.object({
  select: z.lazy(() => PlaidAccountSelectSchema).optional(),
  include: z.lazy(() => PlaidAccountIncludeSchema).optional(),
}).strict();

export const PlaidAccountIncludeSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountInclude> = z.object({
  destinations: z.union([z.boolean(), z.lazy(() => DestinationFindManyArgsSchema)]).optional(),
  item: z.union([z.boolean(), z.lazy(() => PlaidItemArgsSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => PlaidAccountCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const PlaidAccountCountOutputTypeArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountCountOutputTypeArgs> = z.object({
  select: z.lazy(() => PlaidAccountCountOutputTypeSelectSchema).nullish(),
}).strict();

export const PlaidAccountCountOutputTypeSelectSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountCountOutputTypeSelect> = z.object({
  destinations: z.boolean().optional(),
}).strict();

export const PlaidAccountSelectSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountSelect> = z.object({
  id: z.boolean().optional(),
  plaidItemId: z.boolean().optional(),
  name: z.boolean().optional(),
  mask: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  destinations: z.union([z.boolean(), z.lazy(() => DestinationFindManyArgsSchema)]).optional(),
  item: z.union([z.boolean(), z.lazy(() => PlaidItemArgsSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => PlaidAccountCountOutputTypeArgsSchema)]).optional(),
}).strict();

// LINK TOKEN
//------------------------------------------------------

export const LinkTokenArgsSchema: z.ZodType<PrismaClient.Prisma.LinkTokenArgs> = z.object({
  select: z.lazy(() => LinkTokenSelectSchema).optional(),
  include: z.lazy(() => LinkTokenIncludeSchema).optional(),
}).strict();

export const LinkTokenIncludeSchema: z.ZodType<PrismaClient.Prisma.LinkTokenInclude> = z.object({
  user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

export const LinkTokenSelectSchema: z.ZodType<PrismaClient.Prisma.LinkTokenSelect> = z.object({
  id: z.boolean().optional(),
  token: z.boolean().optional(),
  userId: z.boolean().optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

// DESTINATION
//------------------------------------------------------

export const DestinationArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationArgs> = z.object({
  select: z.lazy(() => DestinationSelectSchema).optional(),
  include: z.lazy(() => DestinationIncludeSchema).optional(),
}).strict();

export const DestinationIncludeSchema: z.ZodType<PrismaClient.Prisma.DestinationInclude> = z.object({
  airtableCredential: z.union([z.boolean(), z.lazy(() => AirtableCredentialArgsSchema)]).optional(),
  codaCredential: z.union([z.boolean(), z.lazy(() => CodaCredentialArgsSchema)]).optional(),
  googleSheetsCredential: z.union([z.boolean(), z.lazy(() => GoogleSheetsCredentialArgsSchema)]).optional(),
  notionCredential: z.union([z.boolean(), z.lazy(() => NotionCredentialArgsSchema)]).optional(),
  accounts: z.union([z.boolean(), z.lazy(() => PlaidAccountFindManyArgsSchema)]).optional(),
  tableConfigs: z.union([z.boolean(), z.lazy(() => DestinationTableConfigFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => DestinationCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const DestinationCountOutputTypeArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationCountOutputTypeArgs> = z.object({
  select: z.lazy(() => DestinationCountOutputTypeSelectSchema).nullish(),
}).strict();

export const DestinationCountOutputTypeSelectSchema: z.ZodType<PrismaClient.Prisma.DestinationCountOutputTypeSelect> = z.object({
  accounts: z.boolean().optional(),
  tableConfigs: z.boolean().optional(),
}).strict();

export const DestinationSelectSchema: z.ZodType<PrismaClient.Prisma.DestinationSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  airtableCredentialId: z.boolean().optional(),
  airtableCredential: z.union([z.boolean(), z.lazy(() => AirtableCredentialArgsSchema)]).optional(),
  codaCredentialId: z.boolean().optional(),
  codaCredential: z.union([z.boolean(), z.lazy(() => CodaCredentialArgsSchema)]).optional(),
  googleSheetsCredentialId: z.boolean().optional(),
  googleSheetsCredential: z.union([z.boolean(), z.lazy(() => GoogleSheetsCredentialArgsSchema)]).optional(),
  notionCredentialId: z.boolean().optional(),
  notionCredential: z.union([z.boolean(), z.lazy(() => NotionCredentialArgsSchema)]).optional(),
  integration: z.boolean().optional(),
  name: z.boolean().optional(),
  syncStartDate: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  disabledAt: z.boolean().optional(),
  accounts: z.union([z.boolean(), z.lazy(() => PlaidAccountFindManyArgsSchema)]).optional(),
  tableConfigs: z.union([z.boolean(), z.lazy(() => DestinationTableConfigFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => DestinationCountOutputTypeArgsSchema)]).optional(),
}).strict();

// DESTINATION TABLE CONFIG
//------------------------------------------------------

export const DestinationTableConfigArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigArgs> = z.object({
  select: z.lazy(() => DestinationTableConfigSelectSchema).optional(),
  include: z.lazy(() => DestinationTableConfigIncludeSchema).optional(),
}).strict();

export const DestinationTableConfigIncludeSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigInclude> = z.object({
  destination: z.union([z.boolean(), z.lazy(() => DestinationArgsSchema)]).optional(),
  fieldConfigs: z.union([z.boolean(), z.lazy(() => DestinationFieldConfigFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => DestinationTableConfigCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const DestinationTableConfigCountOutputTypeArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigCountOutputTypeArgs> = z.object({
  select: z.lazy(() => DestinationTableConfigCountOutputTypeSelectSchema).nullish(),
}).strict();

export const DestinationTableConfigCountOutputTypeSelectSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigCountOutputTypeSelect> = z.object({
  fieldConfigs: z.boolean().optional(),
}).strict();

export const DestinationTableConfigSelectSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigSelect> = z.object({
  id: z.boolean().optional(),
  destinationId: z.boolean().optional(),
  destination: z.union([z.boolean(), z.lazy(() => DestinationArgsSchema)]).optional(),
  isEnabled: z.boolean().optional(),
  table: z.boolean().optional(),
  tableId: z.boolean().optional(),
  fieldConfigs: z.union([z.boolean(), z.lazy(() => DestinationFieldConfigFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => DestinationTableConfigCountOutputTypeArgsSchema)]).optional(),
}).strict();

// DESTINATION FIELD CONFIG
//------------------------------------------------------

export const DestinationFieldConfigArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigArgs> = z.object({
  select: z.lazy(() => DestinationFieldConfigSelectSchema).optional(),
  include: z.lazy(() => DestinationFieldConfigIncludeSchema).optional(),
}).strict();

export const DestinationFieldConfigIncludeSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigInclude> = z.object({
  tableConfig: z.union([z.boolean(), z.lazy(() => DestinationTableConfigArgsSchema)]).optional(),
}).strict();

export const DestinationFieldConfigSelectSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigSelect> = z.object({
  id: z.boolean().optional(),
  tableConfigId: z.boolean().optional(),
  tableConfig: z.union([z.boolean(), z.lazy(() => DestinationTableConfigArgsSchema)]).optional(),
  field: z.boolean().optional(),
  fieldId: z.boolean().optional(),
}).strict();

// AIRTABLE CREDENTIAL
//------------------------------------------------------

export const AirtableCredentialArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialArgs> = z.object({
  select: z.lazy(() => AirtableCredentialSelectSchema).optional(),
  include: z.lazy(() => AirtableCredentialIncludeSchema).optional(),
}).strict();

export const AirtableCredentialIncludeSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialInclude> = z.object({
  destination: z.union([z.boolean(), z.lazy(() => DestinationArgsSchema)]).optional(),
}).strict();

export const AirtableCredentialSelectSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialSelect> = z.object({
  id: z.boolean().optional(),
  baseId: z.boolean().optional(),
  apiKey: z.boolean().optional(),
  destination: z.union([z.boolean(), z.lazy(() => DestinationArgsSchema)]).optional(),
}).strict();

// AIRTABLE AUTHORIZATION CACHE
//------------------------------------------------------

export const AirtableAuthorizationCacheArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheArgs> = z.object({
  select: z.lazy(() => AirtableAuthorizationCacheSelectSchema).optional(),
  include: z.lazy(() => AirtableAuthorizationCacheIncludeSchema).optional(),
}).strict();

export const AirtableAuthorizationCacheIncludeSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheInclude> = z.object({
  user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

export const AirtableAuthorizationCacheSelectSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  state: z.boolean().optional(),
  codeVerifier: z.boolean().optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

// AIRTABLE TOKEN
//------------------------------------------------------

export const AirtableTokenArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenArgs> = z.object({
  select: z.lazy(() => AirtableTokenSelectSchema).optional(),
  include: z.lazy(() => AirtableTokenIncludeSchema).optional(),
}).strict();

export const AirtableTokenIncludeSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenInclude> = z.object({
  user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

export const AirtableTokenSelectSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
  accessToken: z.boolean().optional(),
  refreshToken: z.boolean().optional(),
  tokenType: z.boolean().optional(),
  scope: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  refreshedAt: z.boolean().optional(),
  accessTokenExpiresAt: z.boolean().optional(),
  refreshTokenExpiresAt: z.boolean().optional(),
}).strict();

// CODA CREDENTIAL
//------------------------------------------------------

export const CodaCredentialArgsSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialArgs> = z.object({
  select: z.lazy(() => CodaCredentialSelectSchema).optional(),
  include: z.lazy(() => CodaCredentialIncludeSchema).optional(),
}).strict();

export const CodaCredentialIncludeSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialInclude> = z.object({
  destination: z.union([z.boolean(), z.lazy(() => DestinationArgsSchema)]).optional(),
}).strict();

export const CodaCredentialSelectSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialSelect> = z.object({
  id: z.boolean().optional(),
  accessToken: z.boolean().optional(),
  accessTokenHash: z.boolean().optional(),
  destination: z.union([z.boolean(), z.lazy(() => DestinationArgsSchema)]).optional(),
}).strict();

// GOOGLE SHEETS CREDENTIAL
//------------------------------------------------------

export const GoogleSheetsCredentialArgsSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialArgs> = z.object({
  select: z.lazy(() => GoogleSheetsCredentialSelectSchema).optional(),
  include: z.lazy(() => GoogleSheetsCredentialIncludeSchema).optional(),
}).strict();

export const GoogleSheetsCredentialIncludeSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialInclude> = z.object({
  destination: z.union([z.boolean(), z.lazy(() => DestinationArgsSchema)]).optional(),
}).strict();

export const GoogleSheetsCredentialSelectSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialSelect> = z.object({
  id: z.boolean().optional(),
  spreadsheetId: z.boolean().optional(),
  destination: z.union([z.boolean(), z.lazy(() => DestinationArgsSchema)]).optional(),
}).strict();

// NOTION CREDENTIAL
//------------------------------------------------------

export const NotionCredentialArgsSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialArgs> = z.object({
  select: z.lazy(() => NotionCredentialSelectSchema).optional(),
  include: z.lazy(() => NotionCredentialIncludeSchema).optional(),
}).strict();

export const NotionCredentialIncludeSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialInclude> = z.object({
  destinations: z.union([z.boolean(), z.lazy(() => DestinationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => NotionCredentialCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const NotionCredentialCountOutputTypeArgsSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialCountOutputTypeArgs> = z.object({
  select: z.lazy(() => NotionCredentialCountOutputTypeSelectSchema).nullish(),
}).strict();

export const NotionCredentialCountOutputTypeSelectSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialCountOutputTypeSelect> = z.object({
  destinations: z.boolean().optional(),
}).strict();

export const NotionCredentialSelectSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialSelect> = z.object({
  id: z.boolean().optional(),
  botId: z.boolean().optional(),
  userId: z.boolean().optional(),
  accessToken: z.boolean().optional(),
  workspaceId: z.boolean().optional(),
  workspaceName: z.boolean().optional(),
  workspaceIcon: z.boolean().optional(),
  owner: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  destinations: z.union([z.boolean(), z.lazy(() => DestinationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => NotionCredentialCountOutputTypeArgsSchema)]).optional(),
}).strict();

// SYNC LOG
//------------------------------------------------------

export const SyncLogSelectSchema: z.ZodType<PrismaClient.Prisma.SyncLogSelect> = z.object({
  id: z.boolean().optional(),
  error: z.boolean().optional(),
}).strict();

/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const AccountWhereInputSchema: z.ZodType<PrismaClient.Prisma.AccountWhereInput> = z.object({
  AND: z.union([z.lazy(() => AccountWhereInputSchema), z.lazy(() => AccountWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => AccountWhereInputSchema), z.lazy(() => AccountWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  provider: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  providerAccountId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  refresh_token: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  access_token: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  expires_at: z.union([z.lazy(() => DateTimeNullableFilterSchema), z.date()]).optional().nullable(),
  token_type: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  scope: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  id_token: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  session_state: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  user: z.union([z.lazy(() => UserRelationFilterSchema), z.lazy(() => UserWhereInputSchema)]).optional(),
}).strict();

export const AccountOrderByWithRelationInputSchema: z.ZodType<PrismaClient.Prisma.AccountOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
}).strict();

export const AccountWhereUniqueInputSchema: z.ZodType<PrismaClient.Prisma.AccountWhereUniqueInput> = z.object({
  id: z.string().optional(),
  provider_providerAccountId: z.lazy(() => AccountProviderProviderAccountIdCompoundUniqueInputSchema).optional(),
}).strict();

export const AccountOrderByWithAggregationInputSchema: z.ZodType<PrismaClient.Prisma.AccountOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AccountCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AccountMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AccountMinOrderByAggregateInputSchema).optional(),
}).strict();

export const AccountScalarWhereWithAggregatesInputSchema: z.ZodType<PrismaClient.Prisma.AccountScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => AccountScalarWhereWithAggregatesInputSchema), z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => AccountScalarWhereWithAggregatesInputSchema), z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  provider: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  providerAccountId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  refresh_token: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
  access_token: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
  expires_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.date()]).optional().nullable(),
  token_type: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
  scope: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  id_token: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
  session_state: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
}).strict();

export const SessionWhereInputSchema: z.ZodType<PrismaClient.Prisma.SessionWhereInput> = z.object({
  AND: z.union([z.lazy(() => SessionWhereInputSchema), z.lazy(() => SessionWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => SessionWhereInputSchema), z.lazy(() => SessionWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  sessionToken: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  expires: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  user: z.union([z.lazy(() => UserRelationFilterSchema), z.lazy(() => UserWhereInputSchema)]).optional(),
}).strict();

export const SessionOrderByWithRelationInputSchema: z.ZodType<PrismaClient.Prisma.SessionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
}).strict();

export const SessionWhereUniqueInputSchema: z.ZodType<PrismaClient.Prisma.SessionWhereUniqueInput> = z.object({
  id: z.string().optional(),
  sessionToken: z.string().optional(),
}).strict();

export const SessionOrderByWithAggregationInputSchema: z.ZodType<PrismaClient.Prisma.SessionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SessionCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SessionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SessionMinOrderByAggregateInputSchema).optional(),
}).strict();

export const SessionScalarWhereWithAggregatesInputSchema: z.ZodType<PrismaClient.Prisma.SessionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => SessionScalarWhereWithAggregatesInputSchema), z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => SessionScalarWhereWithAggregatesInputSchema), z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  sessionToken: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  expires: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.date()]).optional(),
}).strict();

export const UserWhereInputSchema: z.ZodType<PrismaClient.Prisma.UserWhereInput> = z.object({
  AND: z.union([z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  email: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  emailVerified: z.union([z.lazy(() => DateTimeNullableFilterSchema), z.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  image: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  disabledAt: z.union([z.lazy(() => DateTimeNullableFilterSchema), z.date()]).optional().nullable(),
  timezone: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  stripeCustomerId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  isSubsribedGeneral: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
  isSubscribedPeriodicUpdates: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
  periodicUpdatesFrequency: z.union([z.lazy(() => EnumFrequencyFilterSchema), z.lazy(() => FrequencySchema)]).optional(),
  periodicUpdatesJobId: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenListRelationFilterSchema).optional(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemListRelationFilterSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenListRelationFilterSchema).optional(),
  airtableAuthorizationCache: z.union([z.lazy(() => AirtableAuthorizationCacheRelationFilterSchema), z.lazy(() => AirtableAuthorizationCacheWhereInputSchema)]).optional().nullable(),
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<PrismaClient.Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  disabledAt: z.lazy(() => SortOrderSchema).optional(),
  timezone: z.lazy(() => SortOrderSchema).optional(),
  stripeCustomerId: z.lazy(() => SortOrderSchema).optional(),
  isSubsribedGeneral: z.lazy(() => SortOrderSchema).optional(),
  isSubscribedPeriodicUpdates: z.lazy(() => SortOrderSchema).optional(),
  periodicUpdatesFrequency: z.lazy(() => SortOrderSchema).optional(),
  periodicUpdatesJobId: z.lazy(() => SortOrderSchema).optional(),
  linkTokens: z.lazy(() => LinkTokenOrderByRelationAggregateInputSchema).optional(),
  accounts: z.lazy(() => AccountOrderByRelationAggregateInputSchema).optional(),
  sessions: z.lazy(() => SessionOrderByRelationAggregateInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemOrderByRelationAggregateInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenOrderByRelationAggregateInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheOrderByWithRelationInputSchema).optional(),
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<PrismaClient.Prisma.UserWhereUniqueInput> = z.object({
  id: z.string().optional(),
  email: z.string().optional(),
}).strict();

export const UserOrderByWithAggregationInputSchema: z.ZodType<PrismaClient.Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  disabledAt: z.lazy(() => SortOrderSchema).optional(),
  timezone: z.lazy(() => SortOrderSchema).optional(),
  stripeCustomerId: z.lazy(() => SortOrderSchema).optional(),
  isSubsribedGeneral: z.lazy(() => SortOrderSchema).optional(),
  isSubscribedPeriodicUpdates: z.lazy(() => SortOrderSchema).optional(),
  periodicUpdatesFrequency: z.lazy(() => SortOrderSchema).optional(),
  periodicUpdatesJobId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<PrismaClient.Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
  email: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
  emailVerified: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.date()]).optional(),
  image: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
  disabledAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.date()]).optional().nullable(),
  timezone: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  stripeCustomerId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  isSubsribedGeneral: z.union([z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean()]).optional(),
  isSubscribedPeriodicUpdates: z.union([z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean()]).optional(),
  periodicUpdatesFrequency: z.union([z.lazy(() => EnumFrequencyWithAggregatesFilterSchema), z.lazy(() => FrequencySchema)]).optional(),
  periodicUpdatesJobId: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
}).strict();

export const VerificationTokenWhereInputSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenWhereInput> = z.object({
  AND: z.union([z.lazy(() => VerificationTokenWhereInputSchema), z.lazy(() => VerificationTokenWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => VerificationTokenWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => VerificationTokenWhereInputSchema), z.lazy(() => VerificationTokenWhereInputSchema).array()]).optional(),
  identifier: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  token: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  expires: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
}).strict();

export const VerificationTokenOrderByWithRelationInputSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenOrderByWithRelationInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const VerificationTokenWhereUniqueInputSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenWhereUniqueInput> = z.object({
  token: z.string().optional(),
  identifier_token: z.lazy(() => VerificationTokenIdentifierTokenCompoundUniqueInputSchema).optional(),
}).strict();

export const VerificationTokenOrderByWithAggregationInputSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenOrderByWithAggregationInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => VerificationTokenCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => VerificationTokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => VerificationTokenMinOrderByAggregateInputSchema).optional(),
}).strict();

export const VerificationTokenScalarWhereWithAggregatesInputSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema), z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema), z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array()]).optional(),
  identifier: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  token: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  expires: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.date()]).optional(),
}).strict();

export const PlaidInstitutionWhereInputSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionWhereInput> = z.object({
  AND: z.union([z.lazy(() => PlaidInstitutionWhereInputSchema), z.lazy(() => PlaidInstitutionWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => PlaidInstitutionWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => PlaidInstitutionWhereInputSchema), z.lazy(() => PlaidInstitutionWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  logoUrl: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  items: z.lazy(() => PlaidItemListRelationFilterSchema).optional(),
}).strict();

export const PlaidInstitutionOrderByWithRelationInputSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  logoUrl: z.lazy(() => SortOrderSchema).optional(),
  items: z.lazy(() => PlaidItemOrderByRelationAggregateInputSchema).optional(),
}).strict();

export const PlaidInstitutionWhereUniqueInputSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionWhereUniqueInput> = z.object({
  id: z.string().optional(),
}).strict();

export const PlaidInstitutionOrderByWithAggregationInputSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  logoUrl: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PlaidInstitutionCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PlaidInstitutionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PlaidInstitutionMinOrderByAggregateInputSchema).optional(),
}).strict();

export const PlaidInstitutionScalarWhereWithAggregatesInputSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => PlaidInstitutionScalarWhereWithAggregatesInputSchema), z.lazy(() => PlaidInstitutionScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => PlaidInstitutionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => PlaidInstitutionScalarWhereWithAggregatesInputSchema), z.lazy(() => PlaidInstitutionScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  logoUrl: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
}).strict();

export const PlaidItemWhereInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemWhereInput> = z.object({
  AND: z.union([z.lazy(() => PlaidItemWhereInputSchema), z.lazy(() => PlaidItemWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => PlaidItemWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => PlaidItemWhereInputSchema), z.lazy(() => PlaidItemWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  institutionId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  isInitialUpdateComplete: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
  isHistoricalUpdateComplete: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
  error: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  accessToken: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  plaidSyncCursor: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  availableProducts: z.lazy(() => JsonFilterSchema).optional(),
  billedProducts: z.lazy(() => JsonFilterSchema).optional(),
  lastSyncedAt: z.union([z.lazy(() => DateTimeNullableFilterSchema), z.date()]).optional().nullable(),
  consentExpiresAt: z.union([z.lazy(() => DateTimeNullableFilterSchema), z.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  disabledAt: z.union([z.lazy(() => DateTimeNullableFilterSchema), z.date()]).optional().nullable(),
  user: z.union([z.lazy(() => UserRelationFilterSchema), z.lazy(() => UserWhereInputSchema)]).optional(),
  institution: z.union([z.lazy(() => PlaidInstitutionRelationFilterSchema), z.lazy(() => PlaidInstitutionWhereInputSchema)]).optional(),
  accounts: z.lazy(() => PlaidAccountListRelationFilterSchema).optional(),
}).strict();

export const PlaidItemOrderByWithRelationInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  institutionId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  isInitialUpdateComplete: z.lazy(() => SortOrderSchema).optional(),
  isHistoricalUpdateComplete: z.lazy(() => SortOrderSchema).optional(),
  error: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  plaidSyncCursor: z.lazy(() => SortOrderSchema).optional(),
  availableProducts: z.lazy(() => SortOrderSchema).optional(),
  billedProducts: z.lazy(() => SortOrderSchema).optional(),
  lastSyncedAt: z.lazy(() => SortOrderSchema).optional(),
  consentExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  disabledAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  institution: z.lazy(() => PlaidInstitutionOrderByWithRelationInputSchema).optional(),
  accounts: z.lazy(() => PlaidAccountOrderByRelationAggregateInputSchema).optional(),
}).strict();

export const PlaidItemWhereUniqueInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemWhereUniqueInput> = z.object({
  id: z.string().optional(),
}).strict();

export const PlaidItemOrderByWithAggregationInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  institutionId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  isInitialUpdateComplete: z.lazy(() => SortOrderSchema).optional(),
  isHistoricalUpdateComplete: z.lazy(() => SortOrderSchema).optional(),
  error: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  plaidSyncCursor: z.lazy(() => SortOrderSchema).optional(),
  availableProducts: z.lazy(() => SortOrderSchema).optional(),
  billedProducts: z.lazy(() => SortOrderSchema).optional(),
  lastSyncedAt: z.lazy(() => SortOrderSchema).optional(),
  consentExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  disabledAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PlaidItemCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PlaidItemMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PlaidItemMinOrderByAggregateInputSchema).optional(),
}).strict();

export const PlaidItemScalarWhereWithAggregatesInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => PlaidItemScalarWhereWithAggregatesInputSchema), z.lazy(() => PlaidItemScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => PlaidItemScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => PlaidItemScalarWhereWithAggregatesInputSchema), z.lazy(() => PlaidItemScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  institutionId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  isInitialUpdateComplete: z.union([z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean()]).optional(),
  isHistoricalUpdateComplete: z.union([z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean()]).optional(),
  error: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
  accessToken: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  plaidSyncCursor: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
  availableProducts: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  billedProducts: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  lastSyncedAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.date()]).optional().nullable(),
  consentExpiresAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.date()]).optional(),
  disabledAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.date()]).optional().nullable(),
}).strict();

export const PlaidAccountWhereInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountWhereInput> = z.object({
  AND: z.union([z.lazy(() => PlaidAccountWhereInputSchema), z.lazy(() => PlaidAccountWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => PlaidAccountWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => PlaidAccountWhereInputSchema), z.lazy(() => PlaidAccountWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  plaidItemId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  mask: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  destinations: z.lazy(() => DestinationListRelationFilterSchema).optional(),
  item: z.union([z.lazy(() => PlaidItemRelationFilterSchema), z.lazy(() => PlaidItemWhereInputSchema)]).optional(),
}).strict();

export const PlaidAccountOrderByWithRelationInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  plaidItemId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  mask: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  destinations: z.lazy(() => DestinationOrderByRelationAggregateInputSchema).optional(),
  item: z.lazy(() => PlaidItemOrderByWithRelationInputSchema).optional(),
}).strict();

export const PlaidAccountWhereUniqueInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountWhereUniqueInput> = z.object({
  id: z.string().optional(),
}).strict();

export const PlaidAccountOrderByWithAggregationInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  plaidItemId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  mask: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PlaidAccountCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PlaidAccountMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PlaidAccountMinOrderByAggregateInputSchema).optional(),
}).strict();

export const PlaidAccountScalarWhereWithAggregatesInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => PlaidAccountScalarWhereWithAggregatesInputSchema), z.lazy(() => PlaidAccountScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => PlaidAccountScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => PlaidAccountScalarWhereWithAggregatesInputSchema), z.lazy(() => PlaidAccountScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  plaidItemId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  mask: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.date()]).optional(),
}).strict();

export const LinkTokenWhereInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenWhereInput> = z.object({
  AND: z.union([z.lazy(() => LinkTokenWhereInputSchema), z.lazy(() => LinkTokenWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => LinkTokenWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => LinkTokenWhereInputSchema), z.lazy(() => LinkTokenWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  token: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  user: z.union([z.lazy(() => UserRelationFilterSchema), z.lazy(() => UserWhereInputSchema)]).optional(),
}).strict();

export const LinkTokenOrderByWithRelationInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
}).strict();

export const LinkTokenWhereUniqueInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenWhereUniqueInput> = z.object({
  id: z.string().optional(),
  token: z.string().optional(),
  userId: z.string().optional(),
}).strict();

export const LinkTokenOrderByWithAggregationInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => LinkTokenCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => LinkTokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => LinkTokenMinOrderByAggregateInputSchema).optional(),
}).strict();

export const LinkTokenScalarWhereWithAggregatesInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => LinkTokenScalarWhereWithAggregatesInputSchema), z.lazy(() => LinkTokenScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => LinkTokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => LinkTokenScalarWhereWithAggregatesInputSchema), z.lazy(() => LinkTokenScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  token: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
}).strict();

export const DestinationWhereInputSchema: z.ZodType<PrismaClient.Prisma.DestinationWhereInput> = z.object({
  AND: z.union([z.lazy(() => DestinationWhereInputSchema), z.lazy(() => DestinationWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => DestinationWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => DestinationWhereInputSchema), z.lazy(() => DestinationWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  airtableCredentialId: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  airtableCredential: z.union([z.lazy(() => AirtableCredentialRelationFilterSchema), z.lazy(() => AirtableCredentialWhereInputSchema)]).optional().nullable(),
  codaCredentialId: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  codaCredential: z.union([z.lazy(() => CodaCredentialRelationFilterSchema), z.lazy(() => CodaCredentialWhereInputSchema)]).optional().nullable(),
  googleSheetsCredentialId: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  googleSheetsCredential: z.union([z.lazy(() => GoogleSheetsCredentialRelationFilterSchema), z.lazy(() => GoogleSheetsCredentialWhereInputSchema)]).optional().nullable(),
  notionCredentialId: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  notionCredential: z.union([z.lazy(() => NotionCredentialRelationFilterSchema), z.lazy(() => NotionCredentialWhereInputSchema)]).optional().nullable(),
  integration: z.union([z.lazy(() => EnumIntegrationFilterSchema), z.lazy(() => IntegrationSchema)]).optional(),
  name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  syncStartDate: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  disabledAt: z.union([z.lazy(() => DateTimeNullableFilterSchema), z.date()]).optional().nullable(),
  accounts: z.lazy(() => PlaidAccountListRelationFilterSchema).optional(),
  tableConfigs: z.lazy(() => DestinationTableConfigListRelationFilterSchema).optional(),
}).strict();

export const DestinationOrderByWithRelationInputSchema: z.ZodType<PrismaClient.Prisma.DestinationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  airtableCredentialId: z.lazy(() => SortOrderSchema).optional(),
  airtableCredential: z.lazy(() => AirtableCredentialOrderByWithRelationInputSchema).optional(),
  codaCredentialId: z.lazy(() => SortOrderSchema).optional(),
  codaCredential: z.lazy(() => CodaCredentialOrderByWithRelationInputSchema).optional(),
  googleSheetsCredentialId: z.lazy(() => SortOrderSchema).optional(),
  googleSheetsCredential: z.lazy(() => GoogleSheetsCredentialOrderByWithRelationInputSchema).optional(),
  notionCredentialId: z.lazy(() => SortOrderSchema).optional(),
  notionCredential: z.lazy(() => NotionCredentialOrderByWithRelationInputSchema).optional(),
  integration: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  syncStartDate: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  disabledAt: z.lazy(() => SortOrderSchema).optional(),
  accounts: z.lazy(() => PlaidAccountOrderByRelationAggregateInputSchema).optional(),
  tableConfigs: z.lazy(() => DestinationTableConfigOrderByRelationAggregateInputSchema).optional(),
}).strict();

export const DestinationWhereUniqueInputSchema: z.ZodType<PrismaClient.Prisma.DestinationWhereUniqueInput> = z.object({
  id: z.string().optional(),
  airtableCredentialId: z.string().optional(),
  codaCredentialId: z.string().optional(),
  googleSheetsCredentialId: z.string().optional(),
}).strict();

export const DestinationOrderByWithAggregationInputSchema: z.ZodType<PrismaClient.Prisma.DestinationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  airtableCredentialId: z.lazy(() => SortOrderSchema).optional(),
  codaCredentialId: z.lazy(() => SortOrderSchema).optional(),
  googleSheetsCredentialId: z.lazy(() => SortOrderSchema).optional(),
  notionCredentialId: z.lazy(() => SortOrderSchema).optional(),
  integration: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  syncStartDate: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  disabledAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => DestinationCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DestinationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DestinationMinOrderByAggregateInputSchema).optional(),
}).strict();

export const DestinationScalarWhereWithAggregatesInputSchema: z.ZodType<PrismaClient.Prisma.DestinationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => DestinationScalarWhereWithAggregatesInputSchema), z.lazy(() => DestinationScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => DestinationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => DestinationScalarWhereWithAggregatesInputSchema), z.lazy(() => DestinationScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  airtableCredentialId: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
  codaCredentialId: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
  googleSheetsCredentialId: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
  notionCredentialId: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
  integration: z.union([z.lazy(() => EnumIntegrationWithAggregatesFilterSchema), z.lazy(() => IntegrationSchema)]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  syncStartDate: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.date()]).optional(),
  disabledAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.date()]).optional().nullable(),
}).strict();

export const DestinationTableConfigWhereInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigWhereInput> = z.object({
  AND: z.union([z.lazy(() => DestinationTableConfigWhereInputSchema), z.lazy(() => DestinationTableConfigWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => DestinationTableConfigWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => DestinationTableConfigWhereInputSchema), z.lazy(() => DestinationTableConfigWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  destinationId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  destination: z.union([z.lazy(() => DestinationRelationFilterSchema), z.lazy(() => DestinationWhereInputSchema)]).optional(),
  isEnabled: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
  table: z.union([z.lazy(() => EnumTableFilterSchema), z.lazy(() => TableSchema)]).optional(),
  tableId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  fieldConfigs: z.lazy(() => DestinationFieldConfigListRelationFilterSchema).optional(),
}).strict();

export const DestinationTableConfigOrderByWithRelationInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  destinationId: z.lazy(() => SortOrderSchema).optional(),
  destination: z.lazy(() => DestinationOrderByWithRelationInputSchema).optional(),
  isEnabled: z.lazy(() => SortOrderSchema).optional(),
  table: z.lazy(() => SortOrderSchema).optional(),
  tableId: z.lazy(() => SortOrderSchema).optional(),
  fieldConfigs: z.lazy(() => DestinationFieldConfigOrderByRelationAggregateInputSchema).optional(),
}).strict();

export const DestinationTableConfigWhereUniqueInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigWhereUniqueInput> = z.object({
  id: z.string().optional(),
  destinationId_table: z.lazy(() => DestinationTableConfigDestinationIdTableCompoundUniqueInputSchema).optional(),
}).strict();

export const DestinationTableConfigOrderByWithAggregationInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  destinationId: z.lazy(() => SortOrderSchema).optional(),
  isEnabled: z.lazy(() => SortOrderSchema).optional(),
  table: z.lazy(() => SortOrderSchema).optional(),
  tableId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => DestinationTableConfigCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DestinationTableConfigMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DestinationTableConfigMinOrderByAggregateInputSchema).optional(),
}).strict();

export const DestinationTableConfigScalarWhereWithAggregatesInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => DestinationTableConfigScalarWhereWithAggregatesInputSchema), z.lazy(() => DestinationTableConfigScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => DestinationTableConfigScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => DestinationTableConfigScalarWhereWithAggregatesInputSchema), z.lazy(() => DestinationTableConfigScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  destinationId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  isEnabled: z.union([z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean()]).optional(),
  table: z.union([z.lazy(() => EnumTableWithAggregatesFilterSchema), z.lazy(() => TableSchema)]).optional(),
  tableId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
}).strict();

export const DestinationFieldConfigWhereInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigWhereInput> = z.object({
  AND: z.union([z.lazy(() => DestinationFieldConfigWhereInputSchema), z.lazy(() => DestinationFieldConfigWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => DestinationFieldConfigWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => DestinationFieldConfigWhereInputSchema), z.lazy(() => DestinationFieldConfigWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  tableConfigId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  tableConfig: z.union([z.lazy(() => DestinationTableConfigRelationFilterSchema), z.lazy(() => DestinationTableConfigWhereInputSchema)]).optional(),
  field: z.union([z.lazy(() => EnumFieldFilterSchema), z.lazy(() => FieldSchema)]).optional(),
  fieldId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
}).strict();

export const DestinationFieldConfigOrderByWithRelationInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tableConfigId: z.lazy(() => SortOrderSchema).optional(),
  tableConfig: z.lazy(() => DestinationTableConfigOrderByWithRelationInputSchema).optional(),
  field: z.lazy(() => SortOrderSchema).optional(),
  fieldId: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const DestinationFieldConfigWhereUniqueInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigWhereUniqueInput> = z.object({
  id: z.string().optional(),
  tableConfigId_field: z.lazy(() => DestinationFieldConfigTableConfigIdFieldCompoundUniqueInputSchema).optional(),
}).strict();

export const DestinationFieldConfigOrderByWithAggregationInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tableConfigId: z.lazy(() => SortOrderSchema).optional(),
  field: z.lazy(() => SortOrderSchema).optional(),
  fieldId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => DestinationFieldConfigCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DestinationFieldConfigMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DestinationFieldConfigMinOrderByAggregateInputSchema).optional(),
}).strict();

export const DestinationFieldConfigScalarWhereWithAggregatesInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => DestinationFieldConfigScalarWhereWithAggregatesInputSchema), z.lazy(() => DestinationFieldConfigScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => DestinationFieldConfigScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => DestinationFieldConfigScalarWhereWithAggregatesInputSchema), z.lazy(() => DestinationFieldConfigScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  tableConfigId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  field: z.union([z.lazy(() => EnumFieldWithAggregatesFilterSchema), z.lazy(() => FieldSchema)]).optional(),
  fieldId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
}).strict();

export const AirtableCredentialWhereInputSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialWhereInput> = z.object({
  AND: z.union([z.lazy(() => AirtableCredentialWhereInputSchema), z.lazy(() => AirtableCredentialWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => AirtableCredentialWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => AirtableCredentialWhereInputSchema), z.lazy(() => AirtableCredentialWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  baseId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  apiKey: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  destination: z.union([z.lazy(() => DestinationRelationFilterSchema), z.lazy(() => DestinationWhereInputSchema)]).optional().nullable(),
}).strict();

export const AirtableCredentialOrderByWithRelationInputSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  baseId: z.lazy(() => SortOrderSchema).optional(),
  apiKey: z.lazy(() => SortOrderSchema).optional(),
  destination: z.lazy(() => DestinationOrderByWithRelationInputSchema).optional(),
}).strict();

export const AirtableCredentialWhereUniqueInputSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialWhereUniqueInput> = z.object({
  id: z.string().optional(),
}).strict();

export const AirtableCredentialOrderByWithAggregationInputSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  baseId: z.lazy(() => SortOrderSchema).optional(),
  apiKey: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AirtableCredentialCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AirtableCredentialMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AirtableCredentialMinOrderByAggregateInputSchema).optional(),
}).strict();

export const AirtableCredentialScalarWhereWithAggregatesInputSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => AirtableCredentialScalarWhereWithAggregatesInputSchema), z.lazy(() => AirtableCredentialScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => AirtableCredentialScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => AirtableCredentialScalarWhereWithAggregatesInputSchema), z.lazy(() => AirtableCredentialScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  baseId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  apiKey: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
}).strict();

export const AirtableAuthorizationCacheWhereInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheWhereInput> = z.object({
  AND: z.union([z.lazy(() => AirtableAuthorizationCacheWhereInputSchema), z.lazy(() => AirtableAuthorizationCacheWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => AirtableAuthorizationCacheWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => AirtableAuthorizationCacheWhereInputSchema), z.lazy(() => AirtableAuthorizationCacheWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  state: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  codeVerifier: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  user: z.union([z.lazy(() => UserRelationFilterSchema), z.lazy(() => UserWhereInputSchema)]).optional(),
}).strict();

export const AirtableAuthorizationCacheOrderByWithRelationInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  codeVerifier: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
}).strict();

export const AirtableAuthorizationCacheWhereUniqueInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheWhereUniqueInput> = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
}).strict();

export const AirtableAuthorizationCacheOrderByWithAggregationInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  codeVerifier: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AirtableAuthorizationCacheCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AirtableAuthorizationCacheMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AirtableAuthorizationCacheMinOrderByAggregateInputSchema).optional(),
}).strict();

export const AirtableAuthorizationCacheScalarWhereWithAggregatesInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => AirtableAuthorizationCacheScalarWhereWithAggregatesInputSchema), z.lazy(() => AirtableAuthorizationCacheScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => AirtableAuthorizationCacheScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => AirtableAuthorizationCacheScalarWhereWithAggregatesInputSchema), z.lazy(() => AirtableAuthorizationCacheScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  state: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  codeVerifier: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
}).strict();

export const AirtableTokenWhereInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenWhereInput> = z.object({
  AND: z.union([z.lazy(() => AirtableTokenWhereInputSchema), z.lazy(() => AirtableTokenWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => AirtableTokenWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => AirtableTokenWhereInputSchema), z.lazy(() => AirtableTokenWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  user: z.union([z.lazy(() => UserRelationFilterSchema), z.lazy(() => UserWhereInputSchema)]).optional(),
  accessToken: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  refreshToken: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  tokenType: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  scope: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  refreshedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  accessTokenExpiresAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  refreshTokenExpiresAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
}).strict();

export const AirtableTokenOrderByWithRelationInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.lazy(() => SortOrderSchema).optional(),
  tokenType: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  refreshedAt: z.lazy(() => SortOrderSchema).optional(),
  accessTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  refreshTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const AirtableTokenWhereUniqueInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenWhereUniqueInput> = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
}).strict();

export const AirtableTokenOrderByWithAggregationInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.lazy(() => SortOrderSchema).optional(),
  tokenType: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  refreshedAt: z.lazy(() => SortOrderSchema).optional(),
  accessTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  refreshTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AirtableTokenCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AirtableTokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AirtableTokenMinOrderByAggregateInputSchema).optional(),
}).strict();

export const AirtableTokenScalarWhereWithAggregatesInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => AirtableTokenScalarWhereWithAggregatesInputSchema), z.lazy(() => AirtableTokenScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => AirtableTokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => AirtableTokenScalarWhereWithAggregatesInputSchema), z.lazy(() => AirtableTokenScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  accessToken: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  refreshToken: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  tokenType: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  scope: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.date()]).optional(),
  refreshedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.date()]).optional(),
  accessTokenExpiresAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.date()]).optional(),
  refreshTokenExpiresAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.date()]).optional(),
}).strict();

export const CodaCredentialWhereInputSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialWhereInput> = z.object({
  AND: z.union([z.lazy(() => CodaCredentialWhereInputSchema), z.lazy(() => CodaCredentialWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => CodaCredentialWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => CodaCredentialWhereInputSchema), z.lazy(() => CodaCredentialWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  accessToken: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  accessTokenHash: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  destination: z.union([z.lazy(() => DestinationRelationFilterSchema), z.lazy(() => DestinationWhereInputSchema)]).optional().nullable(),
}).strict();

export const CodaCredentialOrderByWithRelationInputSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  accessTokenHash: z.lazy(() => SortOrderSchema).optional(),
  destination: z.lazy(() => DestinationOrderByWithRelationInputSchema).optional(),
}).strict();

export const CodaCredentialWhereUniqueInputSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialWhereUniqueInput> = z.object({
  id: z.string().optional(),
}).strict();

export const CodaCredentialOrderByWithAggregationInputSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  accessTokenHash: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CodaCredentialCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CodaCredentialMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CodaCredentialMinOrderByAggregateInputSchema).optional(),
}).strict();

export const CodaCredentialScalarWhereWithAggregatesInputSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => CodaCredentialScalarWhereWithAggregatesInputSchema), z.lazy(() => CodaCredentialScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => CodaCredentialScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => CodaCredentialScalarWhereWithAggregatesInputSchema), z.lazy(() => CodaCredentialScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  accessToken: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  accessTokenHash: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
}).strict();

export const GoogleSheetsCredentialWhereInputSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialWhereInput> = z.object({
  AND: z.union([z.lazy(() => GoogleSheetsCredentialWhereInputSchema), z.lazy(() => GoogleSheetsCredentialWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => GoogleSheetsCredentialWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => GoogleSheetsCredentialWhereInputSchema), z.lazy(() => GoogleSheetsCredentialWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  spreadsheetId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  destination: z.union([z.lazy(() => DestinationRelationFilterSchema), z.lazy(() => DestinationWhereInputSchema)]).optional().nullable(),
}).strict();

export const GoogleSheetsCredentialOrderByWithRelationInputSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  spreadsheetId: z.lazy(() => SortOrderSchema).optional(),
  destination: z.lazy(() => DestinationOrderByWithRelationInputSchema).optional(),
}).strict();

export const GoogleSheetsCredentialWhereUniqueInputSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialWhereUniqueInput> = z.object({
  id: z.string().optional(),
}).strict();

export const GoogleSheetsCredentialOrderByWithAggregationInputSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  spreadsheetId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => GoogleSheetsCredentialCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => GoogleSheetsCredentialMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => GoogleSheetsCredentialMinOrderByAggregateInputSchema).optional(),
}).strict();

export const GoogleSheetsCredentialScalarWhereWithAggregatesInputSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => GoogleSheetsCredentialScalarWhereWithAggregatesInputSchema), z.lazy(() => GoogleSheetsCredentialScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => GoogleSheetsCredentialScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => GoogleSheetsCredentialScalarWhereWithAggregatesInputSchema), z.lazy(() => GoogleSheetsCredentialScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  spreadsheetId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
}).strict();

export const NotionCredentialWhereInputSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialWhereInput> = z.object({
  AND: z.union([z.lazy(() => NotionCredentialWhereInputSchema), z.lazy(() => NotionCredentialWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => NotionCredentialWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => NotionCredentialWhereInputSchema), z.lazy(() => NotionCredentialWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  botId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  accessToken: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  workspaceId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  workspaceName: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  workspaceIcon: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  owner: z.lazy(() => JsonFilterSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  destinations: z.lazy(() => DestinationListRelationFilterSchema).optional(),
}).strict();

export const NotionCredentialOrderByWithRelationInputSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  botId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  workspaceName: z.lazy(() => SortOrderSchema).optional(),
  workspaceIcon: z.lazy(() => SortOrderSchema).optional(),
  owner: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  destinations: z.lazy(() => DestinationOrderByRelationAggregateInputSchema).optional(),
}).strict();

export const NotionCredentialWhereUniqueInputSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialWhereUniqueInput> = z.object({
  id: z.string().optional(),
  botId: z.string().optional(),
}).strict();

export const NotionCredentialOrderByWithAggregationInputSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  botId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  workspaceName: z.lazy(() => SortOrderSchema).optional(),
  workspaceIcon: z.lazy(() => SortOrderSchema).optional(),
  owner: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => NotionCredentialCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => NotionCredentialMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => NotionCredentialMinOrderByAggregateInputSchema).optional(),
}).strict();

export const NotionCredentialScalarWhereWithAggregatesInputSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => NotionCredentialScalarWhereWithAggregatesInputSchema), z.lazy(() => NotionCredentialScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => NotionCredentialScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => NotionCredentialScalarWhereWithAggregatesInputSchema), z.lazy(() => NotionCredentialScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  botId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  accessToken: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  workspaceId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  workspaceName: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
  workspaceIcon: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
  owner: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.date()]).optional(),
}).strict();

export const SyncLogWhereInputSchema: z.ZodType<PrismaClient.Prisma.SyncLogWhereInput> = z.object({
  AND: z.union([z.lazy(() => SyncLogWhereInputSchema), z.lazy(() => SyncLogWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => SyncLogWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => SyncLogWhereInputSchema), z.lazy(() => SyncLogWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  error: z.union([z.lazy(() => EnumSyncErrorNullableFilterSchema), z.lazy(() => SyncErrorSchema)]).optional().nullable(),
}).strict();

export const SyncLogOrderByWithRelationInputSchema: z.ZodType<PrismaClient.Prisma.SyncLogOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  error: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const SyncLogWhereUniqueInputSchema: z.ZodType<PrismaClient.Prisma.SyncLogWhereUniqueInput> = z.object({
  id: z.string().optional(),
}).strict();

export const SyncLogOrderByWithAggregationInputSchema: z.ZodType<PrismaClient.Prisma.SyncLogOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  error: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SyncLogCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SyncLogMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SyncLogMinOrderByAggregateInputSchema).optional(),
}).strict();

export const SyncLogScalarWhereWithAggregatesInputSchema: z.ZodType<PrismaClient.Prisma.SyncLogScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => SyncLogScalarWhereWithAggregatesInputSchema), z.lazy(() => SyncLogScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => SyncLogScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => SyncLogScalarWhereWithAggregatesInputSchema), z.lazy(() => SyncLogScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  error: z.union([z.lazy(() => EnumSyncErrorNullableWithAggregatesFilterSchema), z.lazy(() => SyncErrorSchema)]).optional().nullable(),
}).strict();

export const AccountCreateInputSchema: z.ZodType<PrismaClient.Prisma.AccountCreateInput> = z.object({
  id: z.string().optional(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.date().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutAccountsInputSchema),
}).strict();

export const AccountUncheckedCreateInputSchema: z.ZodType<PrismaClient.Prisma.AccountUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.date().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
}).strict();

export const AccountUpdateInputSchema: z.ZodType<PrismaClient.Prisma.AccountUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  provider: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  providerAccountId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  refresh_token: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  access_token: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  expires_at: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  token_type: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  scope: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  id_token: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  session_state: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutAccountsNestedInputSchema).optional(),
}).strict();

export const AccountUncheckedUpdateInputSchema: z.ZodType<PrismaClient.Prisma.AccountUncheckedUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  provider: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  providerAccountId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  refresh_token: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  access_token: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  expires_at: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  token_type: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  scope: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  id_token: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  session_state: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const AccountCreateManyInputSchema: z.ZodType<PrismaClient.Prisma.AccountCreateManyInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.date().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
}).strict();

export const AccountUpdateManyMutationInputSchema: z.ZodType<PrismaClient.Prisma.AccountUpdateManyMutationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  provider: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  providerAccountId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  refresh_token: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  access_token: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  expires_at: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  token_type: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  scope: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  id_token: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  session_state: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const AccountUncheckedUpdateManyInputSchema: z.ZodType<PrismaClient.Prisma.AccountUncheckedUpdateManyInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  provider: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  providerAccountId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  refresh_token: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  access_token: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  expires_at: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  token_type: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  scope: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  id_token: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  session_state: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const SessionCreateInputSchema: z.ZodType<PrismaClient.Prisma.SessionCreateInput> = z.object({
  id: z.string().optional(),
  sessionToken: z.string(),
  expires: z.date(),
  user: z.lazy(() => UserCreateNestedOneWithoutSessionsInputSchema),
}).strict();

export const SessionUncheckedCreateInputSchema: z.ZodType<PrismaClient.Prisma.SessionUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.date(),
}).strict();

export const SessionUpdateInputSchema: z.ZodType<PrismaClient.Prisma.SessionUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  sessionToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  expires: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSessionsNestedInputSchema).optional(),
}).strict();

export const SessionUncheckedUpdateInputSchema: z.ZodType<PrismaClient.Prisma.SessionUncheckedUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  sessionToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  expires: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const SessionCreateManyInputSchema: z.ZodType<PrismaClient.Prisma.SessionCreateManyInput> = z.object({
  id: z.string().optional(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.date(),
}).strict();

export const SessionUpdateManyMutationInputSchema: z.ZodType<PrismaClient.Prisma.SessionUpdateManyMutationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  sessionToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  expires: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const SessionUncheckedUpdateManyInputSchema: z.ZodType<PrismaClient.Prisma.SessionUncheckedUpdateManyInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  sessionToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  expires: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<PrismaClient.Prisma.UserCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  image: z.string().optional().nullable(),
  disabledAt: z.date().optional().nullable(),
  timezone: z.string().optional(),
  stripeCustomerId: z.string(),
  isSubsribedGeneral: z.boolean().optional(),
  isSubscribedPeriodicUpdates: z.boolean().optional(),
  periodicUpdatesFrequency: z.lazy(() => FrequencySchema).optional(),
  periodicUpdatesJobId: z.string().optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenCreateNestedManyWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemCreateNestedManyWithoutUserInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenCreateNestedManyWithoutUserInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheCreateNestedOneWithoutUserInputSchema).optional(),
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<PrismaClient.Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  image: z.string().optional().nullable(),
  disabledAt: z.date().optional().nullable(),
  timezone: z.string().optional(),
  stripeCustomerId: z.string(),
  isSubsribedGeneral: z.boolean().optional(),
  isSubscribedPeriodicUpdates: z.boolean().optional(),
  periodicUpdatesFrequency: z.lazy(() => FrequencySchema).optional(),
  periodicUpdatesJobId: z.string().optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
}).strict();

export const UserUpdateInputSchema: z.ZodType<PrismaClient.Prisma.UserUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  emailVerified: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  image: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  timezone: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  stripeCustomerId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isSubsribedGeneral: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isSubscribedPeriodicUpdates: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesFrequency: z.union([z.lazy(() => FrequencySchema), z.lazy(() => EnumFrequencyFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesJobId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheUpdateOneWithoutUserNestedInputSchema).optional(),
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<PrismaClient.Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  emailVerified: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  image: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  timezone: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  stripeCustomerId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isSubsribedGeneral: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isSubscribedPeriodicUpdates: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesFrequency: z.union([z.lazy(() => FrequencySchema), z.lazy(() => EnumFrequencyFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesJobId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
}).strict();

export const UserCreateManyInputSchema: z.ZodType<PrismaClient.Prisma.UserCreateManyInput> = z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  image: z.string().optional().nullable(),
  disabledAt: z.date().optional().nullable(),
  timezone: z.string().optional(),
  stripeCustomerId: z.string(),
  isSubsribedGeneral: z.boolean().optional(),
  isSubscribedPeriodicUpdates: z.boolean().optional(),
  periodicUpdatesFrequency: z.lazy(() => FrequencySchema).optional(),
  periodicUpdatesJobId: z.string().optional().nullable(),
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<PrismaClient.Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  emailVerified: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  image: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  timezone: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  stripeCustomerId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isSubsribedGeneral: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isSubscribedPeriodicUpdates: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesFrequency: z.union([z.lazy(() => FrequencySchema), z.lazy(() => EnumFrequencyFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesJobId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<PrismaClient.Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  emailVerified: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  image: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  timezone: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  stripeCustomerId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isSubsribedGeneral: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isSubscribedPeriodicUpdates: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesFrequency: z.union([z.lazy(() => FrequencySchema), z.lazy(() => EnumFrequencyFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesJobId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const VerificationTokenCreateInputSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenCreateInput> = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.date(),
}).strict();

export const VerificationTokenUncheckedCreateInputSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenUncheckedCreateInput> = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.date(),
}).strict();

export const VerificationTokenUpdateInputSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenUpdateInput> = z.object({
  identifier: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  expires: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const VerificationTokenUncheckedUpdateInputSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenUncheckedUpdateInput> = z.object({
  identifier: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  expires: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const VerificationTokenCreateManyInputSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenCreateManyInput> = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.date(),
}).strict();

export const VerificationTokenUpdateManyMutationInputSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenUpdateManyMutationInput> = z.object({
  identifier: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  expires: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const VerificationTokenUncheckedUpdateManyInputSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenUncheckedUpdateManyInput> = z.object({
  identifier: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  expires: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const PlaidInstitutionCreateInputSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionCreateInput> = z.object({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string().optional().nullable(),
  items: z.lazy(() => PlaidItemCreateNestedManyWithoutInstitutionInputSchema).optional(),
}).strict();

export const PlaidInstitutionUncheckedCreateInputSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionUncheckedCreateInput> = z.object({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string().optional().nullable(),
  items: z.lazy(() => PlaidItemUncheckedCreateNestedManyWithoutInstitutionInputSchema).optional(),
}).strict();

export const PlaidInstitutionUpdateInputSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  logoUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  items: z.lazy(() => PlaidItemUpdateManyWithoutInstitutionNestedInputSchema).optional(),
}).strict();

export const PlaidInstitutionUncheckedUpdateInputSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionUncheckedUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  logoUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  items: z.lazy(() => PlaidItemUncheckedUpdateManyWithoutInstitutionNestedInputSchema).optional(),
}).strict();

export const PlaidInstitutionCreateManyInputSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionCreateManyInput> = z.object({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string().optional().nullable(),
}).strict();

export const PlaidInstitutionUpdateManyMutationInputSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionUpdateManyMutationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  logoUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const PlaidInstitutionUncheckedUpdateManyInputSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionUncheckedUpdateManyInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  logoUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const PlaidItemCreateInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemCreateInput> = z.object({
  id: z.string(),
  isInitialUpdateComplete: z.boolean().optional(),
  isHistoricalUpdateComplete: z.boolean().optional(),
  error: z.string().optional().nullable(),
  accessToken: z.string(),
  plaidSyncCursor: z.string().optional().nullable(),
  availableProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  billedProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  lastSyncedAt: z.date().optional().nullable(),
  consentExpiresAt: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutPlaidItemsInputSchema),
  institution: z.lazy(() => PlaidInstitutionCreateNestedOneWithoutItemsInputSchema),
  accounts: z.lazy(() => PlaidAccountCreateNestedManyWithoutItemInputSchema).optional(),
}).strict();

export const PlaidItemUncheckedCreateInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUncheckedCreateInput> = z.object({
  id: z.string(),
  institutionId: z.string(),
  userId: z.string(),
  isInitialUpdateComplete: z.boolean().optional(),
  isHistoricalUpdateComplete: z.boolean().optional(),
  error: z.string().optional().nullable(),
  accessToken: z.string(),
  plaidSyncCursor: z.string().optional().nullable(),
  availableProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  billedProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  lastSyncedAt: z.date().optional().nullable(),
  consentExpiresAt: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUncheckedCreateNestedManyWithoutItemInputSchema).optional(),
}).strict();

export const PlaidItemUpdateInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isInitialUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isHistoricalUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  error: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  plaidSyncCursor: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  availableProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  billedProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  lastSyncedAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  consentExpiresAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutPlaidItemsNestedInputSchema).optional(),
  institution: z.lazy(() => PlaidInstitutionUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
  accounts: z.lazy(() => PlaidAccountUpdateManyWithoutItemNestedInputSchema).optional(),
}).strict();

export const PlaidItemUncheckedUpdateInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUncheckedUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  institutionId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isInitialUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isHistoricalUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  error: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  plaidSyncCursor: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  availableProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  billedProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  lastSyncedAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  consentExpiresAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUncheckedUpdateManyWithoutItemNestedInputSchema).optional(),
}).strict();

export const PlaidItemCreateManyInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemCreateManyInput> = z.object({
  id: z.string(),
  institutionId: z.string(),
  userId: z.string(),
  isInitialUpdateComplete: z.boolean().optional(),
  isHistoricalUpdateComplete: z.boolean().optional(),
  error: z.string().optional().nullable(),
  accessToken: z.string(),
  plaidSyncCursor: z.string().optional().nullable(),
  availableProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  billedProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  lastSyncedAt: z.date().optional().nullable(),
  consentExpiresAt: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
}).strict();

export const PlaidItemUpdateManyMutationInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUpdateManyMutationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isInitialUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isHistoricalUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  error: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  plaidSyncCursor: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  availableProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  billedProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  lastSyncedAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  consentExpiresAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const PlaidItemUncheckedUpdateManyInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUncheckedUpdateManyInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  institutionId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isInitialUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isHistoricalUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  error: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  plaidSyncCursor: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  availableProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  billedProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  lastSyncedAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  consentExpiresAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const PlaidAccountCreateInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountCreateInput> = z.object({
  id: z.string(),
  name: z.string(),
  mask: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  destinations: z.lazy(() => DestinationCreateNestedManyWithoutAccountsInputSchema).optional(),
  item: z.lazy(() => PlaidItemCreateNestedOneWithoutAccountsInputSchema),
}).strict();

export const PlaidAccountUncheckedCreateInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUncheckedCreateInput> = z.object({
  id: z.string(),
  plaidItemId: z.string(),
  name: z.string(),
  mask: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  destinations: z.lazy(() => DestinationUncheckedCreateNestedManyWithoutAccountsInputSchema).optional(),
}).strict();

export const PlaidAccountUpdateInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  mask: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  destinations: z.lazy(() => DestinationUpdateManyWithoutAccountsNestedInputSchema).optional(),
  item: z.lazy(() => PlaidItemUpdateOneRequiredWithoutAccountsNestedInputSchema).optional(),
}).strict();

export const PlaidAccountUncheckedUpdateInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUncheckedUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  plaidItemId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  mask: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  destinations: z.lazy(() => DestinationUncheckedUpdateManyWithoutAccountsNestedInputSchema).optional(),
}).strict();

export const PlaidAccountCreateManyInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountCreateManyInput> = z.object({
  id: z.string(),
  plaidItemId: z.string(),
  name: z.string(),
  mask: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).strict();

export const PlaidAccountUpdateManyMutationInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUpdateManyMutationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  mask: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const PlaidAccountUncheckedUpdateManyInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUncheckedUpdateManyInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  plaidItemId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  mask: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const LinkTokenCreateInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenCreateInput> = z.object({
  id: z.string().optional(),
  token: z.string(),
  user: z.lazy(() => UserCreateNestedOneWithoutLinkTokensInputSchema),
}).strict();

export const LinkTokenUncheckedCreateInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  token: z.string(),
  userId: z.string(),
}).strict();

export const LinkTokenUpdateInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutLinkTokensNestedInputSchema).optional(),
}).strict();

export const LinkTokenUncheckedUpdateInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenUncheckedUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const LinkTokenCreateManyInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenCreateManyInput> = z.object({
  id: z.string().optional(),
  token: z.string(),
  userId: z.string(),
}).strict();

export const LinkTokenUpdateManyMutationInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenUpdateManyMutationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const LinkTokenUncheckedUpdateManyInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenUncheckedUpdateManyInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const DestinationCreateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  airtableCredential: z.lazy(() => AirtableCredentialCreateNestedOneWithoutDestinationInputSchema).optional(),
  codaCredential: z.lazy(() => CodaCredentialCreateNestedOneWithoutDestinationInputSchema).optional(),
  googleSheetsCredential: z.lazy(() => GoogleSheetsCredentialCreateNestedOneWithoutDestinationInputSchema).optional(),
  notionCredential: z.lazy(() => NotionCredentialCreateNestedOneWithoutDestinationsInputSchema).optional(),
  integration: z.lazy(() => IntegrationSchema),
  name: z.string(),
  syncStartDate: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
  accounts: z.lazy(() => PlaidAccountCreateNestedManyWithoutDestinationsInputSchema).optional(),
  tableConfigs: z.lazy(() => DestinationTableConfigCreateNestedManyWithoutDestinationInputSchema).optional(),
}).strict();

export const DestinationUncheckedCreateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  airtableCredentialId: z.string().optional().nullable(),
  codaCredentialId: z.string().optional().nullable(),
  googleSheetsCredentialId: z.string().optional().nullable(),
  notionCredentialId: z.string().optional().nullable(),
  integration: z.lazy(() => IntegrationSchema),
  name: z.string(),
  syncStartDate: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUncheckedCreateNestedManyWithoutDestinationsInputSchema).optional(),
  tableConfigs: z.lazy(() => DestinationTableConfigUncheckedCreateNestedManyWithoutDestinationInputSchema).optional(),
}).strict();

export const DestinationUpdateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  airtableCredential: z.lazy(() => AirtableCredentialUpdateOneWithoutDestinationNestedInputSchema).optional(),
  codaCredential: z.lazy(() => CodaCredentialUpdateOneWithoutDestinationNestedInputSchema).optional(),
  googleSheetsCredential: z.lazy(() => GoogleSheetsCredentialUpdateOneWithoutDestinationNestedInputSchema).optional(),
  notionCredential: z.lazy(() => NotionCredentialUpdateOneWithoutDestinationsNestedInputSchema).optional(),
  integration: z.union([z.lazy(() => IntegrationSchema), z.lazy(() => EnumIntegrationFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  syncStartDate: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUpdateManyWithoutDestinationsNestedInputSchema).optional(),
  tableConfigs: z.lazy(() => DestinationTableConfigUpdateManyWithoutDestinationNestedInputSchema).optional(),
}).strict();

export const DestinationUncheckedUpdateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  airtableCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  codaCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  googleSheetsCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  notionCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  integration: z.union([z.lazy(() => IntegrationSchema), z.lazy(() => EnumIntegrationFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  syncStartDate: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUncheckedUpdateManyWithoutDestinationsNestedInputSchema).optional(),
  tableConfigs: z.lazy(() => DestinationTableConfigUncheckedUpdateManyWithoutDestinationNestedInputSchema).optional(),
}).strict();

export const DestinationCreateManyInputSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateManyInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  airtableCredentialId: z.string().optional().nullable(),
  codaCredentialId: z.string().optional().nullable(),
  googleSheetsCredentialId: z.string().optional().nullable(),
  notionCredentialId: z.string().optional().nullable(),
  integration: z.lazy(() => IntegrationSchema),
  name: z.string(),
  syncStartDate: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
}).strict();

export const DestinationUpdateManyMutationInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpdateManyMutationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  integration: z.union([z.lazy(() => IntegrationSchema), z.lazy(() => EnumIntegrationFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  syncStartDate: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const DestinationUncheckedUpdateManyInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedUpdateManyInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  airtableCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  codaCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  googleSheetsCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  notionCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  integration: z.union([z.lazy(() => IntegrationSchema), z.lazy(() => EnumIntegrationFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  syncStartDate: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const DestinationTableConfigCreateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigCreateInput> = z.object({
  id: z.string().optional(),
  destination: z.lazy(() => DestinationCreateNestedOneWithoutTableConfigsInputSchema),
  isEnabled: z.boolean().optional(),
  table: z.lazy(() => TableSchema),
  tableId: z.string(),
  fieldConfigs: z.lazy(() => DestinationFieldConfigCreateNestedManyWithoutTableConfigInputSchema).optional(),
}).strict();

export const DestinationTableConfigUncheckedCreateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  destinationId: z.string(),
  isEnabled: z.boolean().optional(),
  table: z.lazy(() => TableSchema),
  tableId: z.string(),
  fieldConfigs: z.lazy(() => DestinationFieldConfigUncheckedCreateNestedManyWithoutTableConfigInputSchema).optional(),
}).strict();

export const DestinationTableConfigUpdateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  destination: z.lazy(() => DestinationUpdateOneRequiredWithoutTableConfigsNestedInputSchema).optional(),
  isEnabled: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  table: z.union([z.lazy(() => TableSchema), z.lazy(() => EnumTableFieldUpdateOperationsInputSchema)]).optional(),
  tableId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  fieldConfigs: z.lazy(() => DestinationFieldConfigUpdateManyWithoutTableConfigNestedInputSchema).optional(),
}).strict();

export const DestinationTableConfigUncheckedUpdateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigUncheckedUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  destinationId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isEnabled: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  table: z.union([z.lazy(() => TableSchema), z.lazy(() => EnumTableFieldUpdateOperationsInputSchema)]).optional(),
  tableId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  fieldConfigs: z.lazy(() => DestinationFieldConfigUncheckedUpdateManyWithoutTableConfigNestedInputSchema).optional(),
}).strict();

export const DestinationTableConfigCreateManyInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigCreateManyInput> = z.object({
  id: z.string().optional(),
  destinationId: z.string(),
  isEnabled: z.boolean().optional(),
  table: z.lazy(() => TableSchema),
  tableId: z.string(),
}).strict();

export const DestinationTableConfigUpdateManyMutationInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigUpdateManyMutationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isEnabled: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  table: z.union([z.lazy(() => TableSchema), z.lazy(() => EnumTableFieldUpdateOperationsInputSchema)]).optional(),
  tableId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const DestinationTableConfigUncheckedUpdateManyInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigUncheckedUpdateManyInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  destinationId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isEnabled: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  table: z.union([z.lazy(() => TableSchema), z.lazy(() => EnumTableFieldUpdateOperationsInputSchema)]).optional(),
  tableId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const DestinationFieldConfigCreateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigCreateInput> = z.object({
  id: z.string().optional(),
  tableConfig: z.lazy(() => DestinationTableConfigCreateNestedOneWithoutFieldConfigsInputSchema),
  field: z.lazy(() => FieldSchema),
  fieldId: z.string(),
}).strict();

export const DestinationFieldConfigUncheckedCreateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  tableConfigId: z.string(),
  field: z.lazy(() => FieldSchema),
  fieldId: z.string(),
}).strict();

export const DestinationFieldConfigUpdateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  tableConfig: z.lazy(() => DestinationTableConfigUpdateOneRequiredWithoutFieldConfigsNestedInputSchema).optional(),
  field: z.union([z.lazy(() => FieldSchema), z.lazy(() => EnumFieldFieldUpdateOperationsInputSchema)]).optional(),
  fieldId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const DestinationFieldConfigUncheckedUpdateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigUncheckedUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  tableConfigId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  field: z.union([z.lazy(() => FieldSchema), z.lazy(() => EnumFieldFieldUpdateOperationsInputSchema)]).optional(),
  fieldId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const DestinationFieldConfigCreateManyInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigCreateManyInput> = z.object({
  id: z.string().optional(),
  tableConfigId: z.string(),
  field: z.lazy(() => FieldSchema),
  fieldId: z.string(),
}).strict();

export const DestinationFieldConfigUpdateManyMutationInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigUpdateManyMutationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  field: z.union([z.lazy(() => FieldSchema), z.lazy(() => EnumFieldFieldUpdateOperationsInputSchema)]).optional(),
  fieldId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const DestinationFieldConfigUncheckedUpdateManyInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigUncheckedUpdateManyInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  tableConfigId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  field: z.union([z.lazy(() => FieldSchema), z.lazy(() => EnumFieldFieldUpdateOperationsInputSchema)]).optional(),
  fieldId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const AirtableCredentialCreateInputSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialCreateInput> = z.object({
  id: z.string().optional(),
  baseId: z.string(),
  apiKey: z.string().optional().nullable(),
  destination: z.lazy(() => DestinationCreateNestedOneWithoutAirtableCredentialInputSchema).optional(),
}).strict();

export const AirtableCredentialUncheckedCreateInputSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  baseId: z.string(),
  apiKey: z.string().optional().nullable(),
  destination: z.lazy(() => DestinationUncheckedCreateNestedOneWithoutAirtableCredentialInputSchema).optional(),
}).strict();

export const AirtableCredentialUpdateInputSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  baseId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  apiKey: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  destination: z.lazy(() => DestinationUpdateOneWithoutAirtableCredentialNestedInputSchema).optional(),
}).strict();

export const AirtableCredentialUncheckedUpdateInputSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialUncheckedUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  baseId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  apiKey: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  destination: z.lazy(() => DestinationUncheckedUpdateOneWithoutAirtableCredentialNestedInputSchema).optional(),
}).strict();

export const AirtableCredentialCreateManyInputSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialCreateManyInput> = z.object({
  id: z.string().optional(),
  baseId: z.string(),
  apiKey: z.string().optional().nullable(),
}).strict();

export const AirtableCredentialUpdateManyMutationInputSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialUpdateManyMutationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  baseId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  apiKey: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const AirtableCredentialUncheckedUpdateManyInputSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialUncheckedUpdateManyInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  baseId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  apiKey: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const AirtableAuthorizationCacheCreateInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheCreateInput> = z.object({
  id: z.string().optional(),
  state: z.string(),
  codeVerifier: z.string(),
  user: z.lazy(() => UserCreateNestedOneWithoutAirtableAuthorizationCacheInputSchema),
}).strict();

export const AirtableAuthorizationCacheUncheckedCreateInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  state: z.string(),
  codeVerifier: z.string(),
}).strict();

export const AirtableAuthorizationCacheUpdateInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  state: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  codeVerifier: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutAirtableAuthorizationCacheNestedInputSchema).optional(),
}).strict();

export const AirtableAuthorizationCacheUncheckedUpdateInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheUncheckedUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  state: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  codeVerifier: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const AirtableAuthorizationCacheCreateManyInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheCreateManyInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  state: z.string(),
  codeVerifier: z.string(),
}).strict();

export const AirtableAuthorizationCacheUpdateManyMutationInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheUpdateManyMutationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  state: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  codeVerifier: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const AirtableAuthorizationCacheUncheckedUpdateManyInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheUncheckedUpdateManyInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  state: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  codeVerifier: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const AirtableTokenCreateInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenCreateInput> = z.object({
  id: z.string().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutAirtableTokensInputSchema),
  accessToken: z.string(),
  refreshToken: z.string(),
  tokenType: z.string(),
  scope: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  refreshedAt: z.date().optional(),
  accessTokenExpiresAt: z.date(),
  refreshTokenExpiresAt: z.date(),
}).strict();

export const AirtableTokenUncheckedCreateInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
  tokenType: z.string(),
  scope: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  refreshedAt: z.date().optional(),
  accessTokenExpiresAt: z.date(),
  refreshTokenExpiresAt: z.date(),
}).strict();

export const AirtableTokenUpdateInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutAirtableTokensNestedInputSchema).optional(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  refreshToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  tokenType: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  scope: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  refreshedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  accessTokenExpiresAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  refreshTokenExpiresAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const AirtableTokenUncheckedUpdateInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenUncheckedUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  refreshToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  tokenType: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  scope: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  refreshedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  accessTokenExpiresAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  refreshTokenExpiresAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const AirtableTokenCreateManyInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenCreateManyInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
  tokenType: z.string(),
  scope: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  refreshedAt: z.date().optional(),
  accessTokenExpiresAt: z.date(),
  refreshTokenExpiresAt: z.date(),
}).strict();

export const AirtableTokenUpdateManyMutationInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenUpdateManyMutationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  refreshToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  tokenType: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  scope: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  refreshedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  accessTokenExpiresAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  refreshTokenExpiresAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const AirtableTokenUncheckedUpdateManyInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenUncheckedUpdateManyInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  refreshToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  tokenType: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  scope: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  refreshedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  accessTokenExpiresAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  refreshTokenExpiresAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const CodaCredentialCreateInputSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialCreateInput> = z.object({
  id: z.string().optional(),
  accessToken: z.string(),
  accessTokenHash: z.string(),
  destination: z.lazy(() => DestinationCreateNestedOneWithoutCodaCredentialInputSchema).optional(),
}).strict();

export const CodaCredentialUncheckedCreateInputSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  accessToken: z.string(),
  accessTokenHash: z.string(),
  destination: z.lazy(() => DestinationUncheckedCreateNestedOneWithoutCodaCredentialInputSchema).optional(),
}).strict();

export const CodaCredentialUpdateInputSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessTokenHash: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  destination: z.lazy(() => DestinationUpdateOneWithoutCodaCredentialNestedInputSchema).optional(),
}).strict();

export const CodaCredentialUncheckedUpdateInputSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialUncheckedUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessTokenHash: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  destination: z.lazy(() => DestinationUncheckedUpdateOneWithoutCodaCredentialNestedInputSchema).optional(),
}).strict();

export const CodaCredentialCreateManyInputSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialCreateManyInput> = z.object({
  id: z.string().optional(),
  accessToken: z.string(),
  accessTokenHash: z.string(),
}).strict();

export const CodaCredentialUpdateManyMutationInputSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialUpdateManyMutationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessTokenHash: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const CodaCredentialUncheckedUpdateManyInputSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialUncheckedUpdateManyInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessTokenHash: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const GoogleSheetsCredentialCreateInputSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialCreateInput> = z.object({
  id: z.string().optional(),
  spreadsheetId: z.string(),
  destination: z.lazy(() => DestinationCreateNestedOneWithoutGoogleSheetsCredentialInputSchema).optional(),
}).strict();

export const GoogleSheetsCredentialUncheckedCreateInputSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  spreadsheetId: z.string(),
  destination: z.lazy(() => DestinationUncheckedCreateNestedOneWithoutGoogleSheetsCredentialInputSchema).optional(),
}).strict();

export const GoogleSheetsCredentialUpdateInputSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  spreadsheetId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  destination: z.lazy(() => DestinationUpdateOneWithoutGoogleSheetsCredentialNestedInputSchema).optional(),
}).strict();

export const GoogleSheetsCredentialUncheckedUpdateInputSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialUncheckedUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  spreadsheetId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  destination: z.lazy(() => DestinationUncheckedUpdateOneWithoutGoogleSheetsCredentialNestedInputSchema).optional(),
}).strict();

export const GoogleSheetsCredentialCreateManyInputSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialCreateManyInput> = z.object({
  id: z.string().optional(),
  spreadsheetId: z.string(),
}).strict();

export const GoogleSheetsCredentialUpdateManyMutationInputSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialUpdateManyMutationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  spreadsheetId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const GoogleSheetsCredentialUncheckedUpdateManyInputSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialUncheckedUpdateManyInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  spreadsheetId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const NotionCredentialCreateInputSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialCreateInput> = z.object({
  id: z.string().optional(),
  botId: z.string(),
  userId: z.string(),
  accessToken: z.string(),
  workspaceId: z.string(),
  workspaceName: z.string().optional().nullable(),
  workspaceIcon: z.string().optional().nullable(),
  owner: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  destinations: z.lazy(() => DestinationCreateNestedManyWithoutNotionCredentialInputSchema).optional(),
}).strict();

export const NotionCredentialUncheckedCreateInputSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  botId: z.string(),
  userId: z.string(),
  accessToken: z.string(),
  workspaceId: z.string(),
  workspaceName: z.string().optional().nullable(),
  workspaceIcon: z.string().optional().nullable(),
  owner: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  destinations: z.lazy(() => DestinationUncheckedCreateNestedManyWithoutNotionCredentialInputSchema).optional(),
}).strict();

export const NotionCredentialUpdateInputSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  botId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  workspaceId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  workspaceName: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  workspaceIcon: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  owner: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  destinations: z.lazy(() => DestinationUpdateManyWithoutNotionCredentialNestedInputSchema).optional(),
}).strict();

export const NotionCredentialUncheckedUpdateInputSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialUncheckedUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  botId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  workspaceId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  workspaceName: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  workspaceIcon: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  owner: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  destinations: z.lazy(() => DestinationUncheckedUpdateManyWithoutNotionCredentialNestedInputSchema).optional(),
}).strict();

export const NotionCredentialCreateManyInputSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialCreateManyInput> = z.object({
  id: z.string().optional(),
  botId: z.string(),
  userId: z.string(),
  accessToken: z.string(),
  workspaceId: z.string(),
  workspaceName: z.string().optional().nullable(),
  workspaceIcon: z.string().optional().nullable(),
  owner: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).strict();

export const NotionCredentialUpdateManyMutationInputSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialUpdateManyMutationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  botId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  workspaceId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  workspaceName: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  workspaceIcon: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  owner: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const NotionCredentialUncheckedUpdateManyInputSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialUncheckedUpdateManyInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  botId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  workspaceId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  workspaceName: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  workspaceIcon: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  owner: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const SyncLogCreateInputSchema: z.ZodType<PrismaClient.Prisma.SyncLogCreateInput> = z.object({
  id: z.string().optional(),
  error: z.lazy(() => SyncErrorSchema).optional().nullable(),
}).strict();

export const SyncLogUncheckedCreateInputSchema: z.ZodType<PrismaClient.Prisma.SyncLogUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  error: z.lazy(() => SyncErrorSchema).optional().nullable(),
}).strict();

export const SyncLogUpdateInputSchema: z.ZodType<PrismaClient.Prisma.SyncLogUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  error: z.union([z.lazy(() => SyncErrorSchema), z.lazy(() => NullableEnumSyncErrorFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const SyncLogUncheckedUpdateInputSchema: z.ZodType<PrismaClient.Prisma.SyncLogUncheckedUpdateInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  error: z.union([z.lazy(() => SyncErrorSchema), z.lazy(() => NullableEnumSyncErrorFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const SyncLogCreateManyInputSchema: z.ZodType<PrismaClient.Prisma.SyncLogCreateManyInput> = z.object({
  id: z.string().optional(),
  error: z.lazy(() => SyncErrorSchema).optional().nullable(),
}).strict();

export const SyncLogUpdateManyMutationInputSchema: z.ZodType<PrismaClient.Prisma.SyncLogUpdateManyMutationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  error: z.union([z.lazy(() => SyncErrorSchema), z.lazy(() => NullableEnumSyncErrorFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const SyncLogUncheckedUpdateManyInputSchema: z.ZodType<PrismaClient.Prisma.SyncLogUncheckedUpdateManyInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  error: z.union([z.lazy(() => SyncErrorSchema), z.lazy(() => NullableEnumSyncErrorFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const StringFilterSchema: z.ZodType<PrismaClient.Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([z.string(), z.lazy(() => NestedStringFilterSchema)]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<PrismaClient.Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([z.string(), z.lazy(() => NestedStringNullableFilterSchema)]).optional().nullable(),
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<PrismaClient.Prisma.DateTimeNullableFilter> = z.object({
  equals: z.date().optional().nullable(),
  in: z.date().array().optional().nullable(),
  notIn: z.date().array().optional().nullable(),
  lt: z.date().optional(),
  lte: z.date().optional(),
  gt: z.date().optional(),
  gte: z.date().optional(),
  not: z.union([z.date(), z.lazy(() => NestedDateTimeNullableFilterSchema)]).optional().nullable(),
}).strict();

export const UserRelationFilterSchema: z.ZodType<PrismaClient.Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional(),
}).strict();

export const AccountProviderProviderAccountIdCompoundUniqueInputSchema: z.ZodType<PrismaClient.Prisma.AccountProviderProviderAccountIdCompoundUniqueInput> = z.object({
  provider: z.string(),
  providerAccountId: z.string(),
}).strict();

export const AccountCountOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.AccountCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const AccountMaxOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.AccountMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const AccountMinOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.AccountMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<PrismaClient.Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([z.string(), z.lazy(() => NestedStringWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<PrismaClient.Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([z.string(), z.lazy(() => NestedStringNullableWithAggregatesFilterSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<PrismaClient.Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.date().optional().nullable(),
  in: z.date().array().optional().nullable(),
  notIn: z.date().array().optional().nullable(),
  lt: z.date().optional(),
  lte: z.date().optional(),
  gt: z.date().optional(),
  gte: z.date().optional(),
  not: z.union([z.date(), z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<PrismaClient.Prisma.DateTimeFilter> = z.object({
  equals: z.date().optional(),
  in: z.date().array().optional(),
  notIn: z.date().array().optional(),
  lt: z.date().optional(),
  lte: z.date().optional(),
  gt: z.date().optional(),
  gte: z.date().optional(),
  not: z.union([z.date(), z.lazy(() => NestedDateTimeFilterSchema)]).optional(),
}).strict();

export const SessionCountOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.SessionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const SessionMaxOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.SessionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const SessionMinOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.SessionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<PrismaClient.Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.date().optional(),
  in: z.date().array().optional(),
  notIn: z.date().array().optional(),
  lt: z.date().optional(),
  lte: z.date().optional(),
  gt: z.date().optional(),
  gte: z.date().optional(),
  not: z.union([z.date(), z.lazy(() => NestedDateTimeWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
}).strict();

export const BoolFilterSchema: z.ZodType<PrismaClient.Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([z.boolean(), z.lazy(() => NestedBoolFilterSchema)]).optional(),
}).strict();

export const EnumFrequencyFilterSchema: z.ZodType<PrismaClient.Prisma.EnumFrequencyFilter> = z.object({
  equals: z.lazy(() => FrequencySchema).optional(),
  in: z.lazy(() => FrequencySchema).array().optional(),
  notIn: z.lazy(() => FrequencySchema).array().optional(),
  not: z.union([z.lazy(() => FrequencySchema), z.lazy(() => NestedEnumFrequencyFilterSchema)]).optional(),
}).strict();

export const LinkTokenListRelationFilterSchema: z.ZodType<PrismaClient.Prisma.LinkTokenListRelationFilter> = z.object({
  every: z.lazy(() => LinkTokenWhereInputSchema).optional(),
  some: z.lazy(() => LinkTokenWhereInputSchema).optional(),
  none: z.lazy(() => LinkTokenWhereInputSchema).optional(),
}).strict();

export const AccountListRelationFilterSchema: z.ZodType<PrismaClient.Prisma.AccountListRelationFilter> = z.object({
  every: z.lazy(() => AccountWhereInputSchema).optional(),
  some: z.lazy(() => AccountWhereInputSchema).optional(),
  none: z.lazy(() => AccountWhereInputSchema).optional(),
}).strict();

export const SessionListRelationFilterSchema: z.ZodType<PrismaClient.Prisma.SessionListRelationFilter> = z.object({
  every: z.lazy(() => SessionWhereInputSchema).optional(),
  some: z.lazy(() => SessionWhereInputSchema).optional(),
  none: z.lazy(() => SessionWhereInputSchema).optional(),
}).strict();

export const PlaidItemListRelationFilterSchema: z.ZodType<PrismaClient.Prisma.PlaidItemListRelationFilter> = z.object({
  every: z.lazy(() => PlaidItemWhereInputSchema).optional(),
  some: z.lazy(() => PlaidItemWhereInputSchema).optional(),
  none: z.lazy(() => PlaidItemWhereInputSchema).optional(),
}).strict();

export const AirtableTokenListRelationFilterSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenListRelationFilter> = z.object({
  every: z.lazy(() => AirtableTokenWhereInputSchema).optional(),
  some: z.lazy(() => AirtableTokenWhereInputSchema).optional(),
  none: z.lazy(() => AirtableTokenWhereInputSchema).optional(),
}).strict();

export const AirtableAuthorizationCacheRelationFilterSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheRelationFilter> = z.object({
  is: z.lazy(() => AirtableAuthorizationCacheWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => AirtableAuthorizationCacheWhereInputSchema).optional().nullable(),
}).strict();

export const LinkTokenOrderByRelationAggregateInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const AccountOrderByRelationAggregateInputSchema: z.ZodType<PrismaClient.Prisma.AccountOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const SessionOrderByRelationAggregateInputSchema: z.ZodType<PrismaClient.Prisma.SessionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const PlaidItemOrderByRelationAggregateInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const AirtableTokenOrderByRelationAggregateInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  disabledAt: z.lazy(() => SortOrderSchema).optional(),
  timezone: z.lazy(() => SortOrderSchema).optional(),
  stripeCustomerId: z.lazy(() => SortOrderSchema).optional(),
  isSubsribedGeneral: z.lazy(() => SortOrderSchema).optional(),
  isSubscribedPeriodicUpdates: z.lazy(() => SortOrderSchema).optional(),
  periodicUpdatesFrequency: z.lazy(() => SortOrderSchema).optional(),
  periodicUpdatesJobId: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  disabledAt: z.lazy(() => SortOrderSchema).optional(),
  timezone: z.lazy(() => SortOrderSchema).optional(),
  stripeCustomerId: z.lazy(() => SortOrderSchema).optional(),
  isSubsribedGeneral: z.lazy(() => SortOrderSchema).optional(),
  isSubscribedPeriodicUpdates: z.lazy(() => SortOrderSchema).optional(),
  periodicUpdatesFrequency: z.lazy(() => SortOrderSchema).optional(),
  periodicUpdatesJobId: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  disabledAt: z.lazy(() => SortOrderSchema).optional(),
  timezone: z.lazy(() => SortOrderSchema).optional(),
  stripeCustomerId: z.lazy(() => SortOrderSchema).optional(),
  isSubsribedGeneral: z.lazy(() => SortOrderSchema).optional(),
  isSubscribedPeriodicUpdates: z.lazy(() => SortOrderSchema).optional(),
  periodicUpdatesFrequency: z.lazy(() => SortOrderSchema).optional(),
  periodicUpdatesJobId: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<PrismaClient.Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([z.boolean(), z.lazy(() => NestedBoolWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
}).strict();

export const EnumFrequencyWithAggregatesFilterSchema: z.ZodType<PrismaClient.Prisma.EnumFrequencyWithAggregatesFilter> = z.object({
  equals: z.lazy(() => FrequencySchema).optional(),
  in: z.lazy(() => FrequencySchema).array().optional(),
  notIn: z.lazy(() => FrequencySchema).array().optional(),
  not: z.union([z.lazy(() => FrequencySchema), z.lazy(() => NestedEnumFrequencyWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumFrequencyFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumFrequencyFilterSchema).optional(),
}).strict();

export const VerificationTokenIdentifierTokenCompoundUniqueInputSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenIdentifierTokenCompoundUniqueInput> = z.object({
  identifier: z.string(),
  token: z.string(),
}).strict();

export const VerificationTokenCountOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenCountOrderByAggregateInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const VerificationTokenMaxOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenMaxOrderByAggregateInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const VerificationTokenMinOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenMinOrderByAggregateInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const PlaidInstitutionCountOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  logoUrl: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const PlaidInstitutionMaxOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  logoUrl: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const PlaidInstitutionMinOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  logoUrl: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const JsonFilterSchema: z.ZodType<PrismaClient.Prisma.JsonFilter> = z.object({
  equals: z.union([InputJsonValue, z.lazy(() => JsonNullValueFilterSchema)]).optional(),
  path: z.string().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValue.optional().nullable(),
  array_starts_with: InputJsonValue.optional().nullable(),
  array_ends_with: InputJsonValue.optional().nullable(),
  lt: InputJsonValue.optional(),
  lte: InputJsonValue.optional(),
  gt: InputJsonValue.optional(),
  gte: InputJsonValue.optional(),
  not: z.union([InputJsonValue, z.lazy(() => JsonNullValueFilterSchema)]).optional(),
}).strict();

export const PlaidInstitutionRelationFilterSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionRelationFilter> = z.object({
  is: z.lazy(() => PlaidInstitutionWhereInputSchema).optional(),
  isNot: z.lazy(() => PlaidInstitutionWhereInputSchema).optional(),
}).strict();

export const PlaidAccountListRelationFilterSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountListRelationFilter> = z.object({
  every: z.lazy(() => PlaidAccountWhereInputSchema).optional(),
  some: z.lazy(() => PlaidAccountWhereInputSchema).optional(),
  none: z.lazy(() => PlaidAccountWhereInputSchema).optional(),
}).strict();

export const PlaidAccountOrderByRelationAggregateInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const PlaidItemCountOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  institutionId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  isInitialUpdateComplete: z.lazy(() => SortOrderSchema).optional(),
  isHistoricalUpdateComplete: z.lazy(() => SortOrderSchema).optional(),
  error: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  plaidSyncCursor: z.lazy(() => SortOrderSchema).optional(),
  availableProducts: z.lazy(() => SortOrderSchema).optional(),
  billedProducts: z.lazy(() => SortOrderSchema).optional(),
  lastSyncedAt: z.lazy(() => SortOrderSchema).optional(),
  consentExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  disabledAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const PlaidItemMaxOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  institutionId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  isInitialUpdateComplete: z.lazy(() => SortOrderSchema).optional(),
  isHistoricalUpdateComplete: z.lazy(() => SortOrderSchema).optional(),
  error: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  plaidSyncCursor: z.lazy(() => SortOrderSchema).optional(),
  lastSyncedAt: z.lazy(() => SortOrderSchema).optional(),
  consentExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  disabledAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const PlaidItemMinOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  institutionId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  isInitialUpdateComplete: z.lazy(() => SortOrderSchema).optional(),
  isHistoricalUpdateComplete: z.lazy(() => SortOrderSchema).optional(),
  error: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  plaidSyncCursor: z.lazy(() => SortOrderSchema).optional(),
  lastSyncedAt: z.lazy(() => SortOrderSchema).optional(),
  consentExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  disabledAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const JsonWithAggregatesFilterSchema: z.ZodType<PrismaClient.Prisma.JsonWithAggregatesFilter> = z.object({
  equals: z.union([InputJsonValue, z.lazy(() => JsonNullValueFilterSchema)]).optional(),
  path: z.string().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValue.optional().nullable(),
  array_starts_with: InputJsonValue.optional().nullable(),
  array_ends_with: InputJsonValue.optional().nullable(),
  lt: InputJsonValue.optional(),
  lte: InputJsonValue.optional(),
  gt: InputJsonValue.optional(),
  gte: InputJsonValue.optional(),
  not: z.union([InputJsonValue, z.lazy(() => JsonNullValueFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional(),
}).strict();

export const DestinationListRelationFilterSchema: z.ZodType<PrismaClient.Prisma.DestinationListRelationFilter> = z.object({
  every: z.lazy(() => DestinationWhereInputSchema).optional(),
  some: z.lazy(() => DestinationWhereInputSchema).optional(),
  none: z.lazy(() => DestinationWhereInputSchema).optional(),
}).strict();

export const PlaidItemRelationFilterSchema: z.ZodType<PrismaClient.Prisma.PlaidItemRelationFilter> = z.object({
  is: z.lazy(() => PlaidItemWhereInputSchema).optional(),
  isNot: z.lazy(() => PlaidItemWhereInputSchema).optional(),
}).strict();

export const DestinationOrderByRelationAggregateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const PlaidAccountCountOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  plaidItemId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  mask: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const PlaidAccountMaxOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  plaidItemId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  mask: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const PlaidAccountMinOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  plaidItemId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  mask: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const LinkTokenCountOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const LinkTokenMaxOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const LinkTokenMinOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const AirtableCredentialRelationFilterSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialRelationFilter> = z.object({
  is: z.lazy(() => AirtableCredentialWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => AirtableCredentialWhereInputSchema).optional().nullable(),
}).strict();

export const CodaCredentialRelationFilterSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialRelationFilter> = z.object({
  is: z.lazy(() => CodaCredentialWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => CodaCredentialWhereInputSchema).optional().nullable(),
}).strict();

export const GoogleSheetsCredentialRelationFilterSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialRelationFilter> = z.object({
  is: z.lazy(() => GoogleSheetsCredentialWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => GoogleSheetsCredentialWhereInputSchema).optional().nullable(),
}).strict();

export const NotionCredentialRelationFilterSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialRelationFilter> = z.object({
  is: z.lazy(() => NotionCredentialWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => NotionCredentialWhereInputSchema).optional().nullable(),
}).strict();

export const EnumIntegrationFilterSchema: z.ZodType<PrismaClient.Prisma.EnumIntegrationFilter> = z.object({
  equals: z.lazy(() => IntegrationSchema).optional(),
  in: z.lazy(() => IntegrationSchema).array().optional(),
  notIn: z.lazy(() => IntegrationSchema).array().optional(),
  not: z.union([z.lazy(() => IntegrationSchema), z.lazy(() => NestedEnumIntegrationFilterSchema)]).optional(),
}).strict();

export const DestinationTableConfigListRelationFilterSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigListRelationFilter> = z.object({
  every: z.lazy(() => DestinationTableConfigWhereInputSchema).optional(),
  some: z.lazy(() => DestinationTableConfigWhereInputSchema).optional(),
  none: z.lazy(() => DestinationTableConfigWhereInputSchema).optional(),
}).strict();

export const DestinationTableConfigOrderByRelationAggregateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const DestinationCountOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  airtableCredentialId: z.lazy(() => SortOrderSchema).optional(),
  codaCredentialId: z.lazy(() => SortOrderSchema).optional(),
  googleSheetsCredentialId: z.lazy(() => SortOrderSchema).optional(),
  notionCredentialId: z.lazy(() => SortOrderSchema).optional(),
  integration: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  syncStartDate: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  disabledAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const DestinationMaxOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  airtableCredentialId: z.lazy(() => SortOrderSchema).optional(),
  codaCredentialId: z.lazy(() => SortOrderSchema).optional(),
  googleSheetsCredentialId: z.lazy(() => SortOrderSchema).optional(),
  notionCredentialId: z.lazy(() => SortOrderSchema).optional(),
  integration: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  syncStartDate: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  disabledAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const DestinationMinOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  airtableCredentialId: z.lazy(() => SortOrderSchema).optional(),
  codaCredentialId: z.lazy(() => SortOrderSchema).optional(),
  googleSheetsCredentialId: z.lazy(() => SortOrderSchema).optional(),
  notionCredentialId: z.lazy(() => SortOrderSchema).optional(),
  integration: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  syncStartDate: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  disabledAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const EnumIntegrationWithAggregatesFilterSchema: z.ZodType<PrismaClient.Prisma.EnumIntegrationWithAggregatesFilter> = z.object({
  equals: z.lazy(() => IntegrationSchema).optional(),
  in: z.lazy(() => IntegrationSchema).array().optional(),
  notIn: z.lazy(() => IntegrationSchema).array().optional(),
  not: z.union([z.lazy(() => IntegrationSchema), z.lazy(() => NestedEnumIntegrationWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumIntegrationFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumIntegrationFilterSchema).optional(),
}).strict();

export const DestinationRelationFilterSchema: z.ZodType<PrismaClient.Prisma.DestinationRelationFilter> = z.object({
  is: z.lazy(() => DestinationWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => DestinationWhereInputSchema).optional().nullable(),
}).strict();

export const EnumTableFilterSchema: z.ZodType<PrismaClient.Prisma.EnumTableFilter> = z.object({
  equals: z.lazy(() => TableSchema).optional(),
  in: z.lazy(() => TableSchema).array().optional(),
  notIn: z.lazy(() => TableSchema).array().optional(),
  not: z.union([z.lazy(() => TableSchema), z.lazy(() => NestedEnumTableFilterSchema)]).optional(),
}).strict();

export const DestinationFieldConfigListRelationFilterSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigListRelationFilter> = z.object({
  every: z.lazy(() => DestinationFieldConfigWhereInputSchema).optional(),
  some: z.lazy(() => DestinationFieldConfigWhereInputSchema).optional(),
  none: z.lazy(() => DestinationFieldConfigWhereInputSchema).optional(),
}).strict();

export const DestinationFieldConfigOrderByRelationAggregateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const DestinationTableConfigDestinationIdTableCompoundUniqueInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigDestinationIdTableCompoundUniqueInput> = z.object({
  destinationId: z.string(),
  table: z.lazy(() => TableSchema),
}).strict();

export const DestinationTableConfigCountOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  destinationId: z.lazy(() => SortOrderSchema).optional(),
  isEnabled: z.lazy(() => SortOrderSchema).optional(),
  table: z.lazy(() => SortOrderSchema).optional(),
  tableId: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const DestinationTableConfigMaxOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  destinationId: z.lazy(() => SortOrderSchema).optional(),
  isEnabled: z.lazy(() => SortOrderSchema).optional(),
  table: z.lazy(() => SortOrderSchema).optional(),
  tableId: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const DestinationTableConfigMinOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  destinationId: z.lazy(() => SortOrderSchema).optional(),
  isEnabled: z.lazy(() => SortOrderSchema).optional(),
  table: z.lazy(() => SortOrderSchema).optional(),
  tableId: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const EnumTableWithAggregatesFilterSchema: z.ZodType<PrismaClient.Prisma.EnumTableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TableSchema).optional(),
  in: z.lazy(() => TableSchema).array().optional(),
  notIn: z.lazy(() => TableSchema).array().optional(),
  not: z.union([z.lazy(() => TableSchema), z.lazy(() => NestedEnumTableWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTableFilterSchema).optional(),
}).strict();

export const DestinationTableConfigRelationFilterSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigRelationFilter> = z.object({
  is: z.lazy(() => DestinationTableConfigWhereInputSchema).optional(),
  isNot: z.lazy(() => DestinationTableConfigWhereInputSchema).optional(),
}).strict();

export const EnumFieldFilterSchema: z.ZodType<PrismaClient.Prisma.EnumFieldFilter> = z.object({
  equals: z.lazy(() => FieldSchema).optional(),
  in: z.lazy(() => FieldSchema).array().optional(),
  notIn: z.lazy(() => FieldSchema).array().optional(),
  not: z.union([z.lazy(() => FieldSchema), z.lazy(() => NestedEnumFieldFilterSchema)]).optional(),
}).strict();

export const DestinationFieldConfigTableConfigIdFieldCompoundUniqueInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigTableConfigIdFieldCompoundUniqueInput> = z.object({
  tableConfigId: z.string(),
  field: z.lazy(() => FieldSchema),
}).strict();

export const DestinationFieldConfigCountOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tableConfigId: z.lazy(() => SortOrderSchema).optional(),
  field: z.lazy(() => SortOrderSchema).optional(),
  fieldId: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const DestinationFieldConfigMaxOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tableConfigId: z.lazy(() => SortOrderSchema).optional(),
  field: z.lazy(() => SortOrderSchema).optional(),
  fieldId: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const DestinationFieldConfigMinOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tableConfigId: z.lazy(() => SortOrderSchema).optional(),
  field: z.lazy(() => SortOrderSchema).optional(),
  fieldId: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const EnumFieldWithAggregatesFilterSchema: z.ZodType<PrismaClient.Prisma.EnumFieldWithAggregatesFilter> = z.object({
  equals: z.lazy(() => FieldSchema).optional(),
  in: z.lazy(() => FieldSchema).array().optional(),
  notIn: z.lazy(() => FieldSchema).array().optional(),
  not: z.union([z.lazy(() => FieldSchema), z.lazy(() => NestedEnumFieldWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumFieldFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumFieldFilterSchema).optional(),
}).strict();

export const AirtableCredentialCountOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  baseId: z.lazy(() => SortOrderSchema).optional(),
  apiKey: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const AirtableCredentialMaxOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  baseId: z.lazy(() => SortOrderSchema).optional(),
  apiKey: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const AirtableCredentialMinOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  baseId: z.lazy(() => SortOrderSchema).optional(),
  apiKey: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const AirtableAuthorizationCacheCountOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  codeVerifier: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const AirtableAuthorizationCacheMaxOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  codeVerifier: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const AirtableAuthorizationCacheMinOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  codeVerifier: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const AirtableTokenCountOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.lazy(() => SortOrderSchema).optional(),
  tokenType: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  refreshedAt: z.lazy(() => SortOrderSchema).optional(),
  accessTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  refreshTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const AirtableTokenMaxOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.lazy(() => SortOrderSchema).optional(),
  tokenType: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  refreshedAt: z.lazy(() => SortOrderSchema).optional(),
  accessTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  refreshTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const AirtableTokenMinOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.lazy(() => SortOrderSchema).optional(),
  tokenType: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  refreshedAt: z.lazy(() => SortOrderSchema).optional(),
  accessTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  refreshTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const CodaCredentialCountOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  accessTokenHash: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const CodaCredentialMaxOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  accessTokenHash: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const CodaCredentialMinOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  accessTokenHash: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const GoogleSheetsCredentialCountOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  spreadsheetId: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const GoogleSheetsCredentialMaxOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  spreadsheetId: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const GoogleSheetsCredentialMinOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  spreadsheetId: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const NotionCredentialCountOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  botId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  workspaceName: z.lazy(() => SortOrderSchema).optional(),
  workspaceIcon: z.lazy(() => SortOrderSchema).optional(),
  owner: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const NotionCredentialMaxOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  botId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  workspaceName: z.lazy(() => SortOrderSchema).optional(),
  workspaceIcon: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const NotionCredentialMinOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  botId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  workspaceName: z.lazy(() => SortOrderSchema).optional(),
  workspaceIcon: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const EnumSyncErrorNullableFilterSchema: z.ZodType<PrismaClient.Prisma.EnumSyncErrorNullableFilter> = z.object({
  equals: z.lazy(() => SyncErrorSchema).optional().nullable(),
  in: z.lazy(() => SyncErrorSchema).array().optional().nullable(),
  notIn: z.lazy(() => SyncErrorSchema).array().optional().nullable(),
  not: z.union([z.lazy(() => SyncErrorSchema), z.lazy(() => NestedEnumSyncErrorNullableFilterSchema)]).optional().nullable(),
}).strict();

export const SyncLogCountOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.SyncLogCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  error: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const SyncLogMaxOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.SyncLogMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  error: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const SyncLogMinOrderByAggregateInputSchema: z.ZodType<PrismaClient.Prisma.SyncLogMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  error: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const EnumSyncErrorNullableWithAggregatesFilterSchema: z.ZodType<PrismaClient.Prisma.EnumSyncErrorNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => SyncErrorSchema).optional().nullable(),
  in: z.lazy(() => SyncErrorSchema).array().optional().nullable(),
  notIn: z.lazy(() => SyncErrorSchema).array().optional().nullable(),
  not: z.union([z.lazy(() => SyncErrorSchema), z.lazy(() => NestedEnumSyncErrorNullableWithAggregatesFilterSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumSyncErrorNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumSyncErrorNullableFilterSchema).optional(),
}).strict();

export const UserCreateNestedOneWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.UserCreateNestedOneWithoutAccountsInput> = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutAccountsInputSchema), z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<PrismaClient.Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional(),
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<PrismaClient.Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable(),
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<PrismaClient.Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.date().optional().nullable(),
}).strict();

export const UserUpdateOneRequiredWithoutAccountsNestedInputSchema: z.ZodType<PrismaClient.Prisma.UserUpdateOneRequiredWithoutAccountsNestedInput> = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutAccountsInputSchema), z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateWithoutAccountsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema)]).optional(),
}).strict();

export const UserCreateNestedOneWithoutSessionsInputSchema: z.ZodType<PrismaClient.Prisma.UserCreateNestedOneWithoutSessionsInput> = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<PrismaClient.Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.date().optional(),
}).strict();

export const UserUpdateOneRequiredWithoutSessionsNestedInputSchema: z.ZodType<PrismaClient.Prisma.UserUpdateOneRequiredWithoutSessionsNestedInput> = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema)]).optional(),
}).strict();

export const LinkTokenCreateNestedManyWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([z.lazy(() => LinkTokenCreateWithoutUserInputSchema), z.lazy(() => LinkTokenCreateWithoutUserInputSchema).array(), z.lazy(() => LinkTokenUncheckedCreateWithoutUserInputSchema), z.lazy(() => LinkTokenUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => LinkTokenCreateOrConnectWithoutUserInputSchema), z.lazy(() => LinkTokenCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => LinkTokenCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => LinkTokenWhereUniqueInputSchema), z.lazy(() => LinkTokenWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const AccountCreateNestedManyWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AccountCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([z.lazy(() => AccountCreateWithoutUserInputSchema), z.lazy(() => AccountCreateWithoutUserInputSchema).array(), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema), z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const SessionCreateNestedManyWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.SessionCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionCreateWithoutUserInputSchema).array(), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema), z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const PlaidItemCreateNestedManyWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([z.lazy(() => PlaidItemCreateWithoutUserInputSchema), z.lazy(() => PlaidItemCreateWithoutUserInputSchema).array(), z.lazy(() => PlaidItemUncheckedCreateWithoutUserInputSchema), z.lazy(() => PlaidItemUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PlaidItemCreateOrConnectWithoutUserInputSchema), z.lazy(() => PlaidItemCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => PlaidItemCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => PlaidItemWhereUniqueInputSchema), z.lazy(() => PlaidItemWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const AirtableTokenCreateNestedManyWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([z.lazy(() => AirtableTokenCreateWithoutUserInputSchema), z.lazy(() => AirtableTokenCreateWithoutUserInputSchema).array(), z.lazy(() => AirtableTokenUncheckedCreateWithoutUserInputSchema), z.lazy(() => AirtableTokenUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AirtableTokenCreateOrConnectWithoutUserInputSchema), z.lazy(() => AirtableTokenCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => AirtableTokenCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => AirtableTokenWhereUniqueInputSchema), z.lazy(() => AirtableTokenWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const AirtableAuthorizationCacheCreateNestedOneWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([z.lazy(() => AirtableAuthorizationCacheCreateWithoutUserInputSchema), z.lazy(() => AirtableAuthorizationCacheUncheckedCreateWithoutUserInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => AirtableAuthorizationCacheCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => AirtableAuthorizationCacheWhereUniqueInputSchema).optional(),
}).strict();

export const LinkTokenUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([z.lazy(() => LinkTokenCreateWithoutUserInputSchema), z.lazy(() => LinkTokenCreateWithoutUserInputSchema).array(), z.lazy(() => LinkTokenUncheckedCreateWithoutUserInputSchema), z.lazy(() => LinkTokenUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => LinkTokenCreateOrConnectWithoutUserInputSchema), z.lazy(() => LinkTokenCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => LinkTokenCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => LinkTokenWhereUniqueInputSchema), z.lazy(() => LinkTokenWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const AccountUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AccountUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([z.lazy(() => AccountCreateWithoutUserInputSchema), z.lazy(() => AccountCreateWithoutUserInputSchema).array(), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema), z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const SessionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.SessionUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionCreateWithoutUserInputSchema).array(), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema), z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const PlaidItemUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([z.lazy(() => PlaidItemCreateWithoutUserInputSchema), z.lazy(() => PlaidItemCreateWithoutUserInputSchema).array(), z.lazy(() => PlaidItemUncheckedCreateWithoutUserInputSchema), z.lazy(() => PlaidItemUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PlaidItemCreateOrConnectWithoutUserInputSchema), z.lazy(() => PlaidItemCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => PlaidItemCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => PlaidItemWhereUniqueInputSchema), z.lazy(() => PlaidItemWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const AirtableTokenUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([z.lazy(() => AirtableTokenCreateWithoutUserInputSchema), z.lazy(() => AirtableTokenCreateWithoutUserInputSchema).array(), z.lazy(() => AirtableTokenUncheckedCreateWithoutUserInputSchema), z.lazy(() => AirtableTokenUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AirtableTokenCreateOrConnectWithoutUserInputSchema), z.lazy(() => AirtableTokenCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => AirtableTokenCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => AirtableTokenWhereUniqueInputSchema), z.lazy(() => AirtableTokenWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const AirtableAuthorizationCacheUncheckedCreateNestedOneWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheUncheckedCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([z.lazy(() => AirtableAuthorizationCacheCreateWithoutUserInputSchema), z.lazy(() => AirtableAuthorizationCacheUncheckedCreateWithoutUserInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => AirtableAuthorizationCacheCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => AirtableAuthorizationCacheWhereUniqueInputSchema).optional(),
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<PrismaClient.Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional(),
}).strict();

export const EnumFrequencyFieldUpdateOperationsInputSchema: z.ZodType<PrismaClient.Prisma.EnumFrequencyFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => FrequencySchema).optional(),
}).strict();

export const LinkTokenUpdateManyWithoutUserNestedInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([z.lazy(() => LinkTokenCreateWithoutUserInputSchema), z.lazy(() => LinkTokenCreateWithoutUserInputSchema).array(), z.lazy(() => LinkTokenUncheckedCreateWithoutUserInputSchema), z.lazy(() => LinkTokenUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => LinkTokenCreateOrConnectWithoutUserInputSchema), z.lazy(() => LinkTokenCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => LinkTokenUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => LinkTokenUpsertWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => LinkTokenCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => LinkTokenWhereUniqueInputSchema), z.lazy(() => LinkTokenWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => LinkTokenWhereUniqueInputSchema), z.lazy(() => LinkTokenWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => LinkTokenWhereUniqueInputSchema), z.lazy(() => LinkTokenWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => LinkTokenWhereUniqueInputSchema), z.lazy(() => LinkTokenWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => LinkTokenUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => LinkTokenUpdateWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => LinkTokenUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => LinkTokenUpdateManyWithWhereWithoutUserInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => LinkTokenScalarWhereInputSchema), z.lazy(() => LinkTokenScalarWhereInputSchema).array()]).optional(),
}).strict();

export const AccountUpdateManyWithoutUserNestedInputSchema: z.ZodType<PrismaClient.Prisma.AccountUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([z.lazy(() => AccountCreateWithoutUserInputSchema), z.lazy(() => AccountCreateWithoutUserInputSchema).array(), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema), z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => AccountScalarWhereInputSchema), z.lazy(() => AccountScalarWhereInputSchema).array()]).optional(),
}).strict();

export const SessionUpdateManyWithoutUserNestedInputSchema: z.ZodType<PrismaClient.Prisma.SessionUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionCreateWithoutUserInputSchema).array(), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema), z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => SessionScalarWhereInputSchema), z.lazy(() => SessionScalarWhereInputSchema).array()]).optional(),
}).strict();

export const PlaidItemUpdateManyWithoutUserNestedInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([z.lazy(() => PlaidItemCreateWithoutUserInputSchema), z.lazy(() => PlaidItemCreateWithoutUserInputSchema).array(), z.lazy(() => PlaidItemUncheckedCreateWithoutUserInputSchema), z.lazy(() => PlaidItemUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PlaidItemCreateOrConnectWithoutUserInputSchema), z.lazy(() => PlaidItemCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PlaidItemUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => PlaidItemUpsertWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => PlaidItemCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => PlaidItemWhereUniqueInputSchema), z.lazy(() => PlaidItemWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PlaidItemWhereUniqueInputSchema), z.lazy(() => PlaidItemWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PlaidItemWhereUniqueInputSchema), z.lazy(() => PlaidItemWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PlaidItemWhereUniqueInputSchema), z.lazy(() => PlaidItemWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => PlaidItemUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => PlaidItemUpdateWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PlaidItemUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => PlaidItemUpdateManyWithWhereWithoutUserInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PlaidItemScalarWhereInputSchema), z.lazy(() => PlaidItemScalarWhereInputSchema).array()]).optional(),
}).strict();

export const AirtableTokenUpdateManyWithoutUserNestedInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([z.lazy(() => AirtableTokenCreateWithoutUserInputSchema), z.lazy(() => AirtableTokenCreateWithoutUserInputSchema).array(), z.lazy(() => AirtableTokenUncheckedCreateWithoutUserInputSchema), z.lazy(() => AirtableTokenUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AirtableTokenCreateOrConnectWithoutUserInputSchema), z.lazy(() => AirtableTokenCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => AirtableTokenUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => AirtableTokenUpsertWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => AirtableTokenCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => AirtableTokenWhereUniqueInputSchema), z.lazy(() => AirtableTokenWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => AirtableTokenWhereUniqueInputSchema), z.lazy(() => AirtableTokenWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => AirtableTokenWhereUniqueInputSchema), z.lazy(() => AirtableTokenWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => AirtableTokenWhereUniqueInputSchema), z.lazy(() => AirtableTokenWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => AirtableTokenUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => AirtableTokenUpdateWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => AirtableTokenUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => AirtableTokenUpdateManyWithWhereWithoutUserInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => AirtableTokenScalarWhereInputSchema), z.lazy(() => AirtableTokenScalarWhereInputSchema).array()]).optional(),
}).strict();

export const AirtableAuthorizationCacheUpdateOneWithoutUserNestedInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([z.lazy(() => AirtableAuthorizationCacheCreateWithoutUserInputSchema), z.lazy(() => AirtableAuthorizationCacheUncheckedCreateWithoutUserInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => AirtableAuthorizationCacheCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => AirtableAuthorizationCacheUpsertWithoutUserInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => AirtableAuthorizationCacheWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => AirtableAuthorizationCacheUpdateWithoutUserInputSchema), z.lazy(() => AirtableAuthorizationCacheUncheckedUpdateWithoutUserInputSchema)]).optional(),
}).strict();

export const LinkTokenUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([z.lazy(() => LinkTokenCreateWithoutUserInputSchema), z.lazy(() => LinkTokenCreateWithoutUserInputSchema).array(), z.lazy(() => LinkTokenUncheckedCreateWithoutUserInputSchema), z.lazy(() => LinkTokenUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => LinkTokenCreateOrConnectWithoutUserInputSchema), z.lazy(() => LinkTokenCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => LinkTokenUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => LinkTokenUpsertWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => LinkTokenCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => LinkTokenWhereUniqueInputSchema), z.lazy(() => LinkTokenWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => LinkTokenWhereUniqueInputSchema), z.lazy(() => LinkTokenWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => LinkTokenWhereUniqueInputSchema), z.lazy(() => LinkTokenWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => LinkTokenWhereUniqueInputSchema), z.lazy(() => LinkTokenWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => LinkTokenUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => LinkTokenUpdateWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => LinkTokenUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => LinkTokenUpdateManyWithWhereWithoutUserInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => LinkTokenScalarWhereInputSchema), z.lazy(() => LinkTokenScalarWhereInputSchema).array()]).optional(),
}).strict();

export const AccountUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<PrismaClient.Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([z.lazy(() => AccountCreateWithoutUserInputSchema), z.lazy(() => AccountCreateWithoutUserInputSchema).array(), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema), z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => AccountScalarWhereInputSchema), z.lazy(() => AccountScalarWhereInputSchema).array()]).optional(),
}).strict();

export const SessionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<PrismaClient.Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionCreateWithoutUserInputSchema).array(), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema), z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => SessionScalarWhereInputSchema), z.lazy(() => SessionScalarWhereInputSchema).array()]).optional(),
}).strict();

export const PlaidItemUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([z.lazy(() => PlaidItemCreateWithoutUserInputSchema), z.lazy(() => PlaidItemCreateWithoutUserInputSchema).array(), z.lazy(() => PlaidItemUncheckedCreateWithoutUserInputSchema), z.lazy(() => PlaidItemUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PlaidItemCreateOrConnectWithoutUserInputSchema), z.lazy(() => PlaidItemCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PlaidItemUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => PlaidItemUpsertWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => PlaidItemCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => PlaidItemWhereUniqueInputSchema), z.lazy(() => PlaidItemWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PlaidItemWhereUniqueInputSchema), z.lazy(() => PlaidItemWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PlaidItemWhereUniqueInputSchema), z.lazy(() => PlaidItemWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PlaidItemWhereUniqueInputSchema), z.lazy(() => PlaidItemWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => PlaidItemUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => PlaidItemUpdateWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PlaidItemUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => PlaidItemUpdateManyWithWhereWithoutUserInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PlaidItemScalarWhereInputSchema), z.lazy(() => PlaidItemScalarWhereInputSchema).array()]).optional(),
}).strict();

export const AirtableTokenUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([z.lazy(() => AirtableTokenCreateWithoutUserInputSchema), z.lazy(() => AirtableTokenCreateWithoutUserInputSchema).array(), z.lazy(() => AirtableTokenUncheckedCreateWithoutUserInputSchema), z.lazy(() => AirtableTokenUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AirtableTokenCreateOrConnectWithoutUserInputSchema), z.lazy(() => AirtableTokenCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => AirtableTokenUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => AirtableTokenUpsertWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => AirtableTokenCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => AirtableTokenWhereUniqueInputSchema), z.lazy(() => AirtableTokenWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => AirtableTokenWhereUniqueInputSchema), z.lazy(() => AirtableTokenWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => AirtableTokenWhereUniqueInputSchema), z.lazy(() => AirtableTokenWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => AirtableTokenWhereUniqueInputSchema), z.lazy(() => AirtableTokenWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => AirtableTokenUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => AirtableTokenUpdateWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => AirtableTokenUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => AirtableTokenUpdateManyWithWhereWithoutUserInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => AirtableTokenScalarWhereInputSchema), z.lazy(() => AirtableTokenScalarWhereInputSchema).array()]).optional(),
}).strict();

export const AirtableAuthorizationCacheUncheckedUpdateOneWithoutUserNestedInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheUncheckedUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([z.lazy(() => AirtableAuthorizationCacheCreateWithoutUserInputSchema), z.lazy(() => AirtableAuthorizationCacheUncheckedCreateWithoutUserInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => AirtableAuthorizationCacheCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => AirtableAuthorizationCacheUpsertWithoutUserInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => AirtableAuthorizationCacheWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => AirtableAuthorizationCacheUpdateWithoutUserInputSchema), z.lazy(() => AirtableAuthorizationCacheUncheckedUpdateWithoutUserInputSchema)]).optional(),
}).strict();

export const PlaidItemCreateNestedManyWithoutInstitutionInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemCreateNestedManyWithoutInstitutionInput> = z.object({
  create: z.union([z.lazy(() => PlaidItemCreateWithoutInstitutionInputSchema), z.lazy(() => PlaidItemCreateWithoutInstitutionInputSchema).array(), z.lazy(() => PlaidItemUncheckedCreateWithoutInstitutionInputSchema), z.lazy(() => PlaidItemUncheckedCreateWithoutInstitutionInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PlaidItemCreateOrConnectWithoutInstitutionInputSchema), z.lazy(() => PlaidItemCreateOrConnectWithoutInstitutionInputSchema).array()]).optional(),
  createMany: z.lazy(() => PlaidItemCreateManyInstitutionInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => PlaidItemWhereUniqueInputSchema), z.lazy(() => PlaidItemWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const PlaidItemUncheckedCreateNestedManyWithoutInstitutionInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUncheckedCreateNestedManyWithoutInstitutionInput> = z.object({
  create: z.union([z.lazy(() => PlaidItemCreateWithoutInstitutionInputSchema), z.lazy(() => PlaidItemCreateWithoutInstitutionInputSchema).array(), z.lazy(() => PlaidItemUncheckedCreateWithoutInstitutionInputSchema), z.lazy(() => PlaidItemUncheckedCreateWithoutInstitutionInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PlaidItemCreateOrConnectWithoutInstitutionInputSchema), z.lazy(() => PlaidItemCreateOrConnectWithoutInstitutionInputSchema).array()]).optional(),
  createMany: z.lazy(() => PlaidItemCreateManyInstitutionInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => PlaidItemWhereUniqueInputSchema), z.lazy(() => PlaidItemWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const PlaidItemUpdateManyWithoutInstitutionNestedInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUpdateManyWithoutInstitutionNestedInput> = z.object({
  create: z.union([z.lazy(() => PlaidItemCreateWithoutInstitutionInputSchema), z.lazy(() => PlaidItemCreateWithoutInstitutionInputSchema).array(), z.lazy(() => PlaidItemUncheckedCreateWithoutInstitutionInputSchema), z.lazy(() => PlaidItemUncheckedCreateWithoutInstitutionInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PlaidItemCreateOrConnectWithoutInstitutionInputSchema), z.lazy(() => PlaidItemCreateOrConnectWithoutInstitutionInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PlaidItemUpsertWithWhereUniqueWithoutInstitutionInputSchema), z.lazy(() => PlaidItemUpsertWithWhereUniqueWithoutInstitutionInputSchema).array()]).optional(),
  createMany: z.lazy(() => PlaidItemCreateManyInstitutionInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => PlaidItemWhereUniqueInputSchema), z.lazy(() => PlaidItemWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PlaidItemWhereUniqueInputSchema), z.lazy(() => PlaidItemWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PlaidItemWhereUniqueInputSchema), z.lazy(() => PlaidItemWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PlaidItemWhereUniqueInputSchema), z.lazy(() => PlaidItemWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => PlaidItemUpdateWithWhereUniqueWithoutInstitutionInputSchema), z.lazy(() => PlaidItemUpdateWithWhereUniqueWithoutInstitutionInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PlaidItemUpdateManyWithWhereWithoutInstitutionInputSchema), z.lazy(() => PlaidItemUpdateManyWithWhereWithoutInstitutionInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PlaidItemScalarWhereInputSchema), z.lazy(() => PlaidItemScalarWhereInputSchema).array()]).optional(),
}).strict();

export const PlaidItemUncheckedUpdateManyWithoutInstitutionNestedInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUncheckedUpdateManyWithoutInstitutionNestedInput> = z.object({
  create: z.union([z.lazy(() => PlaidItemCreateWithoutInstitutionInputSchema), z.lazy(() => PlaidItemCreateWithoutInstitutionInputSchema).array(), z.lazy(() => PlaidItemUncheckedCreateWithoutInstitutionInputSchema), z.lazy(() => PlaidItemUncheckedCreateWithoutInstitutionInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PlaidItemCreateOrConnectWithoutInstitutionInputSchema), z.lazy(() => PlaidItemCreateOrConnectWithoutInstitutionInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PlaidItemUpsertWithWhereUniqueWithoutInstitutionInputSchema), z.lazy(() => PlaidItemUpsertWithWhereUniqueWithoutInstitutionInputSchema).array()]).optional(),
  createMany: z.lazy(() => PlaidItemCreateManyInstitutionInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => PlaidItemWhereUniqueInputSchema), z.lazy(() => PlaidItemWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PlaidItemWhereUniqueInputSchema), z.lazy(() => PlaidItemWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PlaidItemWhereUniqueInputSchema), z.lazy(() => PlaidItemWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PlaidItemWhereUniqueInputSchema), z.lazy(() => PlaidItemWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => PlaidItemUpdateWithWhereUniqueWithoutInstitutionInputSchema), z.lazy(() => PlaidItemUpdateWithWhereUniqueWithoutInstitutionInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PlaidItemUpdateManyWithWhereWithoutInstitutionInputSchema), z.lazy(() => PlaidItemUpdateManyWithWhereWithoutInstitutionInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PlaidItemScalarWhereInputSchema), z.lazy(() => PlaidItemScalarWhereInputSchema).array()]).optional(),
}).strict();

export const UserCreateNestedOneWithoutPlaidItemsInputSchema: z.ZodType<PrismaClient.Prisma.UserCreateNestedOneWithoutPlaidItemsInput> = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutPlaidItemsInputSchema), z.lazy(() => UserUncheckedCreateWithoutPlaidItemsInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPlaidItemsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
}).strict();

export const PlaidInstitutionCreateNestedOneWithoutItemsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionCreateNestedOneWithoutItemsInput> = z.object({
  create: z.union([z.lazy(() => PlaidInstitutionCreateWithoutItemsInputSchema), z.lazy(() => PlaidInstitutionUncheckedCreateWithoutItemsInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => PlaidInstitutionCreateOrConnectWithoutItemsInputSchema).optional(),
  connect: z.lazy(() => PlaidInstitutionWhereUniqueInputSchema).optional(),
}).strict();

export const PlaidAccountCreateNestedManyWithoutItemInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountCreateNestedManyWithoutItemInput> = z.object({
  create: z.union([z.lazy(() => PlaidAccountCreateWithoutItemInputSchema), z.lazy(() => PlaidAccountCreateWithoutItemInputSchema).array(), z.lazy(() => PlaidAccountUncheckedCreateWithoutItemInputSchema), z.lazy(() => PlaidAccountUncheckedCreateWithoutItemInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PlaidAccountCreateOrConnectWithoutItemInputSchema), z.lazy(() => PlaidAccountCreateOrConnectWithoutItemInputSchema).array()]).optional(),
  createMany: z.lazy(() => PlaidAccountCreateManyItemInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => PlaidAccountWhereUniqueInputSchema), z.lazy(() => PlaidAccountWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const PlaidAccountUncheckedCreateNestedManyWithoutItemInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUncheckedCreateNestedManyWithoutItemInput> = z.object({
  create: z.union([z.lazy(() => PlaidAccountCreateWithoutItemInputSchema), z.lazy(() => PlaidAccountCreateWithoutItemInputSchema).array(), z.lazy(() => PlaidAccountUncheckedCreateWithoutItemInputSchema), z.lazy(() => PlaidAccountUncheckedCreateWithoutItemInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PlaidAccountCreateOrConnectWithoutItemInputSchema), z.lazy(() => PlaidAccountCreateOrConnectWithoutItemInputSchema).array()]).optional(),
  createMany: z.lazy(() => PlaidAccountCreateManyItemInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => PlaidAccountWhereUniqueInputSchema), z.lazy(() => PlaidAccountWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutPlaidItemsNestedInputSchema: z.ZodType<PrismaClient.Prisma.UserUpdateOneRequiredWithoutPlaidItemsNestedInput> = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutPlaidItemsInputSchema), z.lazy(() => UserUncheckedCreateWithoutPlaidItemsInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPlaidItemsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutPlaidItemsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateWithoutPlaidItemsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutPlaidItemsInputSchema)]).optional(),
}).strict();

export const PlaidInstitutionUpdateOneRequiredWithoutItemsNestedInputSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionUpdateOneRequiredWithoutItemsNestedInput> = z.object({
  create: z.union([z.lazy(() => PlaidInstitutionCreateWithoutItemsInputSchema), z.lazy(() => PlaidInstitutionUncheckedCreateWithoutItemsInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => PlaidInstitutionCreateOrConnectWithoutItemsInputSchema).optional(),
  upsert: z.lazy(() => PlaidInstitutionUpsertWithoutItemsInputSchema).optional(),
  connect: z.lazy(() => PlaidInstitutionWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => PlaidInstitutionUpdateWithoutItemsInputSchema), z.lazy(() => PlaidInstitutionUncheckedUpdateWithoutItemsInputSchema)]).optional(),
}).strict();

export const PlaidAccountUpdateManyWithoutItemNestedInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUpdateManyWithoutItemNestedInput> = z.object({
  create: z.union([z.lazy(() => PlaidAccountCreateWithoutItemInputSchema), z.lazy(() => PlaidAccountCreateWithoutItemInputSchema).array(), z.lazy(() => PlaidAccountUncheckedCreateWithoutItemInputSchema), z.lazy(() => PlaidAccountUncheckedCreateWithoutItemInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PlaidAccountCreateOrConnectWithoutItemInputSchema), z.lazy(() => PlaidAccountCreateOrConnectWithoutItemInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PlaidAccountUpsertWithWhereUniqueWithoutItemInputSchema), z.lazy(() => PlaidAccountUpsertWithWhereUniqueWithoutItemInputSchema).array()]).optional(),
  createMany: z.lazy(() => PlaidAccountCreateManyItemInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => PlaidAccountWhereUniqueInputSchema), z.lazy(() => PlaidAccountWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PlaidAccountWhereUniqueInputSchema), z.lazy(() => PlaidAccountWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PlaidAccountWhereUniqueInputSchema), z.lazy(() => PlaidAccountWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PlaidAccountWhereUniqueInputSchema), z.lazy(() => PlaidAccountWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => PlaidAccountUpdateWithWhereUniqueWithoutItemInputSchema), z.lazy(() => PlaidAccountUpdateWithWhereUniqueWithoutItemInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PlaidAccountUpdateManyWithWhereWithoutItemInputSchema), z.lazy(() => PlaidAccountUpdateManyWithWhereWithoutItemInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PlaidAccountScalarWhereInputSchema), z.lazy(() => PlaidAccountScalarWhereInputSchema).array()]).optional(),
}).strict();

export const PlaidAccountUncheckedUpdateManyWithoutItemNestedInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUncheckedUpdateManyWithoutItemNestedInput> = z.object({
  create: z.union([z.lazy(() => PlaidAccountCreateWithoutItemInputSchema), z.lazy(() => PlaidAccountCreateWithoutItemInputSchema).array(), z.lazy(() => PlaidAccountUncheckedCreateWithoutItemInputSchema), z.lazy(() => PlaidAccountUncheckedCreateWithoutItemInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PlaidAccountCreateOrConnectWithoutItemInputSchema), z.lazy(() => PlaidAccountCreateOrConnectWithoutItemInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PlaidAccountUpsertWithWhereUniqueWithoutItemInputSchema), z.lazy(() => PlaidAccountUpsertWithWhereUniqueWithoutItemInputSchema).array()]).optional(),
  createMany: z.lazy(() => PlaidAccountCreateManyItemInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => PlaidAccountWhereUniqueInputSchema), z.lazy(() => PlaidAccountWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PlaidAccountWhereUniqueInputSchema), z.lazy(() => PlaidAccountWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PlaidAccountWhereUniqueInputSchema), z.lazy(() => PlaidAccountWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PlaidAccountWhereUniqueInputSchema), z.lazy(() => PlaidAccountWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => PlaidAccountUpdateWithWhereUniqueWithoutItemInputSchema), z.lazy(() => PlaidAccountUpdateWithWhereUniqueWithoutItemInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PlaidAccountUpdateManyWithWhereWithoutItemInputSchema), z.lazy(() => PlaidAccountUpdateManyWithWhereWithoutItemInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PlaidAccountScalarWhereInputSchema), z.lazy(() => PlaidAccountScalarWhereInputSchema).array()]).optional(),
}).strict();

export const DestinationCreateNestedManyWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateNestedManyWithoutAccountsInput> = z.object({
  create: z.union([z.lazy(() => DestinationCreateWithoutAccountsInputSchema), z.lazy(() => DestinationCreateWithoutAccountsInputSchema).array(), z.lazy(() => DestinationUncheckedCreateWithoutAccountsInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutAccountsInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => DestinationCreateOrConnectWithoutAccountsInputSchema), z.lazy(() => DestinationCreateOrConnectWithoutAccountsInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => DestinationWhereUniqueInputSchema), z.lazy(() => DestinationWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const PlaidItemCreateNestedOneWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemCreateNestedOneWithoutAccountsInput> = z.object({
  create: z.union([z.lazy(() => PlaidItemCreateWithoutAccountsInputSchema), z.lazy(() => PlaidItemUncheckedCreateWithoutAccountsInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => PlaidItemCreateOrConnectWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => PlaidItemWhereUniqueInputSchema).optional(),
}).strict();

export const DestinationUncheckedCreateNestedManyWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedCreateNestedManyWithoutAccountsInput> = z.object({
  create: z.union([z.lazy(() => DestinationCreateWithoutAccountsInputSchema), z.lazy(() => DestinationCreateWithoutAccountsInputSchema).array(), z.lazy(() => DestinationUncheckedCreateWithoutAccountsInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutAccountsInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => DestinationCreateOrConnectWithoutAccountsInputSchema), z.lazy(() => DestinationCreateOrConnectWithoutAccountsInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => DestinationWhereUniqueInputSchema), z.lazy(() => DestinationWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const DestinationUpdateManyWithoutAccountsNestedInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpdateManyWithoutAccountsNestedInput> = z.object({
  create: z.union([z.lazy(() => DestinationCreateWithoutAccountsInputSchema), z.lazy(() => DestinationCreateWithoutAccountsInputSchema).array(), z.lazy(() => DestinationUncheckedCreateWithoutAccountsInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutAccountsInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => DestinationCreateOrConnectWithoutAccountsInputSchema), z.lazy(() => DestinationCreateOrConnectWithoutAccountsInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => DestinationUpsertWithWhereUniqueWithoutAccountsInputSchema), z.lazy(() => DestinationUpsertWithWhereUniqueWithoutAccountsInputSchema).array()]).optional(),
  set: z.union([z.lazy(() => DestinationWhereUniqueInputSchema), z.lazy(() => DestinationWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => DestinationWhereUniqueInputSchema), z.lazy(() => DestinationWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => DestinationWhereUniqueInputSchema), z.lazy(() => DestinationWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => DestinationWhereUniqueInputSchema), z.lazy(() => DestinationWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => DestinationUpdateWithWhereUniqueWithoutAccountsInputSchema), z.lazy(() => DestinationUpdateWithWhereUniqueWithoutAccountsInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => DestinationUpdateManyWithWhereWithoutAccountsInputSchema), z.lazy(() => DestinationUpdateManyWithWhereWithoutAccountsInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => DestinationScalarWhereInputSchema), z.lazy(() => DestinationScalarWhereInputSchema).array()]).optional(),
}).strict();

export const PlaidItemUpdateOneRequiredWithoutAccountsNestedInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUpdateOneRequiredWithoutAccountsNestedInput> = z.object({
  create: z.union([z.lazy(() => PlaidItemCreateWithoutAccountsInputSchema), z.lazy(() => PlaidItemUncheckedCreateWithoutAccountsInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => PlaidItemCreateOrConnectWithoutAccountsInputSchema).optional(),
  upsert: z.lazy(() => PlaidItemUpsertWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => PlaidItemWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => PlaidItemUpdateWithoutAccountsInputSchema), z.lazy(() => PlaidItemUncheckedUpdateWithoutAccountsInputSchema)]).optional(),
}).strict();

export const DestinationUncheckedUpdateManyWithoutAccountsNestedInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedUpdateManyWithoutAccountsNestedInput> = z.object({
  create: z.union([z.lazy(() => DestinationCreateWithoutAccountsInputSchema), z.lazy(() => DestinationCreateWithoutAccountsInputSchema).array(), z.lazy(() => DestinationUncheckedCreateWithoutAccountsInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutAccountsInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => DestinationCreateOrConnectWithoutAccountsInputSchema), z.lazy(() => DestinationCreateOrConnectWithoutAccountsInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => DestinationUpsertWithWhereUniqueWithoutAccountsInputSchema), z.lazy(() => DestinationUpsertWithWhereUniqueWithoutAccountsInputSchema).array()]).optional(),
  set: z.union([z.lazy(() => DestinationWhereUniqueInputSchema), z.lazy(() => DestinationWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => DestinationWhereUniqueInputSchema), z.lazy(() => DestinationWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => DestinationWhereUniqueInputSchema), z.lazy(() => DestinationWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => DestinationWhereUniqueInputSchema), z.lazy(() => DestinationWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => DestinationUpdateWithWhereUniqueWithoutAccountsInputSchema), z.lazy(() => DestinationUpdateWithWhereUniqueWithoutAccountsInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => DestinationUpdateManyWithWhereWithoutAccountsInputSchema), z.lazy(() => DestinationUpdateManyWithWhereWithoutAccountsInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => DestinationScalarWhereInputSchema), z.lazy(() => DestinationScalarWhereInputSchema).array()]).optional(),
}).strict();

export const UserCreateNestedOneWithoutLinkTokensInputSchema: z.ZodType<PrismaClient.Prisma.UserCreateNestedOneWithoutLinkTokensInput> = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutLinkTokensInputSchema), z.lazy(() => UserUncheckedCreateWithoutLinkTokensInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutLinkTokensInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutLinkTokensNestedInputSchema: z.ZodType<PrismaClient.Prisma.UserUpdateOneRequiredWithoutLinkTokensNestedInput> = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutLinkTokensInputSchema), z.lazy(() => UserUncheckedCreateWithoutLinkTokensInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutLinkTokensInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutLinkTokensInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateWithoutLinkTokensInputSchema), z.lazy(() => UserUncheckedUpdateWithoutLinkTokensInputSchema)]).optional(),
}).strict();

export const AirtableCredentialCreateNestedOneWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialCreateNestedOneWithoutDestinationInput> = z.object({
  create: z.union([z.lazy(() => AirtableCredentialCreateWithoutDestinationInputSchema), z.lazy(() => AirtableCredentialUncheckedCreateWithoutDestinationInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => AirtableCredentialCreateOrConnectWithoutDestinationInputSchema).optional(),
  connect: z.lazy(() => AirtableCredentialWhereUniqueInputSchema).optional(),
}).strict();

export const CodaCredentialCreateNestedOneWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialCreateNestedOneWithoutDestinationInput> = z.object({
  create: z.union([z.lazy(() => CodaCredentialCreateWithoutDestinationInputSchema), z.lazy(() => CodaCredentialUncheckedCreateWithoutDestinationInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => CodaCredentialCreateOrConnectWithoutDestinationInputSchema).optional(),
  connect: z.lazy(() => CodaCredentialWhereUniqueInputSchema).optional(),
}).strict();

export const GoogleSheetsCredentialCreateNestedOneWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialCreateNestedOneWithoutDestinationInput> = z.object({
  create: z.union([z.lazy(() => GoogleSheetsCredentialCreateWithoutDestinationInputSchema), z.lazy(() => GoogleSheetsCredentialUncheckedCreateWithoutDestinationInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => GoogleSheetsCredentialCreateOrConnectWithoutDestinationInputSchema).optional(),
  connect: z.lazy(() => GoogleSheetsCredentialWhereUniqueInputSchema).optional(),
}).strict();

export const NotionCredentialCreateNestedOneWithoutDestinationsInputSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialCreateNestedOneWithoutDestinationsInput> = z.object({
  create: z.union([z.lazy(() => NotionCredentialCreateWithoutDestinationsInputSchema), z.lazy(() => NotionCredentialUncheckedCreateWithoutDestinationsInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => NotionCredentialCreateOrConnectWithoutDestinationsInputSchema).optional(),
  connect: z.lazy(() => NotionCredentialWhereUniqueInputSchema).optional(),
}).strict();

export const PlaidAccountCreateNestedManyWithoutDestinationsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountCreateNestedManyWithoutDestinationsInput> = z.object({
  create: z.union([z.lazy(() => PlaidAccountCreateWithoutDestinationsInputSchema), z.lazy(() => PlaidAccountCreateWithoutDestinationsInputSchema).array(), z.lazy(() => PlaidAccountUncheckedCreateWithoutDestinationsInputSchema), z.lazy(() => PlaidAccountUncheckedCreateWithoutDestinationsInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PlaidAccountCreateOrConnectWithoutDestinationsInputSchema), z.lazy(() => PlaidAccountCreateOrConnectWithoutDestinationsInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PlaidAccountWhereUniqueInputSchema), z.lazy(() => PlaidAccountWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const DestinationTableConfigCreateNestedManyWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigCreateNestedManyWithoutDestinationInput> = z.object({
  create: z.union([z.lazy(() => DestinationTableConfigCreateWithoutDestinationInputSchema), z.lazy(() => DestinationTableConfigCreateWithoutDestinationInputSchema).array(), z.lazy(() => DestinationTableConfigUncheckedCreateWithoutDestinationInputSchema), z.lazy(() => DestinationTableConfigUncheckedCreateWithoutDestinationInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => DestinationTableConfigCreateOrConnectWithoutDestinationInputSchema), z.lazy(() => DestinationTableConfigCreateOrConnectWithoutDestinationInputSchema).array()]).optional(),
  createMany: z.lazy(() => DestinationTableConfigCreateManyDestinationInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => DestinationTableConfigWhereUniqueInputSchema), z.lazy(() => DestinationTableConfigWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const PlaidAccountUncheckedCreateNestedManyWithoutDestinationsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUncheckedCreateNestedManyWithoutDestinationsInput> = z.object({
  create: z.union([z.lazy(() => PlaidAccountCreateWithoutDestinationsInputSchema), z.lazy(() => PlaidAccountCreateWithoutDestinationsInputSchema).array(), z.lazy(() => PlaidAccountUncheckedCreateWithoutDestinationsInputSchema), z.lazy(() => PlaidAccountUncheckedCreateWithoutDestinationsInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PlaidAccountCreateOrConnectWithoutDestinationsInputSchema), z.lazy(() => PlaidAccountCreateOrConnectWithoutDestinationsInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PlaidAccountWhereUniqueInputSchema), z.lazy(() => PlaidAccountWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const DestinationTableConfigUncheckedCreateNestedManyWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigUncheckedCreateNestedManyWithoutDestinationInput> = z.object({
  create: z.union([z.lazy(() => DestinationTableConfigCreateWithoutDestinationInputSchema), z.lazy(() => DestinationTableConfigCreateWithoutDestinationInputSchema).array(), z.lazy(() => DestinationTableConfigUncheckedCreateWithoutDestinationInputSchema), z.lazy(() => DestinationTableConfigUncheckedCreateWithoutDestinationInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => DestinationTableConfigCreateOrConnectWithoutDestinationInputSchema), z.lazy(() => DestinationTableConfigCreateOrConnectWithoutDestinationInputSchema).array()]).optional(),
  createMany: z.lazy(() => DestinationTableConfigCreateManyDestinationInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => DestinationTableConfigWhereUniqueInputSchema), z.lazy(() => DestinationTableConfigWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const AirtableCredentialUpdateOneWithoutDestinationNestedInputSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialUpdateOneWithoutDestinationNestedInput> = z.object({
  create: z.union([z.lazy(() => AirtableCredentialCreateWithoutDestinationInputSchema), z.lazy(() => AirtableCredentialUncheckedCreateWithoutDestinationInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => AirtableCredentialCreateOrConnectWithoutDestinationInputSchema).optional(),
  upsert: z.lazy(() => AirtableCredentialUpsertWithoutDestinationInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => AirtableCredentialWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => AirtableCredentialUpdateWithoutDestinationInputSchema), z.lazy(() => AirtableCredentialUncheckedUpdateWithoutDestinationInputSchema)]).optional(),
}).strict();

export const CodaCredentialUpdateOneWithoutDestinationNestedInputSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialUpdateOneWithoutDestinationNestedInput> = z.object({
  create: z.union([z.lazy(() => CodaCredentialCreateWithoutDestinationInputSchema), z.lazy(() => CodaCredentialUncheckedCreateWithoutDestinationInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => CodaCredentialCreateOrConnectWithoutDestinationInputSchema).optional(),
  upsert: z.lazy(() => CodaCredentialUpsertWithoutDestinationInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => CodaCredentialWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => CodaCredentialUpdateWithoutDestinationInputSchema), z.lazy(() => CodaCredentialUncheckedUpdateWithoutDestinationInputSchema)]).optional(),
}).strict();

export const GoogleSheetsCredentialUpdateOneWithoutDestinationNestedInputSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialUpdateOneWithoutDestinationNestedInput> = z.object({
  create: z.union([z.lazy(() => GoogleSheetsCredentialCreateWithoutDestinationInputSchema), z.lazy(() => GoogleSheetsCredentialUncheckedCreateWithoutDestinationInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => GoogleSheetsCredentialCreateOrConnectWithoutDestinationInputSchema).optional(),
  upsert: z.lazy(() => GoogleSheetsCredentialUpsertWithoutDestinationInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => GoogleSheetsCredentialWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => GoogleSheetsCredentialUpdateWithoutDestinationInputSchema), z.lazy(() => GoogleSheetsCredentialUncheckedUpdateWithoutDestinationInputSchema)]).optional(),
}).strict();

export const NotionCredentialUpdateOneWithoutDestinationsNestedInputSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialUpdateOneWithoutDestinationsNestedInput> = z.object({
  create: z.union([z.lazy(() => NotionCredentialCreateWithoutDestinationsInputSchema), z.lazy(() => NotionCredentialUncheckedCreateWithoutDestinationsInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => NotionCredentialCreateOrConnectWithoutDestinationsInputSchema).optional(),
  upsert: z.lazy(() => NotionCredentialUpsertWithoutDestinationsInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => NotionCredentialWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => NotionCredentialUpdateWithoutDestinationsInputSchema), z.lazy(() => NotionCredentialUncheckedUpdateWithoutDestinationsInputSchema)]).optional(),
}).strict();

export const EnumIntegrationFieldUpdateOperationsInputSchema: z.ZodType<PrismaClient.Prisma.EnumIntegrationFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => IntegrationSchema).optional(),
}).strict();

export const PlaidAccountUpdateManyWithoutDestinationsNestedInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUpdateManyWithoutDestinationsNestedInput> = z.object({
  create: z.union([z.lazy(() => PlaidAccountCreateWithoutDestinationsInputSchema), z.lazy(() => PlaidAccountCreateWithoutDestinationsInputSchema).array(), z.lazy(() => PlaidAccountUncheckedCreateWithoutDestinationsInputSchema), z.lazy(() => PlaidAccountUncheckedCreateWithoutDestinationsInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PlaidAccountCreateOrConnectWithoutDestinationsInputSchema), z.lazy(() => PlaidAccountCreateOrConnectWithoutDestinationsInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PlaidAccountUpsertWithWhereUniqueWithoutDestinationsInputSchema), z.lazy(() => PlaidAccountUpsertWithWhereUniqueWithoutDestinationsInputSchema).array()]).optional(),
  set: z.union([z.lazy(() => PlaidAccountWhereUniqueInputSchema), z.lazy(() => PlaidAccountWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PlaidAccountWhereUniqueInputSchema), z.lazy(() => PlaidAccountWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PlaidAccountWhereUniqueInputSchema), z.lazy(() => PlaidAccountWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PlaidAccountWhereUniqueInputSchema), z.lazy(() => PlaidAccountWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => PlaidAccountUpdateWithWhereUniqueWithoutDestinationsInputSchema), z.lazy(() => PlaidAccountUpdateWithWhereUniqueWithoutDestinationsInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PlaidAccountUpdateManyWithWhereWithoutDestinationsInputSchema), z.lazy(() => PlaidAccountUpdateManyWithWhereWithoutDestinationsInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PlaidAccountScalarWhereInputSchema), z.lazy(() => PlaidAccountScalarWhereInputSchema).array()]).optional(),
}).strict();

export const DestinationTableConfigUpdateManyWithoutDestinationNestedInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigUpdateManyWithoutDestinationNestedInput> = z.object({
  create: z.union([z.lazy(() => DestinationTableConfigCreateWithoutDestinationInputSchema), z.lazy(() => DestinationTableConfigCreateWithoutDestinationInputSchema).array(), z.lazy(() => DestinationTableConfigUncheckedCreateWithoutDestinationInputSchema), z.lazy(() => DestinationTableConfigUncheckedCreateWithoutDestinationInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => DestinationTableConfigCreateOrConnectWithoutDestinationInputSchema), z.lazy(() => DestinationTableConfigCreateOrConnectWithoutDestinationInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => DestinationTableConfigUpsertWithWhereUniqueWithoutDestinationInputSchema), z.lazy(() => DestinationTableConfigUpsertWithWhereUniqueWithoutDestinationInputSchema).array()]).optional(),
  createMany: z.lazy(() => DestinationTableConfigCreateManyDestinationInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => DestinationTableConfigWhereUniqueInputSchema), z.lazy(() => DestinationTableConfigWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => DestinationTableConfigWhereUniqueInputSchema), z.lazy(() => DestinationTableConfigWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => DestinationTableConfigWhereUniqueInputSchema), z.lazy(() => DestinationTableConfigWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => DestinationTableConfigWhereUniqueInputSchema), z.lazy(() => DestinationTableConfigWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => DestinationTableConfigUpdateWithWhereUniqueWithoutDestinationInputSchema), z.lazy(() => DestinationTableConfigUpdateWithWhereUniqueWithoutDestinationInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => DestinationTableConfigUpdateManyWithWhereWithoutDestinationInputSchema), z.lazy(() => DestinationTableConfigUpdateManyWithWhereWithoutDestinationInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => DestinationTableConfigScalarWhereInputSchema), z.lazy(() => DestinationTableConfigScalarWhereInputSchema).array()]).optional(),
}).strict();

export const PlaidAccountUncheckedUpdateManyWithoutDestinationsNestedInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUncheckedUpdateManyWithoutDestinationsNestedInput> = z.object({
  create: z.union([z.lazy(() => PlaidAccountCreateWithoutDestinationsInputSchema), z.lazy(() => PlaidAccountCreateWithoutDestinationsInputSchema).array(), z.lazy(() => PlaidAccountUncheckedCreateWithoutDestinationsInputSchema), z.lazy(() => PlaidAccountUncheckedCreateWithoutDestinationsInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PlaidAccountCreateOrConnectWithoutDestinationsInputSchema), z.lazy(() => PlaidAccountCreateOrConnectWithoutDestinationsInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PlaidAccountUpsertWithWhereUniqueWithoutDestinationsInputSchema), z.lazy(() => PlaidAccountUpsertWithWhereUniqueWithoutDestinationsInputSchema).array()]).optional(),
  set: z.union([z.lazy(() => PlaidAccountWhereUniqueInputSchema), z.lazy(() => PlaidAccountWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PlaidAccountWhereUniqueInputSchema), z.lazy(() => PlaidAccountWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PlaidAccountWhereUniqueInputSchema), z.lazy(() => PlaidAccountWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PlaidAccountWhereUniqueInputSchema), z.lazy(() => PlaidAccountWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => PlaidAccountUpdateWithWhereUniqueWithoutDestinationsInputSchema), z.lazy(() => PlaidAccountUpdateWithWhereUniqueWithoutDestinationsInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PlaidAccountUpdateManyWithWhereWithoutDestinationsInputSchema), z.lazy(() => PlaidAccountUpdateManyWithWhereWithoutDestinationsInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PlaidAccountScalarWhereInputSchema), z.lazy(() => PlaidAccountScalarWhereInputSchema).array()]).optional(),
}).strict();

export const DestinationTableConfigUncheckedUpdateManyWithoutDestinationNestedInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigUncheckedUpdateManyWithoutDestinationNestedInput> = z.object({
  create: z.union([z.lazy(() => DestinationTableConfigCreateWithoutDestinationInputSchema), z.lazy(() => DestinationTableConfigCreateWithoutDestinationInputSchema).array(), z.lazy(() => DestinationTableConfigUncheckedCreateWithoutDestinationInputSchema), z.lazy(() => DestinationTableConfigUncheckedCreateWithoutDestinationInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => DestinationTableConfigCreateOrConnectWithoutDestinationInputSchema), z.lazy(() => DestinationTableConfigCreateOrConnectWithoutDestinationInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => DestinationTableConfigUpsertWithWhereUniqueWithoutDestinationInputSchema), z.lazy(() => DestinationTableConfigUpsertWithWhereUniqueWithoutDestinationInputSchema).array()]).optional(),
  createMany: z.lazy(() => DestinationTableConfigCreateManyDestinationInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => DestinationTableConfigWhereUniqueInputSchema), z.lazy(() => DestinationTableConfigWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => DestinationTableConfigWhereUniqueInputSchema), z.lazy(() => DestinationTableConfigWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => DestinationTableConfigWhereUniqueInputSchema), z.lazy(() => DestinationTableConfigWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => DestinationTableConfigWhereUniqueInputSchema), z.lazy(() => DestinationTableConfigWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => DestinationTableConfigUpdateWithWhereUniqueWithoutDestinationInputSchema), z.lazy(() => DestinationTableConfigUpdateWithWhereUniqueWithoutDestinationInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => DestinationTableConfigUpdateManyWithWhereWithoutDestinationInputSchema), z.lazy(() => DestinationTableConfigUpdateManyWithWhereWithoutDestinationInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => DestinationTableConfigScalarWhereInputSchema), z.lazy(() => DestinationTableConfigScalarWhereInputSchema).array()]).optional(),
}).strict();

export const DestinationCreateNestedOneWithoutTableConfigsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateNestedOneWithoutTableConfigsInput> = z.object({
  create: z.union([z.lazy(() => DestinationCreateWithoutTableConfigsInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutTableConfigsInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => DestinationCreateOrConnectWithoutTableConfigsInputSchema).optional(),
  connect: z.lazy(() => DestinationWhereUniqueInputSchema).optional(),
}).strict();

export const DestinationFieldConfigCreateNestedManyWithoutTableConfigInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigCreateNestedManyWithoutTableConfigInput> = z.object({
  create: z.union([z.lazy(() => DestinationFieldConfigCreateWithoutTableConfigInputSchema), z.lazy(() => DestinationFieldConfigCreateWithoutTableConfigInputSchema).array(), z.lazy(() => DestinationFieldConfigUncheckedCreateWithoutTableConfigInputSchema), z.lazy(() => DestinationFieldConfigUncheckedCreateWithoutTableConfigInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => DestinationFieldConfigCreateOrConnectWithoutTableConfigInputSchema), z.lazy(() => DestinationFieldConfigCreateOrConnectWithoutTableConfigInputSchema).array()]).optional(),
  createMany: z.lazy(() => DestinationFieldConfigCreateManyTableConfigInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => DestinationFieldConfigWhereUniqueInputSchema), z.lazy(() => DestinationFieldConfigWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const DestinationFieldConfigUncheckedCreateNestedManyWithoutTableConfigInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigUncheckedCreateNestedManyWithoutTableConfigInput> = z.object({
  create: z.union([z.lazy(() => DestinationFieldConfigCreateWithoutTableConfigInputSchema), z.lazy(() => DestinationFieldConfigCreateWithoutTableConfigInputSchema).array(), z.lazy(() => DestinationFieldConfigUncheckedCreateWithoutTableConfigInputSchema), z.lazy(() => DestinationFieldConfigUncheckedCreateWithoutTableConfigInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => DestinationFieldConfigCreateOrConnectWithoutTableConfigInputSchema), z.lazy(() => DestinationFieldConfigCreateOrConnectWithoutTableConfigInputSchema).array()]).optional(),
  createMany: z.lazy(() => DestinationFieldConfigCreateManyTableConfigInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => DestinationFieldConfigWhereUniqueInputSchema), z.lazy(() => DestinationFieldConfigWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const DestinationUpdateOneRequiredWithoutTableConfigsNestedInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpdateOneRequiredWithoutTableConfigsNestedInput> = z.object({
  create: z.union([z.lazy(() => DestinationCreateWithoutTableConfigsInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutTableConfigsInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => DestinationCreateOrConnectWithoutTableConfigsInputSchema).optional(),
  upsert: z.lazy(() => DestinationUpsertWithoutTableConfigsInputSchema).optional(),
  connect: z.lazy(() => DestinationWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => DestinationUpdateWithoutTableConfigsInputSchema), z.lazy(() => DestinationUncheckedUpdateWithoutTableConfigsInputSchema)]).optional(),
}).strict();

export const EnumTableFieldUpdateOperationsInputSchema: z.ZodType<PrismaClient.Prisma.EnumTableFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => TableSchema).optional(),
}).strict();

export const DestinationFieldConfigUpdateManyWithoutTableConfigNestedInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigUpdateManyWithoutTableConfigNestedInput> = z.object({
  create: z.union([z.lazy(() => DestinationFieldConfigCreateWithoutTableConfigInputSchema), z.lazy(() => DestinationFieldConfigCreateWithoutTableConfigInputSchema).array(), z.lazy(() => DestinationFieldConfigUncheckedCreateWithoutTableConfigInputSchema), z.lazy(() => DestinationFieldConfigUncheckedCreateWithoutTableConfigInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => DestinationFieldConfigCreateOrConnectWithoutTableConfigInputSchema), z.lazy(() => DestinationFieldConfigCreateOrConnectWithoutTableConfigInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => DestinationFieldConfigUpsertWithWhereUniqueWithoutTableConfigInputSchema), z.lazy(() => DestinationFieldConfigUpsertWithWhereUniqueWithoutTableConfigInputSchema).array()]).optional(),
  createMany: z.lazy(() => DestinationFieldConfigCreateManyTableConfigInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => DestinationFieldConfigWhereUniqueInputSchema), z.lazy(() => DestinationFieldConfigWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => DestinationFieldConfigWhereUniqueInputSchema), z.lazy(() => DestinationFieldConfigWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => DestinationFieldConfigWhereUniqueInputSchema), z.lazy(() => DestinationFieldConfigWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => DestinationFieldConfigWhereUniqueInputSchema), z.lazy(() => DestinationFieldConfigWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => DestinationFieldConfigUpdateWithWhereUniqueWithoutTableConfigInputSchema), z.lazy(() => DestinationFieldConfigUpdateWithWhereUniqueWithoutTableConfigInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => DestinationFieldConfigUpdateManyWithWhereWithoutTableConfigInputSchema), z.lazy(() => DestinationFieldConfigUpdateManyWithWhereWithoutTableConfigInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => DestinationFieldConfigScalarWhereInputSchema), z.lazy(() => DestinationFieldConfigScalarWhereInputSchema).array()]).optional(),
}).strict();

export const DestinationFieldConfigUncheckedUpdateManyWithoutTableConfigNestedInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigUncheckedUpdateManyWithoutTableConfigNestedInput> = z.object({
  create: z.union([z.lazy(() => DestinationFieldConfigCreateWithoutTableConfigInputSchema), z.lazy(() => DestinationFieldConfigCreateWithoutTableConfigInputSchema).array(), z.lazy(() => DestinationFieldConfigUncheckedCreateWithoutTableConfigInputSchema), z.lazy(() => DestinationFieldConfigUncheckedCreateWithoutTableConfigInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => DestinationFieldConfigCreateOrConnectWithoutTableConfigInputSchema), z.lazy(() => DestinationFieldConfigCreateOrConnectWithoutTableConfigInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => DestinationFieldConfigUpsertWithWhereUniqueWithoutTableConfigInputSchema), z.lazy(() => DestinationFieldConfigUpsertWithWhereUniqueWithoutTableConfigInputSchema).array()]).optional(),
  createMany: z.lazy(() => DestinationFieldConfigCreateManyTableConfigInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => DestinationFieldConfigWhereUniqueInputSchema), z.lazy(() => DestinationFieldConfigWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => DestinationFieldConfigWhereUniqueInputSchema), z.lazy(() => DestinationFieldConfigWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => DestinationFieldConfigWhereUniqueInputSchema), z.lazy(() => DestinationFieldConfigWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => DestinationFieldConfigWhereUniqueInputSchema), z.lazy(() => DestinationFieldConfigWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => DestinationFieldConfigUpdateWithWhereUniqueWithoutTableConfigInputSchema), z.lazy(() => DestinationFieldConfigUpdateWithWhereUniqueWithoutTableConfigInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => DestinationFieldConfigUpdateManyWithWhereWithoutTableConfigInputSchema), z.lazy(() => DestinationFieldConfigUpdateManyWithWhereWithoutTableConfigInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => DestinationFieldConfigScalarWhereInputSchema), z.lazy(() => DestinationFieldConfigScalarWhereInputSchema).array()]).optional(),
}).strict();

export const DestinationTableConfigCreateNestedOneWithoutFieldConfigsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigCreateNestedOneWithoutFieldConfigsInput> = z.object({
  create: z.union([z.lazy(() => DestinationTableConfigCreateWithoutFieldConfigsInputSchema), z.lazy(() => DestinationTableConfigUncheckedCreateWithoutFieldConfigsInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => DestinationTableConfigCreateOrConnectWithoutFieldConfigsInputSchema).optional(),
  connect: z.lazy(() => DestinationTableConfigWhereUniqueInputSchema).optional(),
}).strict();

export const DestinationTableConfigUpdateOneRequiredWithoutFieldConfigsNestedInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigUpdateOneRequiredWithoutFieldConfigsNestedInput> = z.object({
  create: z.union([z.lazy(() => DestinationTableConfigCreateWithoutFieldConfigsInputSchema), z.lazy(() => DestinationTableConfigUncheckedCreateWithoutFieldConfigsInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => DestinationTableConfigCreateOrConnectWithoutFieldConfigsInputSchema).optional(),
  upsert: z.lazy(() => DestinationTableConfigUpsertWithoutFieldConfigsInputSchema).optional(),
  connect: z.lazy(() => DestinationTableConfigWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => DestinationTableConfigUpdateWithoutFieldConfigsInputSchema), z.lazy(() => DestinationTableConfigUncheckedUpdateWithoutFieldConfigsInputSchema)]).optional(),
}).strict();

export const EnumFieldFieldUpdateOperationsInputSchema: z.ZodType<PrismaClient.Prisma.EnumFieldFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => FieldSchema).optional(),
}).strict();

export const DestinationCreateNestedOneWithoutAirtableCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateNestedOneWithoutAirtableCredentialInput> = z.object({
  create: z.union([z.lazy(() => DestinationCreateWithoutAirtableCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutAirtableCredentialInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => DestinationCreateOrConnectWithoutAirtableCredentialInputSchema).optional(),
  connect: z.lazy(() => DestinationWhereUniqueInputSchema).optional(),
}).strict();

export const DestinationUncheckedCreateNestedOneWithoutAirtableCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedCreateNestedOneWithoutAirtableCredentialInput> = z.object({
  create: z.union([z.lazy(() => DestinationCreateWithoutAirtableCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutAirtableCredentialInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => DestinationCreateOrConnectWithoutAirtableCredentialInputSchema).optional(),
  connect: z.lazy(() => DestinationWhereUniqueInputSchema).optional(),
}).strict();

export const DestinationUpdateOneWithoutAirtableCredentialNestedInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpdateOneWithoutAirtableCredentialNestedInput> = z.object({
  create: z.union([z.lazy(() => DestinationCreateWithoutAirtableCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutAirtableCredentialInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => DestinationCreateOrConnectWithoutAirtableCredentialInputSchema).optional(),
  upsert: z.lazy(() => DestinationUpsertWithoutAirtableCredentialInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => DestinationWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => DestinationUpdateWithoutAirtableCredentialInputSchema), z.lazy(() => DestinationUncheckedUpdateWithoutAirtableCredentialInputSchema)]).optional(),
}).strict();

export const DestinationUncheckedUpdateOneWithoutAirtableCredentialNestedInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedUpdateOneWithoutAirtableCredentialNestedInput> = z.object({
  create: z.union([z.lazy(() => DestinationCreateWithoutAirtableCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutAirtableCredentialInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => DestinationCreateOrConnectWithoutAirtableCredentialInputSchema).optional(),
  upsert: z.lazy(() => DestinationUpsertWithoutAirtableCredentialInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => DestinationWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => DestinationUpdateWithoutAirtableCredentialInputSchema), z.lazy(() => DestinationUncheckedUpdateWithoutAirtableCredentialInputSchema)]).optional(),
}).strict();

export const UserCreateNestedOneWithoutAirtableAuthorizationCacheInputSchema: z.ZodType<PrismaClient.Prisma.UserCreateNestedOneWithoutAirtableAuthorizationCacheInput> = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutAirtableAuthorizationCacheInputSchema), z.lazy(() => UserUncheckedCreateWithoutAirtableAuthorizationCacheInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAirtableAuthorizationCacheInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutAirtableAuthorizationCacheNestedInputSchema: z.ZodType<PrismaClient.Prisma.UserUpdateOneRequiredWithoutAirtableAuthorizationCacheNestedInput> = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutAirtableAuthorizationCacheInputSchema), z.lazy(() => UserUncheckedCreateWithoutAirtableAuthorizationCacheInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAirtableAuthorizationCacheInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAirtableAuthorizationCacheInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateWithoutAirtableAuthorizationCacheInputSchema), z.lazy(() => UserUncheckedUpdateWithoutAirtableAuthorizationCacheInputSchema)]).optional(),
}).strict();

export const UserCreateNestedOneWithoutAirtableTokensInputSchema: z.ZodType<PrismaClient.Prisma.UserCreateNestedOneWithoutAirtableTokensInput> = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutAirtableTokensInputSchema), z.lazy(() => UserUncheckedCreateWithoutAirtableTokensInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAirtableTokensInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutAirtableTokensNestedInputSchema: z.ZodType<PrismaClient.Prisma.UserUpdateOneRequiredWithoutAirtableTokensNestedInput> = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutAirtableTokensInputSchema), z.lazy(() => UserUncheckedCreateWithoutAirtableTokensInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAirtableTokensInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAirtableTokensInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateWithoutAirtableTokensInputSchema), z.lazy(() => UserUncheckedUpdateWithoutAirtableTokensInputSchema)]).optional(),
}).strict();

export const DestinationCreateNestedOneWithoutCodaCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateNestedOneWithoutCodaCredentialInput> = z.object({
  create: z.union([z.lazy(() => DestinationCreateWithoutCodaCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutCodaCredentialInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => DestinationCreateOrConnectWithoutCodaCredentialInputSchema).optional(),
  connect: z.lazy(() => DestinationWhereUniqueInputSchema).optional(),
}).strict();

export const DestinationUncheckedCreateNestedOneWithoutCodaCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedCreateNestedOneWithoutCodaCredentialInput> = z.object({
  create: z.union([z.lazy(() => DestinationCreateWithoutCodaCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutCodaCredentialInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => DestinationCreateOrConnectWithoutCodaCredentialInputSchema).optional(),
  connect: z.lazy(() => DestinationWhereUniqueInputSchema).optional(),
}).strict();

export const DestinationUpdateOneWithoutCodaCredentialNestedInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpdateOneWithoutCodaCredentialNestedInput> = z.object({
  create: z.union([z.lazy(() => DestinationCreateWithoutCodaCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutCodaCredentialInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => DestinationCreateOrConnectWithoutCodaCredentialInputSchema).optional(),
  upsert: z.lazy(() => DestinationUpsertWithoutCodaCredentialInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => DestinationWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => DestinationUpdateWithoutCodaCredentialInputSchema), z.lazy(() => DestinationUncheckedUpdateWithoutCodaCredentialInputSchema)]).optional(),
}).strict();

export const DestinationUncheckedUpdateOneWithoutCodaCredentialNestedInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedUpdateOneWithoutCodaCredentialNestedInput> = z.object({
  create: z.union([z.lazy(() => DestinationCreateWithoutCodaCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutCodaCredentialInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => DestinationCreateOrConnectWithoutCodaCredentialInputSchema).optional(),
  upsert: z.lazy(() => DestinationUpsertWithoutCodaCredentialInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => DestinationWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => DestinationUpdateWithoutCodaCredentialInputSchema), z.lazy(() => DestinationUncheckedUpdateWithoutCodaCredentialInputSchema)]).optional(),
}).strict();

export const DestinationCreateNestedOneWithoutGoogleSheetsCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateNestedOneWithoutGoogleSheetsCredentialInput> = z.object({
  create: z.union([z.lazy(() => DestinationCreateWithoutGoogleSheetsCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutGoogleSheetsCredentialInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => DestinationCreateOrConnectWithoutGoogleSheetsCredentialInputSchema).optional(),
  connect: z.lazy(() => DestinationWhereUniqueInputSchema).optional(),
}).strict();

export const DestinationUncheckedCreateNestedOneWithoutGoogleSheetsCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedCreateNestedOneWithoutGoogleSheetsCredentialInput> = z.object({
  create: z.union([z.lazy(() => DestinationCreateWithoutGoogleSheetsCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutGoogleSheetsCredentialInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => DestinationCreateOrConnectWithoutGoogleSheetsCredentialInputSchema).optional(),
  connect: z.lazy(() => DestinationWhereUniqueInputSchema).optional(),
}).strict();

export const DestinationUpdateOneWithoutGoogleSheetsCredentialNestedInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpdateOneWithoutGoogleSheetsCredentialNestedInput> = z.object({
  create: z.union([z.lazy(() => DestinationCreateWithoutGoogleSheetsCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutGoogleSheetsCredentialInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => DestinationCreateOrConnectWithoutGoogleSheetsCredentialInputSchema).optional(),
  upsert: z.lazy(() => DestinationUpsertWithoutGoogleSheetsCredentialInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => DestinationWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => DestinationUpdateWithoutGoogleSheetsCredentialInputSchema), z.lazy(() => DestinationUncheckedUpdateWithoutGoogleSheetsCredentialInputSchema)]).optional(),
}).strict();

export const DestinationUncheckedUpdateOneWithoutGoogleSheetsCredentialNestedInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedUpdateOneWithoutGoogleSheetsCredentialNestedInput> = z.object({
  create: z.union([z.lazy(() => DestinationCreateWithoutGoogleSheetsCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutGoogleSheetsCredentialInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => DestinationCreateOrConnectWithoutGoogleSheetsCredentialInputSchema).optional(),
  upsert: z.lazy(() => DestinationUpsertWithoutGoogleSheetsCredentialInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => DestinationWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => DestinationUpdateWithoutGoogleSheetsCredentialInputSchema), z.lazy(() => DestinationUncheckedUpdateWithoutGoogleSheetsCredentialInputSchema)]).optional(),
}).strict();

export const DestinationCreateNestedManyWithoutNotionCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateNestedManyWithoutNotionCredentialInput> = z.object({
  create: z.union([z.lazy(() => DestinationCreateWithoutNotionCredentialInputSchema), z.lazy(() => DestinationCreateWithoutNotionCredentialInputSchema).array(), z.lazy(() => DestinationUncheckedCreateWithoutNotionCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutNotionCredentialInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => DestinationCreateOrConnectWithoutNotionCredentialInputSchema), z.lazy(() => DestinationCreateOrConnectWithoutNotionCredentialInputSchema).array()]).optional(),
  createMany: z.lazy(() => DestinationCreateManyNotionCredentialInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => DestinationWhereUniqueInputSchema), z.lazy(() => DestinationWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const DestinationUncheckedCreateNestedManyWithoutNotionCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedCreateNestedManyWithoutNotionCredentialInput> = z.object({
  create: z.union([z.lazy(() => DestinationCreateWithoutNotionCredentialInputSchema), z.lazy(() => DestinationCreateWithoutNotionCredentialInputSchema).array(), z.lazy(() => DestinationUncheckedCreateWithoutNotionCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutNotionCredentialInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => DestinationCreateOrConnectWithoutNotionCredentialInputSchema), z.lazy(() => DestinationCreateOrConnectWithoutNotionCredentialInputSchema).array()]).optional(),
  createMany: z.lazy(() => DestinationCreateManyNotionCredentialInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => DestinationWhereUniqueInputSchema), z.lazy(() => DestinationWhereUniqueInputSchema).array()]).optional(),
}).strict();

export const DestinationUpdateManyWithoutNotionCredentialNestedInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpdateManyWithoutNotionCredentialNestedInput> = z.object({
  create: z.union([z.lazy(() => DestinationCreateWithoutNotionCredentialInputSchema), z.lazy(() => DestinationCreateWithoutNotionCredentialInputSchema).array(), z.lazy(() => DestinationUncheckedCreateWithoutNotionCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutNotionCredentialInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => DestinationCreateOrConnectWithoutNotionCredentialInputSchema), z.lazy(() => DestinationCreateOrConnectWithoutNotionCredentialInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => DestinationUpsertWithWhereUniqueWithoutNotionCredentialInputSchema), z.lazy(() => DestinationUpsertWithWhereUniqueWithoutNotionCredentialInputSchema).array()]).optional(),
  createMany: z.lazy(() => DestinationCreateManyNotionCredentialInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => DestinationWhereUniqueInputSchema), z.lazy(() => DestinationWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => DestinationWhereUniqueInputSchema), z.lazy(() => DestinationWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => DestinationWhereUniqueInputSchema), z.lazy(() => DestinationWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => DestinationWhereUniqueInputSchema), z.lazy(() => DestinationWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => DestinationUpdateWithWhereUniqueWithoutNotionCredentialInputSchema), z.lazy(() => DestinationUpdateWithWhereUniqueWithoutNotionCredentialInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => DestinationUpdateManyWithWhereWithoutNotionCredentialInputSchema), z.lazy(() => DestinationUpdateManyWithWhereWithoutNotionCredentialInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => DestinationScalarWhereInputSchema), z.lazy(() => DestinationScalarWhereInputSchema).array()]).optional(),
}).strict();

export const DestinationUncheckedUpdateManyWithoutNotionCredentialNestedInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedUpdateManyWithoutNotionCredentialNestedInput> = z.object({
  create: z.union([z.lazy(() => DestinationCreateWithoutNotionCredentialInputSchema), z.lazy(() => DestinationCreateWithoutNotionCredentialInputSchema).array(), z.lazy(() => DestinationUncheckedCreateWithoutNotionCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutNotionCredentialInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => DestinationCreateOrConnectWithoutNotionCredentialInputSchema), z.lazy(() => DestinationCreateOrConnectWithoutNotionCredentialInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => DestinationUpsertWithWhereUniqueWithoutNotionCredentialInputSchema), z.lazy(() => DestinationUpsertWithWhereUniqueWithoutNotionCredentialInputSchema).array()]).optional(),
  createMany: z.lazy(() => DestinationCreateManyNotionCredentialInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => DestinationWhereUniqueInputSchema), z.lazy(() => DestinationWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => DestinationWhereUniqueInputSchema), z.lazy(() => DestinationWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => DestinationWhereUniqueInputSchema), z.lazy(() => DestinationWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => DestinationWhereUniqueInputSchema), z.lazy(() => DestinationWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => DestinationUpdateWithWhereUniqueWithoutNotionCredentialInputSchema), z.lazy(() => DestinationUpdateWithWhereUniqueWithoutNotionCredentialInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => DestinationUpdateManyWithWhereWithoutNotionCredentialInputSchema), z.lazy(() => DestinationUpdateManyWithWhereWithoutNotionCredentialInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => DestinationScalarWhereInputSchema), z.lazy(() => DestinationScalarWhereInputSchema).array()]).optional(),
}).strict();

export const NullableEnumSyncErrorFieldUpdateOperationsInputSchema: z.ZodType<PrismaClient.Prisma.NullableEnumSyncErrorFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => SyncErrorSchema).optional().nullable(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<PrismaClient.Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([z.string(), z.lazy(() => NestedStringFilterSchema)]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<PrismaClient.Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([z.string(), z.lazy(() => NestedStringNullableFilterSchema)]).optional().nullable(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<PrismaClient.Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.date().optional().nullable(),
  in: z.date().array().optional().nullable(),
  notIn: z.date().array().optional().nullable(),
  lt: z.date().optional(),
  lte: z.date().optional(),
  gt: z.date().optional(),
  gte: z.date().optional(),
  not: z.union([z.date(), z.lazy(() => NestedDateTimeNullableFilterSchema)]).optional().nullable(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<PrismaClient.Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([z.string(), z.lazy(() => NestedStringWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
}).strict();

export const NestedIntFilterSchema: z.ZodType<PrismaClient.Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([z.number(), z.lazy(() => NestedIntFilterSchema)]).optional(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<PrismaClient.Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([z.string(), z.lazy(() => NestedStringNullableWithAggregatesFilterSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<PrismaClient.Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([z.number(), z.lazy(() => NestedIntNullableFilterSchema)]).optional().nullable(),
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<PrismaClient.Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.date().optional().nullable(),
  in: z.date().array().optional().nullable(),
  notIn: z.date().array().optional().nullable(),
  lt: z.date().optional(),
  lte: z.date().optional(),
  gt: z.date().optional(),
  gte: z.date().optional(),
  not: z.union([z.date(), z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<PrismaClient.Prisma.NestedDateTimeFilter> = z.object({
  equals: z.date().optional(),
  in: z.date().array().optional(),
  notIn: z.date().array().optional(),
  lt: z.date().optional(),
  lte: z.date().optional(),
  gt: z.date().optional(),
  gte: z.date().optional(),
  not: z.union([z.date(), z.lazy(() => NestedDateTimeFilterSchema)]).optional(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<PrismaClient.Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.date().optional(),
  in: z.date().array().optional(),
  notIn: z.date().array().optional(),
  lt: z.date().optional(),
  lte: z.date().optional(),
  gt: z.date().optional(),
  gte: z.date().optional(),
  not: z.union([z.date(), z.lazy(() => NestedDateTimeWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
}).strict();

export const NestedBoolFilterSchema: z.ZodType<PrismaClient.Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([z.boolean(), z.lazy(() => NestedBoolFilterSchema)]).optional(),
}).strict();

export const NestedEnumFrequencyFilterSchema: z.ZodType<PrismaClient.Prisma.NestedEnumFrequencyFilter> = z.object({
  equals: z.lazy(() => FrequencySchema).optional(),
  in: z.lazy(() => FrequencySchema).array().optional(),
  notIn: z.lazy(() => FrequencySchema).array().optional(),
  not: z.union([z.lazy(() => FrequencySchema), z.lazy(() => NestedEnumFrequencyFilterSchema)]).optional(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<PrismaClient.Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([z.boolean(), z.lazy(() => NestedBoolWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
}).strict();

export const NestedEnumFrequencyWithAggregatesFilterSchema: z.ZodType<PrismaClient.Prisma.NestedEnumFrequencyWithAggregatesFilter> = z.object({
  equals: z.lazy(() => FrequencySchema).optional(),
  in: z.lazy(() => FrequencySchema).array().optional(),
  notIn: z.lazy(() => FrequencySchema).array().optional(),
  not: z.union([z.lazy(() => FrequencySchema), z.lazy(() => NestedEnumFrequencyWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumFrequencyFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumFrequencyFilterSchema).optional(),
}).strict();

export const NestedJsonFilterSchema: z.ZodType<PrismaClient.Prisma.NestedJsonFilter> = z.object({
  equals: z.union([InputJsonValue, z.lazy(() => JsonNullValueFilterSchema)]).optional(),
  path: z.string().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValue.optional().nullable(),
  array_starts_with: InputJsonValue.optional().nullable(),
  array_ends_with: InputJsonValue.optional().nullable(),
  lt: InputJsonValue.optional(),
  lte: InputJsonValue.optional(),
  gt: InputJsonValue.optional(),
  gte: InputJsonValue.optional(),
  not: z.union([InputJsonValue, z.lazy(() => JsonNullValueFilterSchema)]).optional(),
}).strict();

export const NestedEnumIntegrationFilterSchema: z.ZodType<PrismaClient.Prisma.NestedEnumIntegrationFilter> = z.object({
  equals: z.lazy(() => IntegrationSchema).optional(),
  in: z.lazy(() => IntegrationSchema).array().optional(),
  notIn: z.lazy(() => IntegrationSchema).array().optional(),
  not: z.union([z.lazy(() => IntegrationSchema), z.lazy(() => NestedEnumIntegrationFilterSchema)]).optional(),
}).strict();

export const NestedEnumIntegrationWithAggregatesFilterSchema: z.ZodType<PrismaClient.Prisma.NestedEnumIntegrationWithAggregatesFilter> = z.object({
  equals: z.lazy(() => IntegrationSchema).optional(),
  in: z.lazy(() => IntegrationSchema).array().optional(),
  notIn: z.lazy(() => IntegrationSchema).array().optional(),
  not: z.union([z.lazy(() => IntegrationSchema), z.lazy(() => NestedEnumIntegrationWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumIntegrationFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumIntegrationFilterSchema).optional(),
}).strict();

export const NestedEnumTableFilterSchema: z.ZodType<PrismaClient.Prisma.NestedEnumTableFilter> = z.object({
  equals: z.lazy(() => TableSchema).optional(),
  in: z.lazy(() => TableSchema).array().optional(),
  notIn: z.lazy(() => TableSchema).array().optional(),
  not: z.union([z.lazy(() => TableSchema), z.lazy(() => NestedEnumTableFilterSchema)]).optional(),
}).strict();

export const NestedEnumTableWithAggregatesFilterSchema: z.ZodType<PrismaClient.Prisma.NestedEnumTableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TableSchema).optional(),
  in: z.lazy(() => TableSchema).array().optional(),
  notIn: z.lazy(() => TableSchema).array().optional(),
  not: z.union([z.lazy(() => TableSchema), z.lazy(() => NestedEnumTableWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTableFilterSchema).optional(),
}).strict();

export const NestedEnumFieldFilterSchema: z.ZodType<PrismaClient.Prisma.NestedEnumFieldFilter> = z.object({
  equals: z.lazy(() => FieldSchema).optional(),
  in: z.lazy(() => FieldSchema).array().optional(),
  notIn: z.lazy(() => FieldSchema).array().optional(),
  not: z.union([z.lazy(() => FieldSchema), z.lazy(() => NestedEnumFieldFilterSchema)]).optional(),
}).strict();

export const NestedEnumFieldWithAggregatesFilterSchema: z.ZodType<PrismaClient.Prisma.NestedEnumFieldWithAggregatesFilter> = z.object({
  equals: z.lazy(() => FieldSchema).optional(),
  in: z.lazy(() => FieldSchema).array().optional(),
  notIn: z.lazy(() => FieldSchema).array().optional(),
  not: z.union([z.lazy(() => FieldSchema), z.lazy(() => NestedEnumFieldWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumFieldFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumFieldFilterSchema).optional(),
}).strict();

export const NestedEnumSyncErrorNullableFilterSchema: z.ZodType<PrismaClient.Prisma.NestedEnumSyncErrorNullableFilter> = z.object({
  equals: z.lazy(() => SyncErrorSchema).optional().nullable(),
  in: z.lazy(() => SyncErrorSchema).array().optional().nullable(),
  notIn: z.lazy(() => SyncErrorSchema).array().optional().nullable(),
  not: z.union([z.lazy(() => SyncErrorSchema), z.lazy(() => NestedEnumSyncErrorNullableFilterSchema)]).optional().nullable(),
}).strict();

export const NestedEnumSyncErrorNullableWithAggregatesFilterSchema: z.ZodType<PrismaClient.Prisma.NestedEnumSyncErrorNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => SyncErrorSchema).optional().nullable(),
  in: z.lazy(() => SyncErrorSchema).array().optional().nullable(),
  notIn: z.lazy(() => SyncErrorSchema).array().optional().nullable(),
  not: z.union([z.lazy(() => SyncErrorSchema), z.lazy(() => NestedEnumSyncErrorNullableWithAggregatesFilterSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumSyncErrorNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumSyncErrorNullableFilterSchema).optional(),
}).strict();

export const UserCreateWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.UserCreateWithoutAccountsInput> = z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  image: z.string().optional().nullable(),
  disabledAt: z.date().optional().nullable(),
  timezone: z.string().optional(),
  stripeCustomerId: z.string(),
  isSubsribedGeneral: z.boolean().optional(),
  isSubscribedPeriodicUpdates: z.boolean().optional(),
  periodicUpdatesFrequency: z.lazy(() => FrequencySchema).optional(),
  periodicUpdatesJobId: z.string().optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemCreateNestedManyWithoutUserInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenCreateNestedManyWithoutUserInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheCreateNestedOneWithoutUserInputSchema).optional(),
}).strict();

export const UserUncheckedCreateWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.UserUncheckedCreateWithoutAccountsInput> = z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  image: z.string().optional().nullable(),
  disabledAt: z.date().optional().nullable(),
  timezone: z.string().optional(),
  stripeCustomerId: z.string(),
  isSubsribedGeneral: z.boolean().optional(),
  isSubscribedPeriodicUpdates: z.boolean().optional(),
  periodicUpdatesFrequency: z.lazy(() => FrequencySchema).optional(),
  periodicUpdatesJobId: z.string().optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
}).strict();

export const UserCreateOrConnectWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.UserCreateOrConnectWithoutAccountsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([z.lazy(() => UserCreateWithoutAccountsInputSchema), z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema)]),
}).strict();

export const UserUpsertWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.UserUpsertWithoutAccountsInput> = z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutAccountsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutAccountsInputSchema), z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema)]),
}).strict();

export const UserUpdateWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.UserUpdateWithoutAccountsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  emailVerified: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  image: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  timezone: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  stripeCustomerId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isSubsribedGeneral: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isSubscribedPeriodicUpdates: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesFrequency: z.union([z.lazy(() => FrequencySchema), z.lazy(() => EnumFrequencyFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesJobId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheUpdateOneWithoutUserNestedInputSchema).optional(),
}).strict();

export const UserUncheckedUpdateWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.UserUncheckedUpdateWithoutAccountsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  emailVerified: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  image: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  timezone: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  stripeCustomerId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isSubsribedGeneral: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isSubscribedPeriodicUpdates: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesFrequency: z.union([z.lazy(() => FrequencySchema), z.lazy(() => EnumFrequencyFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesJobId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
}).strict();

export const UserCreateWithoutSessionsInputSchema: z.ZodType<PrismaClient.Prisma.UserCreateWithoutSessionsInput> = z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  image: z.string().optional().nullable(),
  disabledAt: z.date().optional().nullable(),
  timezone: z.string().optional(),
  stripeCustomerId: z.string(),
  isSubsribedGeneral: z.boolean().optional(),
  isSubscribedPeriodicUpdates: z.boolean().optional(),
  periodicUpdatesFrequency: z.lazy(() => FrequencySchema).optional(),
  periodicUpdatesJobId: z.string().optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenCreateNestedManyWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemCreateNestedManyWithoutUserInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenCreateNestedManyWithoutUserInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheCreateNestedOneWithoutUserInputSchema).optional(),
}).strict();

export const UserUncheckedCreateWithoutSessionsInputSchema: z.ZodType<PrismaClient.Prisma.UserUncheckedCreateWithoutSessionsInput> = z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  image: z.string().optional().nullable(),
  disabledAt: z.date().optional().nullable(),
  timezone: z.string().optional(),
  stripeCustomerId: z.string(),
  isSubsribedGeneral: z.boolean().optional(),
  isSubscribedPeriodicUpdates: z.boolean().optional(),
  periodicUpdatesFrequency: z.lazy(() => FrequencySchema).optional(),
  periodicUpdatesJobId: z.string().optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
}).strict();

export const UserCreateOrConnectWithoutSessionsInputSchema: z.ZodType<PrismaClient.Prisma.UserCreateOrConnectWithoutSessionsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([z.lazy(() => UserCreateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema)]),
}).strict();

export const UserUpsertWithoutSessionsInputSchema: z.ZodType<PrismaClient.Prisma.UserUpsertWithoutSessionsInput> = z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema)]),
}).strict();

export const UserUpdateWithoutSessionsInputSchema: z.ZodType<PrismaClient.Prisma.UserUpdateWithoutSessionsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  emailVerified: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  image: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  timezone: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  stripeCustomerId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isSubsribedGeneral: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isSubscribedPeriodicUpdates: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesFrequency: z.union([z.lazy(() => FrequencySchema), z.lazy(() => EnumFrequencyFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesJobId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheUpdateOneWithoutUserNestedInputSchema).optional(),
}).strict();

export const UserUncheckedUpdateWithoutSessionsInputSchema: z.ZodType<PrismaClient.Prisma.UserUncheckedUpdateWithoutSessionsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  emailVerified: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  image: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  timezone: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  stripeCustomerId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isSubsribedGeneral: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isSubscribedPeriodicUpdates: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesFrequency: z.union([z.lazy(() => FrequencySchema), z.lazy(() => EnumFrequencyFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesJobId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
}).strict();

export const LinkTokenCreateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  token: z.string(),
}).strict();

export const LinkTokenUncheckedCreateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  token: z.string(),
}).strict();

export const LinkTokenCreateOrConnectWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => LinkTokenWhereUniqueInputSchema),
  create: z.union([z.lazy(() => LinkTokenCreateWithoutUserInputSchema), z.lazy(() => LinkTokenUncheckedCreateWithoutUserInputSchema)]),
}).strict();

export const LinkTokenCreateManyUserInputEnvelopeSchema: z.ZodType<PrismaClient.Prisma.LinkTokenCreateManyUserInputEnvelope> = z.object({
  data: z.lazy(() => LinkTokenCreateManyUserInputSchema).array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const AccountCreateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AccountCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.date().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
}).strict();

export const AccountUncheckedCreateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AccountUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.date().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
}).strict();

export const AccountCreateOrConnectWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AccountCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  create: z.union([z.lazy(() => AccountCreateWithoutUserInputSchema), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema)]),
}).strict();

export const AccountCreateManyUserInputEnvelopeSchema: z.ZodType<PrismaClient.Prisma.AccountCreateManyUserInputEnvelope> = z.object({
  data: z.lazy(() => AccountCreateManyUserInputSchema).array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const SessionCreateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.SessionCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  sessionToken: z.string(),
  expires: z.date(),
}).strict();

export const SessionUncheckedCreateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.SessionUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  sessionToken: z.string(),
  expires: z.date(),
}).strict();

export const SessionCreateOrConnectWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.SessionCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  create: z.union([z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema)]),
}).strict();

export const SessionCreateManyUserInputEnvelopeSchema: z.ZodType<PrismaClient.Prisma.SessionCreateManyUserInputEnvelope> = z.object({
  data: z.lazy(() => SessionCreateManyUserInputSchema).array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const PlaidItemCreateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemCreateWithoutUserInput> = z.object({
  id: z.string(),
  isInitialUpdateComplete: z.boolean().optional(),
  isHistoricalUpdateComplete: z.boolean().optional(),
  error: z.string().optional().nullable(),
  accessToken: z.string(),
  plaidSyncCursor: z.string().optional().nullable(),
  availableProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  billedProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  lastSyncedAt: z.date().optional().nullable(),
  consentExpiresAt: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
  institution: z.lazy(() => PlaidInstitutionCreateNestedOneWithoutItemsInputSchema),
  accounts: z.lazy(() => PlaidAccountCreateNestedManyWithoutItemInputSchema).optional(),
}).strict();

export const PlaidItemUncheckedCreateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUncheckedCreateWithoutUserInput> = z.object({
  id: z.string(),
  institutionId: z.string(),
  isInitialUpdateComplete: z.boolean().optional(),
  isHistoricalUpdateComplete: z.boolean().optional(),
  error: z.string().optional().nullable(),
  accessToken: z.string(),
  plaidSyncCursor: z.string().optional().nullable(),
  availableProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  billedProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  lastSyncedAt: z.date().optional().nullable(),
  consentExpiresAt: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUncheckedCreateNestedManyWithoutItemInputSchema).optional(),
}).strict();

export const PlaidItemCreateOrConnectWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => PlaidItemWhereUniqueInputSchema),
  create: z.union([z.lazy(() => PlaidItemCreateWithoutUserInputSchema), z.lazy(() => PlaidItemUncheckedCreateWithoutUserInputSchema)]),
}).strict();

export const PlaidItemCreateManyUserInputEnvelopeSchema: z.ZodType<PrismaClient.Prisma.PlaidItemCreateManyUserInputEnvelope> = z.object({
  data: z.lazy(() => PlaidItemCreateManyUserInputSchema).array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const AirtableTokenCreateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  accessToken: z.string(),
  refreshToken: z.string(),
  tokenType: z.string(),
  scope: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  refreshedAt: z.date().optional(),
  accessTokenExpiresAt: z.date(),
  refreshTokenExpiresAt: z.date(),
}).strict();

export const AirtableTokenUncheckedCreateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  accessToken: z.string(),
  refreshToken: z.string(),
  tokenType: z.string(),
  scope: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  refreshedAt: z.date().optional(),
  accessTokenExpiresAt: z.date(),
  refreshTokenExpiresAt: z.date(),
}).strict();

export const AirtableTokenCreateOrConnectWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => AirtableTokenWhereUniqueInputSchema),
  create: z.union([z.lazy(() => AirtableTokenCreateWithoutUserInputSchema), z.lazy(() => AirtableTokenUncheckedCreateWithoutUserInputSchema)]),
}).strict();

export const AirtableTokenCreateManyUserInputEnvelopeSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenCreateManyUserInputEnvelope> = z.object({
  data: z.lazy(() => AirtableTokenCreateManyUserInputSchema).array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const AirtableAuthorizationCacheCreateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  state: z.string(),
  codeVerifier: z.string(),
}).strict();

export const AirtableAuthorizationCacheUncheckedCreateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  state: z.string(),
  codeVerifier: z.string(),
}).strict();

export const AirtableAuthorizationCacheCreateOrConnectWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => AirtableAuthorizationCacheWhereUniqueInputSchema),
  create: z.union([z.lazy(() => AirtableAuthorizationCacheCreateWithoutUserInputSchema), z.lazy(() => AirtableAuthorizationCacheUncheckedCreateWithoutUserInputSchema)]),
}).strict();

export const LinkTokenUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => LinkTokenWhereUniqueInputSchema),
  update: z.union([z.lazy(() => LinkTokenUpdateWithoutUserInputSchema), z.lazy(() => LinkTokenUncheckedUpdateWithoutUserInputSchema)]),
  create: z.union([z.lazy(() => LinkTokenCreateWithoutUserInputSchema), z.lazy(() => LinkTokenUncheckedCreateWithoutUserInputSchema)]),
}).strict();

export const LinkTokenUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => LinkTokenWhereUniqueInputSchema),
  data: z.union([z.lazy(() => LinkTokenUpdateWithoutUserInputSchema), z.lazy(() => LinkTokenUncheckedUpdateWithoutUserInputSchema)]),
}).strict();

export const LinkTokenUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => LinkTokenScalarWhereInputSchema),
  data: z.union([z.lazy(() => LinkTokenUpdateManyMutationInputSchema), z.lazy(() => LinkTokenUncheckedUpdateManyWithoutLinkTokensInputSchema)]),
}).strict();

export const LinkTokenScalarWhereInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => LinkTokenScalarWhereInputSchema), z.lazy(() => LinkTokenScalarWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => LinkTokenScalarWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => LinkTokenScalarWhereInputSchema), z.lazy(() => LinkTokenScalarWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  token: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
}).strict();

export const AccountUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AccountUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  update: z.union([z.lazy(() => AccountUpdateWithoutUserInputSchema), z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema)]),
  create: z.union([z.lazy(() => AccountCreateWithoutUserInputSchema), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema)]),
}).strict();

export const AccountUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AccountUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  data: z.union([z.lazy(() => AccountUpdateWithoutUserInputSchema), z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema)]),
}).strict();

export const AccountUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AccountUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => AccountScalarWhereInputSchema),
  data: z.union([z.lazy(() => AccountUpdateManyMutationInputSchema), z.lazy(() => AccountUncheckedUpdateManyWithoutAccountsInputSchema)]),
}).strict();

export const AccountScalarWhereInputSchema: z.ZodType<PrismaClient.Prisma.AccountScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => AccountScalarWhereInputSchema), z.lazy(() => AccountScalarWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => AccountScalarWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => AccountScalarWhereInputSchema), z.lazy(() => AccountScalarWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  provider: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  providerAccountId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  refresh_token: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  access_token: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  expires_at: z.union([z.lazy(() => DateTimeNullableFilterSchema), z.date()]).optional().nullable(),
  token_type: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  scope: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  id_token: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  session_state: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
}).strict();

export const SessionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.SessionUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  update: z.union([z.lazy(() => SessionUpdateWithoutUserInputSchema), z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema)]),
  create: z.union([z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema)]),
}).strict();

export const SessionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.SessionUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  data: z.union([z.lazy(() => SessionUpdateWithoutUserInputSchema), z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema)]),
}).strict();

export const SessionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.SessionUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => SessionScalarWhereInputSchema),
  data: z.union([z.lazy(() => SessionUpdateManyMutationInputSchema), z.lazy(() => SessionUncheckedUpdateManyWithoutSessionsInputSchema)]),
}).strict();

export const SessionScalarWhereInputSchema: z.ZodType<PrismaClient.Prisma.SessionScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => SessionScalarWhereInputSchema), z.lazy(() => SessionScalarWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => SessionScalarWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => SessionScalarWhereInputSchema), z.lazy(() => SessionScalarWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  sessionToken: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  expires: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
}).strict();

export const PlaidItemUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => PlaidItemWhereUniqueInputSchema),
  update: z.union([z.lazy(() => PlaidItemUpdateWithoutUserInputSchema), z.lazy(() => PlaidItemUncheckedUpdateWithoutUserInputSchema)]),
  create: z.union([z.lazy(() => PlaidItemCreateWithoutUserInputSchema), z.lazy(() => PlaidItemUncheckedCreateWithoutUserInputSchema)]),
}).strict();

export const PlaidItemUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => PlaidItemWhereUniqueInputSchema),
  data: z.union([z.lazy(() => PlaidItemUpdateWithoutUserInputSchema), z.lazy(() => PlaidItemUncheckedUpdateWithoutUserInputSchema)]),
}).strict();

export const PlaidItemUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => PlaidItemScalarWhereInputSchema),
  data: z.union([z.lazy(() => PlaidItemUpdateManyMutationInputSchema), z.lazy(() => PlaidItemUncheckedUpdateManyWithoutPlaidItemsInputSchema)]),
}).strict();

export const PlaidItemScalarWhereInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => PlaidItemScalarWhereInputSchema), z.lazy(() => PlaidItemScalarWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => PlaidItemScalarWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => PlaidItemScalarWhereInputSchema), z.lazy(() => PlaidItemScalarWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  institutionId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  isInitialUpdateComplete: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
  isHistoricalUpdateComplete: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
  error: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  accessToken: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  plaidSyncCursor: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  availableProducts: z.lazy(() => JsonFilterSchema).optional(),
  billedProducts: z.lazy(() => JsonFilterSchema).optional(),
  lastSyncedAt: z.union([z.lazy(() => DateTimeNullableFilterSchema), z.date()]).optional().nullable(),
  consentExpiresAt: z.union([z.lazy(() => DateTimeNullableFilterSchema), z.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  disabledAt: z.union([z.lazy(() => DateTimeNullableFilterSchema), z.date()]).optional().nullable(),
}).strict();

export const AirtableTokenUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AirtableTokenWhereUniqueInputSchema),
  update: z.union([z.lazy(() => AirtableTokenUpdateWithoutUserInputSchema), z.lazy(() => AirtableTokenUncheckedUpdateWithoutUserInputSchema)]),
  create: z.union([z.lazy(() => AirtableTokenCreateWithoutUserInputSchema), z.lazy(() => AirtableTokenUncheckedCreateWithoutUserInputSchema)]),
}).strict();

export const AirtableTokenUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AirtableTokenWhereUniqueInputSchema),
  data: z.union([z.lazy(() => AirtableTokenUpdateWithoutUserInputSchema), z.lazy(() => AirtableTokenUncheckedUpdateWithoutUserInputSchema)]),
}).strict();

export const AirtableTokenUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => AirtableTokenScalarWhereInputSchema),
  data: z.union([z.lazy(() => AirtableTokenUpdateManyMutationInputSchema), z.lazy(() => AirtableTokenUncheckedUpdateManyWithoutAirtableTokensInputSchema)]),
}).strict();

export const AirtableTokenScalarWhereInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => AirtableTokenScalarWhereInputSchema), z.lazy(() => AirtableTokenScalarWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => AirtableTokenScalarWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => AirtableTokenScalarWhereInputSchema), z.lazy(() => AirtableTokenScalarWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  accessToken: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  refreshToken: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  tokenType: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  scope: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  refreshedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  accessTokenExpiresAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  refreshTokenExpiresAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
}).strict();

export const AirtableAuthorizationCacheUpsertWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheUpsertWithoutUserInput> = z.object({
  update: z.union([z.lazy(() => AirtableAuthorizationCacheUpdateWithoutUserInputSchema), z.lazy(() => AirtableAuthorizationCacheUncheckedUpdateWithoutUserInputSchema)]),
  create: z.union([z.lazy(() => AirtableAuthorizationCacheCreateWithoutUserInputSchema), z.lazy(() => AirtableAuthorizationCacheUncheckedCreateWithoutUserInputSchema)]),
}).strict();

export const AirtableAuthorizationCacheUpdateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheUpdateWithoutUserInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  state: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  codeVerifier: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const AirtableAuthorizationCacheUncheckedUpdateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  state: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  codeVerifier: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const PlaidItemCreateWithoutInstitutionInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemCreateWithoutInstitutionInput> = z.object({
  id: z.string(),
  isInitialUpdateComplete: z.boolean().optional(),
  isHistoricalUpdateComplete: z.boolean().optional(),
  error: z.string().optional().nullable(),
  accessToken: z.string(),
  plaidSyncCursor: z.string().optional().nullable(),
  availableProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  billedProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  lastSyncedAt: z.date().optional().nullable(),
  consentExpiresAt: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutPlaidItemsInputSchema),
  accounts: z.lazy(() => PlaidAccountCreateNestedManyWithoutItemInputSchema).optional(),
}).strict();

export const PlaidItemUncheckedCreateWithoutInstitutionInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUncheckedCreateWithoutInstitutionInput> = z.object({
  id: z.string(),
  userId: z.string(),
  isInitialUpdateComplete: z.boolean().optional(),
  isHistoricalUpdateComplete: z.boolean().optional(),
  error: z.string().optional().nullable(),
  accessToken: z.string(),
  plaidSyncCursor: z.string().optional().nullable(),
  availableProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  billedProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  lastSyncedAt: z.date().optional().nullable(),
  consentExpiresAt: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUncheckedCreateNestedManyWithoutItemInputSchema).optional(),
}).strict();

export const PlaidItemCreateOrConnectWithoutInstitutionInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemCreateOrConnectWithoutInstitutionInput> = z.object({
  where: z.lazy(() => PlaidItemWhereUniqueInputSchema),
  create: z.union([z.lazy(() => PlaidItemCreateWithoutInstitutionInputSchema), z.lazy(() => PlaidItemUncheckedCreateWithoutInstitutionInputSchema)]),
}).strict();

export const PlaidItemCreateManyInstitutionInputEnvelopeSchema: z.ZodType<PrismaClient.Prisma.PlaidItemCreateManyInstitutionInputEnvelope> = z.object({
  data: z.lazy(() => PlaidItemCreateManyInstitutionInputSchema).array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const PlaidItemUpsertWithWhereUniqueWithoutInstitutionInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUpsertWithWhereUniqueWithoutInstitutionInput> = z.object({
  where: z.lazy(() => PlaidItemWhereUniqueInputSchema),
  update: z.union([z.lazy(() => PlaidItemUpdateWithoutInstitutionInputSchema), z.lazy(() => PlaidItemUncheckedUpdateWithoutInstitutionInputSchema)]),
  create: z.union([z.lazy(() => PlaidItemCreateWithoutInstitutionInputSchema), z.lazy(() => PlaidItemUncheckedCreateWithoutInstitutionInputSchema)]),
}).strict();

export const PlaidItemUpdateWithWhereUniqueWithoutInstitutionInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUpdateWithWhereUniqueWithoutInstitutionInput> = z.object({
  where: z.lazy(() => PlaidItemWhereUniqueInputSchema),
  data: z.union([z.lazy(() => PlaidItemUpdateWithoutInstitutionInputSchema), z.lazy(() => PlaidItemUncheckedUpdateWithoutInstitutionInputSchema)]),
}).strict();

export const PlaidItemUpdateManyWithWhereWithoutInstitutionInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUpdateManyWithWhereWithoutInstitutionInput> = z.object({
  where: z.lazy(() => PlaidItemScalarWhereInputSchema),
  data: z.union([z.lazy(() => PlaidItemUpdateManyMutationInputSchema), z.lazy(() => PlaidItemUncheckedUpdateManyWithoutItemsInputSchema)]),
}).strict();

export const UserCreateWithoutPlaidItemsInputSchema: z.ZodType<PrismaClient.Prisma.UserCreateWithoutPlaidItemsInput> = z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  image: z.string().optional().nullable(),
  disabledAt: z.date().optional().nullable(),
  timezone: z.string().optional(),
  stripeCustomerId: z.string(),
  isSubsribedGeneral: z.boolean().optional(),
  isSubscribedPeriodicUpdates: z.boolean().optional(),
  periodicUpdatesFrequency: z.lazy(() => FrequencySchema).optional(),
  periodicUpdatesJobId: z.string().optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenCreateNestedManyWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenCreateNestedManyWithoutUserInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheCreateNestedOneWithoutUserInputSchema).optional(),
}).strict();

export const UserUncheckedCreateWithoutPlaidItemsInputSchema: z.ZodType<PrismaClient.Prisma.UserUncheckedCreateWithoutPlaidItemsInput> = z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  image: z.string().optional().nullable(),
  disabledAt: z.date().optional().nullable(),
  timezone: z.string().optional(),
  stripeCustomerId: z.string(),
  isSubsribedGeneral: z.boolean().optional(),
  isSubscribedPeriodicUpdates: z.boolean().optional(),
  periodicUpdatesFrequency: z.lazy(() => FrequencySchema).optional(),
  periodicUpdatesJobId: z.string().optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
}).strict();

export const UserCreateOrConnectWithoutPlaidItemsInputSchema: z.ZodType<PrismaClient.Prisma.UserCreateOrConnectWithoutPlaidItemsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([z.lazy(() => UserCreateWithoutPlaidItemsInputSchema), z.lazy(() => UserUncheckedCreateWithoutPlaidItemsInputSchema)]),
}).strict();

export const PlaidInstitutionCreateWithoutItemsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionCreateWithoutItemsInput> = z.object({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string().optional().nullable(),
}).strict();

export const PlaidInstitutionUncheckedCreateWithoutItemsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionUncheckedCreateWithoutItemsInput> = z.object({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string().optional().nullable(),
}).strict();

export const PlaidInstitutionCreateOrConnectWithoutItemsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionCreateOrConnectWithoutItemsInput> = z.object({
  where: z.lazy(() => PlaidInstitutionWhereUniqueInputSchema),
  create: z.union([z.lazy(() => PlaidInstitutionCreateWithoutItemsInputSchema), z.lazy(() => PlaidInstitutionUncheckedCreateWithoutItemsInputSchema)]),
}).strict();

export const PlaidAccountCreateWithoutItemInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountCreateWithoutItemInput> = z.object({
  id: z.string(),
  name: z.string(),
  mask: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  destinations: z.lazy(() => DestinationCreateNestedManyWithoutAccountsInputSchema).optional(),
}).strict();

export const PlaidAccountUncheckedCreateWithoutItemInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUncheckedCreateWithoutItemInput> = z.object({
  id: z.string(),
  name: z.string(),
  mask: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  destinations: z.lazy(() => DestinationUncheckedCreateNestedManyWithoutAccountsInputSchema).optional(),
}).strict();

export const PlaidAccountCreateOrConnectWithoutItemInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountCreateOrConnectWithoutItemInput> = z.object({
  where: z.lazy(() => PlaidAccountWhereUniqueInputSchema),
  create: z.union([z.lazy(() => PlaidAccountCreateWithoutItemInputSchema), z.lazy(() => PlaidAccountUncheckedCreateWithoutItemInputSchema)]),
}).strict();

export const PlaidAccountCreateManyItemInputEnvelopeSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountCreateManyItemInputEnvelope> = z.object({
  data: z.lazy(() => PlaidAccountCreateManyItemInputSchema).array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserUpsertWithoutPlaidItemsInputSchema: z.ZodType<PrismaClient.Prisma.UserUpsertWithoutPlaidItemsInput> = z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutPlaidItemsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutPlaidItemsInputSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutPlaidItemsInputSchema), z.lazy(() => UserUncheckedCreateWithoutPlaidItemsInputSchema)]),
}).strict();

export const UserUpdateWithoutPlaidItemsInputSchema: z.ZodType<PrismaClient.Prisma.UserUpdateWithoutPlaidItemsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  emailVerified: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  image: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  timezone: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  stripeCustomerId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isSubsribedGeneral: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isSubscribedPeriodicUpdates: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesFrequency: z.union([z.lazy(() => FrequencySchema), z.lazy(() => EnumFrequencyFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesJobId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheUpdateOneWithoutUserNestedInputSchema).optional(),
}).strict();

export const UserUncheckedUpdateWithoutPlaidItemsInputSchema: z.ZodType<PrismaClient.Prisma.UserUncheckedUpdateWithoutPlaidItemsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  emailVerified: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  image: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  timezone: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  stripeCustomerId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isSubsribedGeneral: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isSubscribedPeriodicUpdates: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesFrequency: z.union([z.lazy(() => FrequencySchema), z.lazy(() => EnumFrequencyFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesJobId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
}).strict();

export const PlaidInstitutionUpsertWithoutItemsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionUpsertWithoutItemsInput> = z.object({
  update: z.union([z.lazy(() => PlaidInstitutionUpdateWithoutItemsInputSchema), z.lazy(() => PlaidInstitutionUncheckedUpdateWithoutItemsInputSchema)]),
  create: z.union([z.lazy(() => PlaidInstitutionCreateWithoutItemsInputSchema), z.lazy(() => PlaidInstitutionUncheckedCreateWithoutItemsInputSchema)]),
}).strict();

export const PlaidInstitutionUpdateWithoutItemsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionUpdateWithoutItemsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  logoUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const PlaidInstitutionUncheckedUpdateWithoutItemsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionUncheckedUpdateWithoutItemsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  logoUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const PlaidAccountUpsertWithWhereUniqueWithoutItemInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUpsertWithWhereUniqueWithoutItemInput> = z.object({
  where: z.lazy(() => PlaidAccountWhereUniqueInputSchema),
  update: z.union([z.lazy(() => PlaidAccountUpdateWithoutItemInputSchema), z.lazy(() => PlaidAccountUncheckedUpdateWithoutItemInputSchema)]),
  create: z.union([z.lazy(() => PlaidAccountCreateWithoutItemInputSchema), z.lazy(() => PlaidAccountUncheckedCreateWithoutItemInputSchema)]),
}).strict();

export const PlaidAccountUpdateWithWhereUniqueWithoutItemInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUpdateWithWhereUniqueWithoutItemInput> = z.object({
  where: z.lazy(() => PlaidAccountWhereUniqueInputSchema),
  data: z.union([z.lazy(() => PlaidAccountUpdateWithoutItemInputSchema), z.lazy(() => PlaidAccountUncheckedUpdateWithoutItemInputSchema)]),
}).strict();

export const PlaidAccountUpdateManyWithWhereWithoutItemInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUpdateManyWithWhereWithoutItemInput> = z.object({
  where: z.lazy(() => PlaidAccountScalarWhereInputSchema),
  data: z.union([z.lazy(() => PlaidAccountUpdateManyMutationInputSchema), z.lazy(() => PlaidAccountUncheckedUpdateManyWithoutAccountsInputSchema)]),
}).strict();

export const PlaidAccountScalarWhereInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => PlaidAccountScalarWhereInputSchema), z.lazy(() => PlaidAccountScalarWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => PlaidAccountScalarWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => PlaidAccountScalarWhereInputSchema), z.lazy(() => PlaidAccountScalarWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  plaidItemId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  mask: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
}).strict();

export const DestinationCreateWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateWithoutAccountsInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  airtableCredential: z.lazy(() => AirtableCredentialCreateNestedOneWithoutDestinationInputSchema).optional(),
  codaCredential: z.lazy(() => CodaCredentialCreateNestedOneWithoutDestinationInputSchema).optional(),
  googleSheetsCredential: z.lazy(() => GoogleSheetsCredentialCreateNestedOneWithoutDestinationInputSchema).optional(),
  notionCredential: z.lazy(() => NotionCredentialCreateNestedOneWithoutDestinationsInputSchema).optional(),
  integration: z.lazy(() => IntegrationSchema),
  name: z.string(),
  syncStartDate: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
  tableConfigs: z.lazy(() => DestinationTableConfigCreateNestedManyWithoutDestinationInputSchema).optional(),
}).strict();

export const DestinationUncheckedCreateWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedCreateWithoutAccountsInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  airtableCredentialId: z.string().optional().nullable(),
  codaCredentialId: z.string().optional().nullable(),
  googleSheetsCredentialId: z.string().optional().nullable(),
  notionCredentialId: z.string().optional().nullable(),
  integration: z.lazy(() => IntegrationSchema),
  name: z.string(),
  syncStartDate: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
  tableConfigs: z.lazy(() => DestinationTableConfigUncheckedCreateNestedManyWithoutDestinationInputSchema).optional(),
}).strict();

export const DestinationCreateOrConnectWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateOrConnectWithoutAccountsInput> = z.object({
  where: z.lazy(() => DestinationWhereUniqueInputSchema),
  create: z.union([z.lazy(() => DestinationCreateWithoutAccountsInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutAccountsInputSchema)]),
}).strict();

export const PlaidItemCreateWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemCreateWithoutAccountsInput> = z.object({
  id: z.string(),
  isInitialUpdateComplete: z.boolean().optional(),
  isHistoricalUpdateComplete: z.boolean().optional(),
  error: z.string().optional().nullable(),
  accessToken: z.string(),
  plaidSyncCursor: z.string().optional().nullable(),
  availableProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  billedProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  lastSyncedAt: z.date().optional().nullable(),
  consentExpiresAt: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutPlaidItemsInputSchema),
  institution: z.lazy(() => PlaidInstitutionCreateNestedOneWithoutItemsInputSchema),
}).strict();

export const PlaidItemUncheckedCreateWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUncheckedCreateWithoutAccountsInput> = z.object({
  id: z.string(),
  institutionId: z.string(),
  userId: z.string(),
  isInitialUpdateComplete: z.boolean().optional(),
  isHistoricalUpdateComplete: z.boolean().optional(),
  error: z.string().optional().nullable(),
  accessToken: z.string(),
  plaidSyncCursor: z.string().optional().nullable(),
  availableProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  billedProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  lastSyncedAt: z.date().optional().nullable(),
  consentExpiresAt: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
}).strict();

export const PlaidItemCreateOrConnectWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemCreateOrConnectWithoutAccountsInput> = z.object({
  where: z.lazy(() => PlaidItemWhereUniqueInputSchema),
  create: z.union([z.lazy(() => PlaidItemCreateWithoutAccountsInputSchema), z.lazy(() => PlaidItemUncheckedCreateWithoutAccountsInputSchema)]),
}).strict();

export const DestinationUpsertWithWhereUniqueWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpsertWithWhereUniqueWithoutAccountsInput> = z.object({
  where: z.lazy(() => DestinationWhereUniqueInputSchema),
  update: z.union([z.lazy(() => DestinationUpdateWithoutAccountsInputSchema), z.lazy(() => DestinationUncheckedUpdateWithoutAccountsInputSchema)]),
  create: z.union([z.lazy(() => DestinationCreateWithoutAccountsInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutAccountsInputSchema)]),
}).strict();

export const DestinationUpdateWithWhereUniqueWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpdateWithWhereUniqueWithoutAccountsInput> = z.object({
  where: z.lazy(() => DestinationWhereUniqueInputSchema),
  data: z.union([z.lazy(() => DestinationUpdateWithoutAccountsInputSchema), z.lazy(() => DestinationUncheckedUpdateWithoutAccountsInputSchema)]),
}).strict();

export const DestinationUpdateManyWithWhereWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpdateManyWithWhereWithoutAccountsInput> = z.object({
  where: z.lazy(() => DestinationScalarWhereInputSchema),
  data: z.union([z.lazy(() => DestinationUpdateManyMutationInputSchema), z.lazy(() => DestinationUncheckedUpdateManyWithoutDestinationsInputSchema)]),
}).strict();

export const DestinationScalarWhereInputSchema: z.ZodType<PrismaClient.Prisma.DestinationScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => DestinationScalarWhereInputSchema), z.lazy(() => DestinationScalarWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => DestinationScalarWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => DestinationScalarWhereInputSchema), z.lazy(() => DestinationScalarWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  airtableCredentialId: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  codaCredentialId: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  googleSheetsCredentialId: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  notionCredentialId: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  integration: z.union([z.lazy(() => EnumIntegrationFilterSchema), z.lazy(() => IntegrationSchema)]).optional(),
  name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  syncStartDate: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.date()]).optional(),
  disabledAt: z.union([z.lazy(() => DateTimeNullableFilterSchema), z.date()]).optional().nullable(),
}).strict();

export const PlaidItemUpsertWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUpsertWithoutAccountsInput> = z.object({
  update: z.union([z.lazy(() => PlaidItemUpdateWithoutAccountsInputSchema), z.lazy(() => PlaidItemUncheckedUpdateWithoutAccountsInputSchema)]),
  create: z.union([z.lazy(() => PlaidItemCreateWithoutAccountsInputSchema), z.lazy(() => PlaidItemUncheckedCreateWithoutAccountsInputSchema)]),
}).strict();

export const PlaidItemUpdateWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUpdateWithoutAccountsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isInitialUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isHistoricalUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  error: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  plaidSyncCursor: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  availableProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  billedProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  lastSyncedAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  consentExpiresAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutPlaidItemsNestedInputSchema).optional(),
  institution: z.lazy(() => PlaidInstitutionUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
}).strict();

export const PlaidItemUncheckedUpdateWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUncheckedUpdateWithoutAccountsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  institutionId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isInitialUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isHistoricalUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  error: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  plaidSyncCursor: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  availableProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  billedProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  lastSyncedAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  consentExpiresAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const UserCreateWithoutLinkTokensInputSchema: z.ZodType<PrismaClient.Prisma.UserCreateWithoutLinkTokensInput> = z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  image: z.string().optional().nullable(),
  disabledAt: z.date().optional().nullable(),
  timezone: z.string().optional(),
  stripeCustomerId: z.string(),
  isSubsribedGeneral: z.boolean().optional(),
  isSubscribedPeriodicUpdates: z.boolean().optional(),
  periodicUpdatesFrequency: z.lazy(() => FrequencySchema).optional(),
  periodicUpdatesJobId: z.string().optional().nullable(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemCreateNestedManyWithoutUserInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenCreateNestedManyWithoutUserInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheCreateNestedOneWithoutUserInputSchema).optional(),
}).strict();

export const UserUncheckedCreateWithoutLinkTokensInputSchema: z.ZodType<PrismaClient.Prisma.UserUncheckedCreateWithoutLinkTokensInput> = z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  image: z.string().optional().nullable(),
  disabledAt: z.date().optional().nullable(),
  timezone: z.string().optional(),
  stripeCustomerId: z.string(),
  isSubsribedGeneral: z.boolean().optional(),
  isSubscribedPeriodicUpdates: z.boolean().optional(),
  periodicUpdatesFrequency: z.lazy(() => FrequencySchema).optional(),
  periodicUpdatesJobId: z.string().optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
}).strict();

export const UserCreateOrConnectWithoutLinkTokensInputSchema: z.ZodType<PrismaClient.Prisma.UserCreateOrConnectWithoutLinkTokensInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([z.lazy(() => UserCreateWithoutLinkTokensInputSchema), z.lazy(() => UserUncheckedCreateWithoutLinkTokensInputSchema)]),
}).strict();

export const UserUpsertWithoutLinkTokensInputSchema: z.ZodType<PrismaClient.Prisma.UserUpsertWithoutLinkTokensInput> = z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutLinkTokensInputSchema), z.lazy(() => UserUncheckedUpdateWithoutLinkTokensInputSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutLinkTokensInputSchema), z.lazy(() => UserUncheckedCreateWithoutLinkTokensInputSchema)]),
}).strict();

export const UserUpdateWithoutLinkTokensInputSchema: z.ZodType<PrismaClient.Prisma.UserUpdateWithoutLinkTokensInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  emailVerified: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  image: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  timezone: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  stripeCustomerId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isSubsribedGeneral: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isSubscribedPeriodicUpdates: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesFrequency: z.union([z.lazy(() => FrequencySchema), z.lazy(() => EnumFrequencyFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesJobId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheUpdateOneWithoutUserNestedInputSchema).optional(),
}).strict();

export const UserUncheckedUpdateWithoutLinkTokensInputSchema: z.ZodType<PrismaClient.Prisma.UserUncheckedUpdateWithoutLinkTokensInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  emailVerified: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  image: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  timezone: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  stripeCustomerId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isSubsribedGeneral: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isSubscribedPeriodicUpdates: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesFrequency: z.union([z.lazy(() => FrequencySchema), z.lazy(() => EnumFrequencyFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesJobId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
}).strict();

export const AirtableCredentialCreateWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialCreateWithoutDestinationInput> = z.object({
  id: z.string().optional(),
  baseId: z.string(),
  apiKey: z.string().optional().nullable(),
}).strict();

export const AirtableCredentialUncheckedCreateWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialUncheckedCreateWithoutDestinationInput> = z.object({
  id: z.string().optional(),
  baseId: z.string(),
  apiKey: z.string().optional().nullable(),
}).strict();

export const AirtableCredentialCreateOrConnectWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialCreateOrConnectWithoutDestinationInput> = z.object({
  where: z.lazy(() => AirtableCredentialWhereUniqueInputSchema),
  create: z.union([z.lazy(() => AirtableCredentialCreateWithoutDestinationInputSchema), z.lazy(() => AirtableCredentialUncheckedCreateWithoutDestinationInputSchema)]),
}).strict();

export const CodaCredentialCreateWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialCreateWithoutDestinationInput> = z.object({
  id: z.string().optional(),
  accessToken: z.string(),
  accessTokenHash: z.string(),
}).strict();

export const CodaCredentialUncheckedCreateWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialUncheckedCreateWithoutDestinationInput> = z.object({
  id: z.string().optional(),
  accessToken: z.string(),
  accessTokenHash: z.string(),
}).strict();

export const CodaCredentialCreateOrConnectWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialCreateOrConnectWithoutDestinationInput> = z.object({
  where: z.lazy(() => CodaCredentialWhereUniqueInputSchema),
  create: z.union([z.lazy(() => CodaCredentialCreateWithoutDestinationInputSchema), z.lazy(() => CodaCredentialUncheckedCreateWithoutDestinationInputSchema)]),
}).strict();

export const GoogleSheetsCredentialCreateWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialCreateWithoutDestinationInput> = z.object({
  id: z.string().optional(),
  spreadsheetId: z.string(),
}).strict();

export const GoogleSheetsCredentialUncheckedCreateWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialUncheckedCreateWithoutDestinationInput> = z.object({
  id: z.string().optional(),
  spreadsheetId: z.string(),
}).strict();

export const GoogleSheetsCredentialCreateOrConnectWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialCreateOrConnectWithoutDestinationInput> = z.object({
  where: z.lazy(() => GoogleSheetsCredentialWhereUniqueInputSchema),
  create: z.union([z.lazy(() => GoogleSheetsCredentialCreateWithoutDestinationInputSchema), z.lazy(() => GoogleSheetsCredentialUncheckedCreateWithoutDestinationInputSchema)]),
}).strict();

export const NotionCredentialCreateWithoutDestinationsInputSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialCreateWithoutDestinationsInput> = z.object({
  id: z.string().optional(),
  botId: z.string(),
  userId: z.string(),
  accessToken: z.string(),
  workspaceId: z.string(),
  workspaceName: z.string().optional().nullable(),
  workspaceIcon: z.string().optional().nullable(),
  owner: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).strict();

export const NotionCredentialUncheckedCreateWithoutDestinationsInputSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialUncheckedCreateWithoutDestinationsInput> = z.object({
  id: z.string().optional(),
  botId: z.string(),
  userId: z.string(),
  accessToken: z.string(),
  workspaceId: z.string(),
  workspaceName: z.string().optional().nullable(),
  workspaceIcon: z.string().optional().nullable(),
  owner: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).strict();

export const NotionCredentialCreateOrConnectWithoutDestinationsInputSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialCreateOrConnectWithoutDestinationsInput> = z.object({
  where: z.lazy(() => NotionCredentialWhereUniqueInputSchema),
  create: z.union([z.lazy(() => NotionCredentialCreateWithoutDestinationsInputSchema), z.lazy(() => NotionCredentialUncheckedCreateWithoutDestinationsInputSchema)]),
}).strict();

export const PlaidAccountCreateWithoutDestinationsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountCreateWithoutDestinationsInput> = z.object({
  id: z.string(),
  name: z.string(),
  mask: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  item: z.lazy(() => PlaidItemCreateNestedOneWithoutAccountsInputSchema),
}).strict();

export const PlaidAccountUncheckedCreateWithoutDestinationsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUncheckedCreateWithoutDestinationsInput> = z.object({
  id: z.string(),
  plaidItemId: z.string(),
  name: z.string(),
  mask: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).strict();

export const PlaidAccountCreateOrConnectWithoutDestinationsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountCreateOrConnectWithoutDestinationsInput> = z.object({
  where: z.lazy(() => PlaidAccountWhereUniqueInputSchema),
  create: z.union([z.lazy(() => PlaidAccountCreateWithoutDestinationsInputSchema), z.lazy(() => PlaidAccountUncheckedCreateWithoutDestinationsInputSchema)]),
}).strict();

export const DestinationTableConfigCreateWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigCreateWithoutDestinationInput> = z.object({
  id: z.string().optional(),
  isEnabled: z.boolean().optional(),
  table: z.lazy(() => TableSchema),
  tableId: z.string(),
  fieldConfigs: z.lazy(() => DestinationFieldConfigCreateNestedManyWithoutTableConfigInputSchema).optional(),
}).strict();

export const DestinationTableConfigUncheckedCreateWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigUncheckedCreateWithoutDestinationInput> = z.object({
  id: z.string().optional(),
  isEnabled: z.boolean().optional(),
  table: z.lazy(() => TableSchema),
  tableId: z.string(),
  fieldConfigs: z.lazy(() => DestinationFieldConfigUncheckedCreateNestedManyWithoutTableConfigInputSchema).optional(),
}).strict();

export const DestinationTableConfigCreateOrConnectWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigCreateOrConnectWithoutDestinationInput> = z.object({
  where: z.lazy(() => DestinationTableConfigWhereUniqueInputSchema),
  create: z.union([z.lazy(() => DestinationTableConfigCreateWithoutDestinationInputSchema), z.lazy(() => DestinationTableConfigUncheckedCreateWithoutDestinationInputSchema)]),
}).strict();

export const DestinationTableConfigCreateManyDestinationInputEnvelopeSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigCreateManyDestinationInputEnvelope> = z.object({
  data: z.lazy(() => DestinationTableConfigCreateManyDestinationInputSchema).array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const AirtableCredentialUpsertWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialUpsertWithoutDestinationInput> = z.object({
  update: z.union([z.lazy(() => AirtableCredentialUpdateWithoutDestinationInputSchema), z.lazy(() => AirtableCredentialUncheckedUpdateWithoutDestinationInputSchema)]),
  create: z.union([z.lazy(() => AirtableCredentialCreateWithoutDestinationInputSchema), z.lazy(() => AirtableCredentialUncheckedCreateWithoutDestinationInputSchema)]),
}).strict();

export const AirtableCredentialUpdateWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialUpdateWithoutDestinationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  baseId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  apiKey: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const AirtableCredentialUncheckedUpdateWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialUncheckedUpdateWithoutDestinationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  baseId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  apiKey: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const CodaCredentialUpsertWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialUpsertWithoutDestinationInput> = z.object({
  update: z.union([z.lazy(() => CodaCredentialUpdateWithoutDestinationInputSchema), z.lazy(() => CodaCredentialUncheckedUpdateWithoutDestinationInputSchema)]),
  create: z.union([z.lazy(() => CodaCredentialCreateWithoutDestinationInputSchema), z.lazy(() => CodaCredentialUncheckedCreateWithoutDestinationInputSchema)]),
}).strict();

export const CodaCredentialUpdateWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialUpdateWithoutDestinationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessTokenHash: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const CodaCredentialUncheckedUpdateWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialUncheckedUpdateWithoutDestinationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessTokenHash: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const GoogleSheetsCredentialUpsertWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialUpsertWithoutDestinationInput> = z.object({
  update: z.union([z.lazy(() => GoogleSheetsCredentialUpdateWithoutDestinationInputSchema), z.lazy(() => GoogleSheetsCredentialUncheckedUpdateWithoutDestinationInputSchema)]),
  create: z.union([z.lazy(() => GoogleSheetsCredentialCreateWithoutDestinationInputSchema), z.lazy(() => GoogleSheetsCredentialUncheckedCreateWithoutDestinationInputSchema)]),
}).strict();

export const GoogleSheetsCredentialUpdateWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialUpdateWithoutDestinationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  spreadsheetId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const GoogleSheetsCredentialUncheckedUpdateWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialUncheckedUpdateWithoutDestinationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  spreadsheetId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const NotionCredentialUpsertWithoutDestinationsInputSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialUpsertWithoutDestinationsInput> = z.object({
  update: z.union([z.lazy(() => NotionCredentialUpdateWithoutDestinationsInputSchema), z.lazy(() => NotionCredentialUncheckedUpdateWithoutDestinationsInputSchema)]),
  create: z.union([z.lazy(() => NotionCredentialCreateWithoutDestinationsInputSchema), z.lazy(() => NotionCredentialUncheckedCreateWithoutDestinationsInputSchema)]),
}).strict();

export const NotionCredentialUpdateWithoutDestinationsInputSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialUpdateWithoutDestinationsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  botId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  workspaceId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  workspaceName: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  workspaceIcon: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  owner: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const NotionCredentialUncheckedUpdateWithoutDestinationsInputSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialUncheckedUpdateWithoutDestinationsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  botId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  workspaceId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  workspaceName: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  workspaceIcon: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  owner: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const PlaidAccountUpsertWithWhereUniqueWithoutDestinationsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUpsertWithWhereUniqueWithoutDestinationsInput> = z.object({
  where: z.lazy(() => PlaidAccountWhereUniqueInputSchema),
  update: z.union([z.lazy(() => PlaidAccountUpdateWithoutDestinationsInputSchema), z.lazy(() => PlaidAccountUncheckedUpdateWithoutDestinationsInputSchema)]),
  create: z.union([z.lazy(() => PlaidAccountCreateWithoutDestinationsInputSchema), z.lazy(() => PlaidAccountUncheckedCreateWithoutDestinationsInputSchema)]),
}).strict();

export const PlaidAccountUpdateWithWhereUniqueWithoutDestinationsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUpdateWithWhereUniqueWithoutDestinationsInput> = z.object({
  where: z.lazy(() => PlaidAccountWhereUniqueInputSchema),
  data: z.union([z.lazy(() => PlaidAccountUpdateWithoutDestinationsInputSchema), z.lazy(() => PlaidAccountUncheckedUpdateWithoutDestinationsInputSchema)]),
}).strict();

export const PlaidAccountUpdateManyWithWhereWithoutDestinationsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUpdateManyWithWhereWithoutDestinationsInput> = z.object({
  where: z.lazy(() => PlaidAccountScalarWhereInputSchema),
  data: z.union([z.lazy(() => PlaidAccountUpdateManyMutationInputSchema), z.lazy(() => PlaidAccountUncheckedUpdateManyWithoutAccountsInputSchema)]),
}).strict();

export const DestinationTableConfigUpsertWithWhereUniqueWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigUpsertWithWhereUniqueWithoutDestinationInput> = z.object({
  where: z.lazy(() => DestinationTableConfigWhereUniqueInputSchema),
  update: z.union([z.lazy(() => DestinationTableConfigUpdateWithoutDestinationInputSchema), z.lazy(() => DestinationTableConfigUncheckedUpdateWithoutDestinationInputSchema)]),
  create: z.union([z.lazy(() => DestinationTableConfigCreateWithoutDestinationInputSchema), z.lazy(() => DestinationTableConfigUncheckedCreateWithoutDestinationInputSchema)]),
}).strict();

export const DestinationTableConfigUpdateWithWhereUniqueWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigUpdateWithWhereUniqueWithoutDestinationInput> = z.object({
  where: z.lazy(() => DestinationTableConfigWhereUniqueInputSchema),
  data: z.union([z.lazy(() => DestinationTableConfigUpdateWithoutDestinationInputSchema), z.lazy(() => DestinationTableConfigUncheckedUpdateWithoutDestinationInputSchema)]),
}).strict();

export const DestinationTableConfigUpdateManyWithWhereWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigUpdateManyWithWhereWithoutDestinationInput> = z.object({
  where: z.lazy(() => DestinationTableConfigScalarWhereInputSchema),
  data: z.union([z.lazy(() => DestinationTableConfigUpdateManyMutationInputSchema), z.lazy(() => DestinationTableConfigUncheckedUpdateManyWithoutTableConfigsInputSchema)]),
}).strict();

export const DestinationTableConfigScalarWhereInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => DestinationTableConfigScalarWhereInputSchema), z.lazy(() => DestinationTableConfigScalarWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => DestinationTableConfigScalarWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => DestinationTableConfigScalarWhereInputSchema), z.lazy(() => DestinationTableConfigScalarWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  destinationId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  isEnabled: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
  table: z.union([z.lazy(() => EnumTableFilterSchema), z.lazy(() => TableSchema)]).optional(),
  tableId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
}).strict();

export const DestinationCreateWithoutTableConfigsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateWithoutTableConfigsInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  airtableCredential: z.lazy(() => AirtableCredentialCreateNestedOneWithoutDestinationInputSchema).optional(),
  codaCredential: z.lazy(() => CodaCredentialCreateNestedOneWithoutDestinationInputSchema).optional(),
  googleSheetsCredential: z.lazy(() => GoogleSheetsCredentialCreateNestedOneWithoutDestinationInputSchema).optional(),
  notionCredential: z.lazy(() => NotionCredentialCreateNestedOneWithoutDestinationsInputSchema).optional(),
  integration: z.lazy(() => IntegrationSchema),
  name: z.string(),
  syncStartDate: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
  accounts: z.lazy(() => PlaidAccountCreateNestedManyWithoutDestinationsInputSchema).optional(),
}).strict();

export const DestinationUncheckedCreateWithoutTableConfigsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedCreateWithoutTableConfigsInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  airtableCredentialId: z.string().optional().nullable(),
  codaCredentialId: z.string().optional().nullable(),
  googleSheetsCredentialId: z.string().optional().nullable(),
  notionCredentialId: z.string().optional().nullable(),
  integration: z.lazy(() => IntegrationSchema),
  name: z.string(),
  syncStartDate: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUncheckedCreateNestedManyWithoutDestinationsInputSchema).optional(),
}).strict();

export const DestinationCreateOrConnectWithoutTableConfigsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateOrConnectWithoutTableConfigsInput> = z.object({
  where: z.lazy(() => DestinationWhereUniqueInputSchema),
  create: z.union([z.lazy(() => DestinationCreateWithoutTableConfigsInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutTableConfigsInputSchema)]),
}).strict();

export const DestinationFieldConfigCreateWithoutTableConfigInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigCreateWithoutTableConfigInput> = z.object({
  id: z.string().optional(),
  field: z.lazy(() => FieldSchema),
  fieldId: z.string(),
}).strict();

export const DestinationFieldConfigUncheckedCreateWithoutTableConfigInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigUncheckedCreateWithoutTableConfigInput> = z.object({
  id: z.string().optional(),
  field: z.lazy(() => FieldSchema),
  fieldId: z.string(),
}).strict();

export const DestinationFieldConfigCreateOrConnectWithoutTableConfigInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigCreateOrConnectWithoutTableConfigInput> = z.object({
  where: z.lazy(() => DestinationFieldConfigWhereUniqueInputSchema),
  create: z.union([z.lazy(() => DestinationFieldConfigCreateWithoutTableConfigInputSchema), z.lazy(() => DestinationFieldConfigUncheckedCreateWithoutTableConfigInputSchema)]),
}).strict();

export const DestinationFieldConfigCreateManyTableConfigInputEnvelopeSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigCreateManyTableConfigInputEnvelope> = z.object({
  data: z.lazy(() => DestinationFieldConfigCreateManyTableConfigInputSchema).array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const DestinationUpsertWithoutTableConfigsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpsertWithoutTableConfigsInput> = z.object({
  update: z.union([z.lazy(() => DestinationUpdateWithoutTableConfigsInputSchema), z.lazy(() => DestinationUncheckedUpdateWithoutTableConfigsInputSchema)]),
  create: z.union([z.lazy(() => DestinationCreateWithoutTableConfigsInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutTableConfigsInputSchema)]),
}).strict();

export const DestinationUpdateWithoutTableConfigsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpdateWithoutTableConfigsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  airtableCredential: z.lazy(() => AirtableCredentialUpdateOneWithoutDestinationNestedInputSchema).optional(),
  codaCredential: z.lazy(() => CodaCredentialUpdateOneWithoutDestinationNestedInputSchema).optional(),
  googleSheetsCredential: z.lazy(() => GoogleSheetsCredentialUpdateOneWithoutDestinationNestedInputSchema).optional(),
  notionCredential: z.lazy(() => NotionCredentialUpdateOneWithoutDestinationsNestedInputSchema).optional(),
  integration: z.union([z.lazy(() => IntegrationSchema), z.lazy(() => EnumIntegrationFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  syncStartDate: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUpdateManyWithoutDestinationsNestedInputSchema).optional(),
}).strict();

export const DestinationUncheckedUpdateWithoutTableConfigsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedUpdateWithoutTableConfigsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  airtableCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  codaCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  googleSheetsCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  notionCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  integration: z.union([z.lazy(() => IntegrationSchema), z.lazy(() => EnumIntegrationFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  syncStartDate: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUncheckedUpdateManyWithoutDestinationsNestedInputSchema).optional(),
}).strict();

export const DestinationFieldConfigUpsertWithWhereUniqueWithoutTableConfigInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigUpsertWithWhereUniqueWithoutTableConfigInput> = z.object({
  where: z.lazy(() => DestinationFieldConfigWhereUniqueInputSchema),
  update: z.union([z.lazy(() => DestinationFieldConfigUpdateWithoutTableConfigInputSchema), z.lazy(() => DestinationFieldConfigUncheckedUpdateWithoutTableConfigInputSchema)]),
  create: z.union([z.lazy(() => DestinationFieldConfigCreateWithoutTableConfigInputSchema), z.lazy(() => DestinationFieldConfigUncheckedCreateWithoutTableConfigInputSchema)]),
}).strict();

export const DestinationFieldConfigUpdateWithWhereUniqueWithoutTableConfigInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigUpdateWithWhereUniqueWithoutTableConfigInput> = z.object({
  where: z.lazy(() => DestinationFieldConfigWhereUniqueInputSchema),
  data: z.union([z.lazy(() => DestinationFieldConfigUpdateWithoutTableConfigInputSchema), z.lazy(() => DestinationFieldConfigUncheckedUpdateWithoutTableConfigInputSchema)]),
}).strict();

export const DestinationFieldConfigUpdateManyWithWhereWithoutTableConfigInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigUpdateManyWithWhereWithoutTableConfigInput> = z.object({
  where: z.lazy(() => DestinationFieldConfigScalarWhereInputSchema),
  data: z.union([z.lazy(() => DestinationFieldConfigUpdateManyMutationInputSchema), z.lazy(() => DestinationFieldConfigUncheckedUpdateManyWithoutFieldConfigsInputSchema)]),
}).strict();

export const DestinationFieldConfigScalarWhereInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => DestinationFieldConfigScalarWhereInputSchema), z.lazy(() => DestinationFieldConfigScalarWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => DestinationFieldConfigScalarWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => DestinationFieldConfigScalarWhereInputSchema), z.lazy(() => DestinationFieldConfigScalarWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  tableConfigId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  field: z.union([z.lazy(() => EnumFieldFilterSchema), z.lazy(() => FieldSchema)]).optional(),
  fieldId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
}).strict();

export const DestinationTableConfigCreateWithoutFieldConfigsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigCreateWithoutFieldConfigsInput> = z.object({
  id: z.string().optional(),
  destination: z.lazy(() => DestinationCreateNestedOneWithoutTableConfigsInputSchema),
  isEnabled: z.boolean().optional(),
  table: z.lazy(() => TableSchema),
  tableId: z.string(),
}).strict();

export const DestinationTableConfigUncheckedCreateWithoutFieldConfigsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigUncheckedCreateWithoutFieldConfigsInput> = z.object({
  id: z.string().optional(),
  destinationId: z.string(),
  isEnabled: z.boolean().optional(),
  table: z.lazy(() => TableSchema),
  tableId: z.string(),
}).strict();

export const DestinationTableConfigCreateOrConnectWithoutFieldConfigsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigCreateOrConnectWithoutFieldConfigsInput> = z.object({
  where: z.lazy(() => DestinationTableConfigWhereUniqueInputSchema),
  create: z.union([z.lazy(() => DestinationTableConfigCreateWithoutFieldConfigsInputSchema), z.lazy(() => DestinationTableConfigUncheckedCreateWithoutFieldConfigsInputSchema)]),
}).strict();

export const DestinationTableConfigUpsertWithoutFieldConfigsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigUpsertWithoutFieldConfigsInput> = z.object({
  update: z.union([z.lazy(() => DestinationTableConfigUpdateWithoutFieldConfigsInputSchema), z.lazy(() => DestinationTableConfigUncheckedUpdateWithoutFieldConfigsInputSchema)]),
  create: z.union([z.lazy(() => DestinationTableConfigCreateWithoutFieldConfigsInputSchema), z.lazy(() => DestinationTableConfigUncheckedCreateWithoutFieldConfigsInputSchema)]),
}).strict();

export const DestinationTableConfigUpdateWithoutFieldConfigsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigUpdateWithoutFieldConfigsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  destination: z.lazy(() => DestinationUpdateOneRequiredWithoutTableConfigsNestedInputSchema).optional(),
  isEnabled: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  table: z.union([z.lazy(() => TableSchema), z.lazy(() => EnumTableFieldUpdateOperationsInputSchema)]).optional(),
  tableId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const DestinationTableConfigUncheckedUpdateWithoutFieldConfigsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigUncheckedUpdateWithoutFieldConfigsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  destinationId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isEnabled: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  table: z.union([z.lazy(() => TableSchema), z.lazy(() => EnumTableFieldUpdateOperationsInputSchema)]).optional(),
  tableId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const DestinationCreateWithoutAirtableCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateWithoutAirtableCredentialInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  codaCredential: z.lazy(() => CodaCredentialCreateNestedOneWithoutDestinationInputSchema).optional(),
  googleSheetsCredential: z.lazy(() => GoogleSheetsCredentialCreateNestedOneWithoutDestinationInputSchema).optional(),
  notionCredential: z.lazy(() => NotionCredentialCreateNestedOneWithoutDestinationsInputSchema).optional(),
  integration: z.lazy(() => IntegrationSchema),
  name: z.string(),
  syncStartDate: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
  accounts: z.lazy(() => PlaidAccountCreateNestedManyWithoutDestinationsInputSchema).optional(),
  tableConfigs: z.lazy(() => DestinationTableConfigCreateNestedManyWithoutDestinationInputSchema).optional(),
}).strict();

export const DestinationUncheckedCreateWithoutAirtableCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedCreateWithoutAirtableCredentialInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  codaCredentialId: z.string().optional().nullable(),
  googleSheetsCredentialId: z.string().optional().nullable(),
  notionCredentialId: z.string().optional().nullable(),
  integration: z.lazy(() => IntegrationSchema),
  name: z.string(),
  syncStartDate: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUncheckedCreateNestedManyWithoutDestinationsInputSchema).optional(),
  tableConfigs: z.lazy(() => DestinationTableConfigUncheckedCreateNestedManyWithoutDestinationInputSchema).optional(),
}).strict();

export const DestinationCreateOrConnectWithoutAirtableCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateOrConnectWithoutAirtableCredentialInput> = z.object({
  where: z.lazy(() => DestinationWhereUniqueInputSchema),
  create: z.union([z.lazy(() => DestinationCreateWithoutAirtableCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutAirtableCredentialInputSchema)]),
}).strict();

export const DestinationUpsertWithoutAirtableCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpsertWithoutAirtableCredentialInput> = z.object({
  update: z.union([z.lazy(() => DestinationUpdateWithoutAirtableCredentialInputSchema), z.lazy(() => DestinationUncheckedUpdateWithoutAirtableCredentialInputSchema)]),
  create: z.union([z.lazy(() => DestinationCreateWithoutAirtableCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutAirtableCredentialInputSchema)]),
}).strict();

export const DestinationUpdateWithoutAirtableCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpdateWithoutAirtableCredentialInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  codaCredential: z.lazy(() => CodaCredentialUpdateOneWithoutDestinationNestedInputSchema).optional(),
  googleSheetsCredential: z.lazy(() => GoogleSheetsCredentialUpdateOneWithoutDestinationNestedInputSchema).optional(),
  notionCredential: z.lazy(() => NotionCredentialUpdateOneWithoutDestinationsNestedInputSchema).optional(),
  integration: z.union([z.lazy(() => IntegrationSchema), z.lazy(() => EnumIntegrationFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  syncStartDate: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUpdateManyWithoutDestinationsNestedInputSchema).optional(),
  tableConfigs: z.lazy(() => DestinationTableConfigUpdateManyWithoutDestinationNestedInputSchema).optional(),
}).strict();

export const DestinationUncheckedUpdateWithoutAirtableCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedUpdateWithoutAirtableCredentialInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  codaCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  googleSheetsCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  notionCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  integration: z.union([z.lazy(() => IntegrationSchema), z.lazy(() => EnumIntegrationFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  syncStartDate: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUncheckedUpdateManyWithoutDestinationsNestedInputSchema).optional(),
  tableConfigs: z.lazy(() => DestinationTableConfigUncheckedUpdateManyWithoutDestinationNestedInputSchema).optional(),
}).strict();

export const UserCreateWithoutAirtableAuthorizationCacheInputSchema: z.ZodType<PrismaClient.Prisma.UserCreateWithoutAirtableAuthorizationCacheInput> = z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  image: z.string().optional().nullable(),
  disabledAt: z.date().optional().nullable(),
  timezone: z.string().optional(),
  stripeCustomerId: z.string(),
  isSubsribedGeneral: z.boolean().optional(),
  isSubscribedPeriodicUpdates: z.boolean().optional(),
  periodicUpdatesFrequency: z.lazy(() => FrequencySchema).optional(),
  periodicUpdatesJobId: z.string().optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenCreateNestedManyWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemCreateNestedManyWithoutUserInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenCreateNestedManyWithoutUserInputSchema).optional(),
}).strict();

export const UserUncheckedCreateWithoutAirtableAuthorizationCacheInputSchema: z.ZodType<PrismaClient.Prisma.UserUncheckedCreateWithoutAirtableAuthorizationCacheInput> = z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  image: z.string().optional().nullable(),
  disabledAt: z.date().optional().nullable(),
  timezone: z.string().optional(),
  stripeCustomerId: z.string(),
  isSubsribedGeneral: z.boolean().optional(),
  isSubscribedPeriodicUpdates: z.boolean().optional(),
  periodicUpdatesFrequency: z.lazy(() => FrequencySchema).optional(),
  periodicUpdatesJobId: z.string().optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
}).strict();

export const UserCreateOrConnectWithoutAirtableAuthorizationCacheInputSchema: z.ZodType<PrismaClient.Prisma.UserCreateOrConnectWithoutAirtableAuthorizationCacheInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([z.lazy(() => UserCreateWithoutAirtableAuthorizationCacheInputSchema), z.lazy(() => UserUncheckedCreateWithoutAirtableAuthorizationCacheInputSchema)]),
}).strict();

export const UserUpsertWithoutAirtableAuthorizationCacheInputSchema: z.ZodType<PrismaClient.Prisma.UserUpsertWithoutAirtableAuthorizationCacheInput> = z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutAirtableAuthorizationCacheInputSchema), z.lazy(() => UserUncheckedUpdateWithoutAirtableAuthorizationCacheInputSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutAirtableAuthorizationCacheInputSchema), z.lazy(() => UserUncheckedCreateWithoutAirtableAuthorizationCacheInputSchema)]),
}).strict();

export const UserUpdateWithoutAirtableAuthorizationCacheInputSchema: z.ZodType<PrismaClient.Prisma.UserUpdateWithoutAirtableAuthorizationCacheInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  emailVerified: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  image: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  timezone: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  stripeCustomerId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isSubsribedGeneral: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isSubscribedPeriodicUpdates: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesFrequency: z.union([z.lazy(() => FrequencySchema), z.lazy(() => EnumFrequencyFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesJobId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenUpdateManyWithoutUserNestedInputSchema).optional(),
}).strict();

export const UserUncheckedUpdateWithoutAirtableAuthorizationCacheInputSchema: z.ZodType<PrismaClient.Prisma.UserUncheckedUpdateWithoutAirtableAuthorizationCacheInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  emailVerified: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  image: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  timezone: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  stripeCustomerId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isSubsribedGeneral: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isSubscribedPeriodicUpdates: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesFrequency: z.union([z.lazy(() => FrequencySchema), z.lazy(() => EnumFrequencyFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesJobId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableTokens: z.lazy(() => AirtableTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
}).strict();

export const UserCreateWithoutAirtableTokensInputSchema: z.ZodType<PrismaClient.Prisma.UserCreateWithoutAirtableTokensInput> = z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  image: z.string().optional().nullable(),
  disabledAt: z.date().optional().nullable(),
  timezone: z.string().optional(),
  stripeCustomerId: z.string(),
  isSubsribedGeneral: z.boolean().optional(),
  isSubscribedPeriodicUpdates: z.boolean().optional(),
  periodicUpdatesFrequency: z.lazy(() => FrequencySchema).optional(),
  periodicUpdatesJobId: z.string().optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenCreateNestedManyWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemCreateNestedManyWithoutUserInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheCreateNestedOneWithoutUserInputSchema).optional(),
}).strict();

export const UserUncheckedCreateWithoutAirtableTokensInputSchema: z.ZodType<PrismaClient.Prisma.UserUncheckedCreateWithoutAirtableTokensInput> = z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  image: z.string().optional().nullable(),
  disabledAt: z.date().optional().nullable(),
  timezone: z.string().optional(),
  stripeCustomerId: z.string(),
  isSubsribedGeneral: z.boolean().optional(),
  isSubscribedPeriodicUpdates: z.boolean().optional(),
  periodicUpdatesFrequency: z.lazy(() => FrequencySchema).optional(),
  periodicUpdatesJobId: z.string().optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
}).strict();

export const UserCreateOrConnectWithoutAirtableTokensInputSchema: z.ZodType<PrismaClient.Prisma.UserCreateOrConnectWithoutAirtableTokensInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([z.lazy(() => UserCreateWithoutAirtableTokensInputSchema), z.lazy(() => UserUncheckedCreateWithoutAirtableTokensInputSchema)]),
}).strict();

export const UserUpsertWithoutAirtableTokensInputSchema: z.ZodType<PrismaClient.Prisma.UserUpsertWithoutAirtableTokensInput> = z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutAirtableTokensInputSchema), z.lazy(() => UserUncheckedUpdateWithoutAirtableTokensInputSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutAirtableTokensInputSchema), z.lazy(() => UserUncheckedCreateWithoutAirtableTokensInputSchema)]),
}).strict();

export const UserUpdateWithoutAirtableTokensInputSchema: z.ZodType<PrismaClient.Prisma.UserUpdateWithoutAirtableTokensInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  emailVerified: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  image: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  timezone: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  stripeCustomerId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isSubsribedGeneral: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isSubscribedPeriodicUpdates: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesFrequency: z.union([z.lazy(() => FrequencySchema), z.lazy(() => EnumFrequencyFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesJobId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheUpdateOneWithoutUserNestedInputSchema).optional(),
}).strict();

export const UserUncheckedUpdateWithoutAirtableTokensInputSchema: z.ZodType<PrismaClient.Prisma.UserUncheckedUpdateWithoutAirtableTokensInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  emailVerified: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  image: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  timezone: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  stripeCustomerId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isSubsribedGeneral: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isSubscribedPeriodicUpdates: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesFrequency: z.union([z.lazy(() => FrequencySchema), z.lazy(() => EnumFrequencyFieldUpdateOperationsInputSchema)]).optional(),
  periodicUpdatesJobId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  linkTokens: z.lazy(() => LinkTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  plaidItems: z.lazy(() => PlaidItemUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  airtableAuthorizationCache: z.lazy(() => AirtableAuthorizationCacheUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
}).strict();

export const DestinationCreateWithoutCodaCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateWithoutCodaCredentialInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  airtableCredential: z.lazy(() => AirtableCredentialCreateNestedOneWithoutDestinationInputSchema).optional(),
  googleSheetsCredential: z.lazy(() => GoogleSheetsCredentialCreateNestedOneWithoutDestinationInputSchema).optional(),
  notionCredential: z.lazy(() => NotionCredentialCreateNestedOneWithoutDestinationsInputSchema).optional(),
  integration: z.lazy(() => IntegrationSchema),
  name: z.string(),
  syncStartDate: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
  accounts: z.lazy(() => PlaidAccountCreateNestedManyWithoutDestinationsInputSchema).optional(),
  tableConfigs: z.lazy(() => DestinationTableConfigCreateNestedManyWithoutDestinationInputSchema).optional(),
}).strict();

export const DestinationUncheckedCreateWithoutCodaCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedCreateWithoutCodaCredentialInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  airtableCredentialId: z.string().optional().nullable(),
  googleSheetsCredentialId: z.string().optional().nullable(),
  notionCredentialId: z.string().optional().nullable(),
  integration: z.lazy(() => IntegrationSchema),
  name: z.string(),
  syncStartDate: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUncheckedCreateNestedManyWithoutDestinationsInputSchema).optional(),
  tableConfigs: z.lazy(() => DestinationTableConfigUncheckedCreateNestedManyWithoutDestinationInputSchema).optional(),
}).strict();

export const DestinationCreateOrConnectWithoutCodaCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateOrConnectWithoutCodaCredentialInput> = z.object({
  where: z.lazy(() => DestinationWhereUniqueInputSchema),
  create: z.union([z.lazy(() => DestinationCreateWithoutCodaCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutCodaCredentialInputSchema)]),
}).strict();

export const DestinationUpsertWithoutCodaCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpsertWithoutCodaCredentialInput> = z.object({
  update: z.union([z.lazy(() => DestinationUpdateWithoutCodaCredentialInputSchema), z.lazy(() => DestinationUncheckedUpdateWithoutCodaCredentialInputSchema)]),
  create: z.union([z.lazy(() => DestinationCreateWithoutCodaCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutCodaCredentialInputSchema)]),
}).strict();

export const DestinationUpdateWithoutCodaCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpdateWithoutCodaCredentialInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  airtableCredential: z.lazy(() => AirtableCredentialUpdateOneWithoutDestinationNestedInputSchema).optional(),
  googleSheetsCredential: z.lazy(() => GoogleSheetsCredentialUpdateOneWithoutDestinationNestedInputSchema).optional(),
  notionCredential: z.lazy(() => NotionCredentialUpdateOneWithoutDestinationsNestedInputSchema).optional(),
  integration: z.union([z.lazy(() => IntegrationSchema), z.lazy(() => EnumIntegrationFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  syncStartDate: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUpdateManyWithoutDestinationsNestedInputSchema).optional(),
  tableConfigs: z.lazy(() => DestinationTableConfigUpdateManyWithoutDestinationNestedInputSchema).optional(),
}).strict();

export const DestinationUncheckedUpdateWithoutCodaCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedUpdateWithoutCodaCredentialInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  airtableCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  googleSheetsCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  notionCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  integration: z.union([z.lazy(() => IntegrationSchema), z.lazy(() => EnumIntegrationFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  syncStartDate: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUncheckedUpdateManyWithoutDestinationsNestedInputSchema).optional(),
  tableConfigs: z.lazy(() => DestinationTableConfigUncheckedUpdateManyWithoutDestinationNestedInputSchema).optional(),
}).strict();

export const DestinationCreateWithoutGoogleSheetsCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateWithoutGoogleSheetsCredentialInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  airtableCredential: z.lazy(() => AirtableCredentialCreateNestedOneWithoutDestinationInputSchema).optional(),
  codaCredential: z.lazy(() => CodaCredentialCreateNestedOneWithoutDestinationInputSchema).optional(),
  notionCredential: z.lazy(() => NotionCredentialCreateNestedOneWithoutDestinationsInputSchema).optional(),
  integration: z.lazy(() => IntegrationSchema),
  name: z.string(),
  syncStartDate: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
  accounts: z.lazy(() => PlaidAccountCreateNestedManyWithoutDestinationsInputSchema).optional(),
  tableConfigs: z.lazy(() => DestinationTableConfigCreateNestedManyWithoutDestinationInputSchema).optional(),
}).strict();

export const DestinationUncheckedCreateWithoutGoogleSheetsCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedCreateWithoutGoogleSheetsCredentialInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  airtableCredentialId: z.string().optional().nullable(),
  codaCredentialId: z.string().optional().nullable(),
  notionCredentialId: z.string().optional().nullable(),
  integration: z.lazy(() => IntegrationSchema),
  name: z.string(),
  syncStartDate: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUncheckedCreateNestedManyWithoutDestinationsInputSchema).optional(),
  tableConfigs: z.lazy(() => DestinationTableConfigUncheckedCreateNestedManyWithoutDestinationInputSchema).optional(),
}).strict();

export const DestinationCreateOrConnectWithoutGoogleSheetsCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateOrConnectWithoutGoogleSheetsCredentialInput> = z.object({
  where: z.lazy(() => DestinationWhereUniqueInputSchema),
  create: z.union([z.lazy(() => DestinationCreateWithoutGoogleSheetsCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutGoogleSheetsCredentialInputSchema)]),
}).strict();

export const DestinationUpsertWithoutGoogleSheetsCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpsertWithoutGoogleSheetsCredentialInput> = z.object({
  update: z.union([z.lazy(() => DestinationUpdateWithoutGoogleSheetsCredentialInputSchema), z.lazy(() => DestinationUncheckedUpdateWithoutGoogleSheetsCredentialInputSchema)]),
  create: z.union([z.lazy(() => DestinationCreateWithoutGoogleSheetsCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutGoogleSheetsCredentialInputSchema)]),
}).strict();

export const DestinationUpdateWithoutGoogleSheetsCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpdateWithoutGoogleSheetsCredentialInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  airtableCredential: z.lazy(() => AirtableCredentialUpdateOneWithoutDestinationNestedInputSchema).optional(),
  codaCredential: z.lazy(() => CodaCredentialUpdateOneWithoutDestinationNestedInputSchema).optional(),
  notionCredential: z.lazy(() => NotionCredentialUpdateOneWithoutDestinationsNestedInputSchema).optional(),
  integration: z.union([z.lazy(() => IntegrationSchema), z.lazy(() => EnumIntegrationFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  syncStartDate: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUpdateManyWithoutDestinationsNestedInputSchema).optional(),
  tableConfigs: z.lazy(() => DestinationTableConfigUpdateManyWithoutDestinationNestedInputSchema).optional(),
}).strict();

export const DestinationUncheckedUpdateWithoutGoogleSheetsCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedUpdateWithoutGoogleSheetsCredentialInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  airtableCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  codaCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  notionCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  integration: z.union([z.lazy(() => IntegrationSchema), z.lazy(() => EnumIntegrationFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  syncStartDate: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUncheckedUpdateManyWithoutDestinationsNestedInputSchema).optional(),
  tableConfigs: z.lazy(() => DestinationTableConfigUncheckedUpdateManyWithoutDestinationNestedInputSchema).optional(),
}).strict();

export const DestinationCreateWithoutNotionCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateWithoutNotionCredentialInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  airtableCredential: z.lazy(() => AirtableCredentialCreateNestedOneWithoutDestinationInputSchema).optional(),
  codaCredential: z.lazy(() => CodaCredentialCreateNestedOneWithoutDestinationInputSchema).optional(),
  googleSheetsCredential: z.lazy(() => GoogleSheetsCredentialCreateNestedOneWithoutDestinationInputSchema).optional(),
  integration: z.lazy(() => IntegrationSchema),
  name: z.string(),
  syncStartDate: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
  accounts: z.lazy(() => PlaidAccountCreateNestedManyWithoutDestinationsInputSchema).optional(),
  tableConfigs: z.lazy(() => DestinationTableConfigCreateNestedManyWithoutDestinationInputSchema).optional(),
}).strict();

export const DestinationUncheckedCreateWithoutNotionCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedCreateWithoutNotionCredentialInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  airtableCredentialId: z.string().optional().nullable(),
  codaCredentialId: z.string().optional().nullable(),
  googleSheetsCredentialId: z.string().optional().nullable(),
  integration: z.lazy(() => IntegrationSchema),
  name: z.string(),
  syncStartDate: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUncheckedCreateNestedManyWithoutDestinationsInputSchema).optional(),
  tableConfigs: z.lazy(() => DestinationTableConfigUncheckedCreateNestedManyWithoutDestinationInputSchema).optional(),
}).strict();

export const DestinationCreateOrConnectWithoutNotionCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateOrConnectWithoutNotionCredentialInput> = z.object({
  where: z.lazy(() => DestinationWhereUniqueInputSchema),
  create: z.union([z.lazy(() => DestinationCreateWithoutNotionCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutNotionCredentialInputSchema)]),
}).strict();

export const DestinationCreateManyNotionCredentialInputEnvelopeSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateManyNotionCredentialInputEnvelope> = z.object({
  data: z.lazy(() => DestinationCreateManyNotionCredentialInputSchema).array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const DestinationUpsertWithWhereUniqueWithoutNotionCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpsertWithWhereUniqueWithoutNotionCredentialInput> = z.object({
  where: z.lazy(() => DestinationWhereUniqueInputSchema),
  update: z.union([z.lazy(() => DestinationUpdateWithoutNotionCredentialInputSchema), z.lazy(() => DestinationUncheckedUpdateWithoutNotionCredentialInputSchema)]),
  create: z.union([z.lazy(() => DestinationCreateWithoutNotionCredentialInputSchema), z.lazy(() => DestinationUncheckedCreateWithoutNotionCredentialInputSchema)]),
}).strict();

export const DestinationUpdateWithWhereUniqueWithoutNotionCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpdateWithWhereUniqueWithoutNotionCredentialInput> = z.object({
  where: z.lazy(() => DestinationWhereUniqueInputSchema),
  data: z.union([z.lazy(() => DestinationUpdateWithoutNotionCredentialInputSchema), z.lazy(() => DestinationUncheckedUpdateWithoutNotionCredentialInputSchema)]),
}).strict();

export const DestinationUpdateManyWithWhereWithoutNotionCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpdateManyWithWhereWithoutNotionCredentialInput> = z.object({
  where: z.lazy(() => DestinationScalarWhereInputSchema),
  data: z.union([z.lazy(() => DestinationUpdateManyMutationInputSchema), z.lazy(() => DestinationUncheckedUpdateManyWithoutDestinationsInputSchema)]),
}).strict();

export const LinkTokenCreateManyUserInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenCreateManyUserInput> = z.object({
  id: z.string().optional(),
  token: z.string(),
}).strict();

export const AccountCreateManyUserInputSchema: z.ZodType<PrismaClient.Prisma.AccountCreateManyUserInput> = z.object({
  id: z.string().optional(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.date().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
}).strict();

export const SessionCreateManyUserInputSchema: z.ZodType<PrismaClient.Prisma.SessionCreateManyUserInput> = z.object({
  id: z.string().optional(),
  sessionToken: z.string(),
  expires: z.date(),
}).strict();

export const PlaidItemCreateManyUserInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemCreateManyUserInput> = z.object({
  id: z.string(),
  institutionId: z.string(),
  isInitialUpdateComplete: z.boolean().optional(),
  isHistoricalUpdateComplete: z.boolean().optional(),
  error: z.string().optional().nullable(),
  accessToken: z.string(),
  plaidSyncCursor: z.string().optional().nullable(),
  availableProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  billedProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  lastSyncedAt: z.date().optional().nullable(),
  consentExpiresAt: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
}).strict();

export const AirtableTokenCreateManyUserInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenCreateManyUserInput> = z.object({
  id: z.string().optional(),
  accessToken: z.string(),
  refreshToken: z.string(),
  tokenType: z.string(),
  scope: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  refreshedAt: z.date().optional(),
  accessTokenExpiresAt: z.date(),
  refreshTokenExpiresAt: z.date(),
}).strict();

export const LinkTokenUpdateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenUpdateWithoutUserInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const LinkTokenUncheckedUpdateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const LinkTokenUncheckedUpdateManyWithoutLinkTokensInputSchema: z.ZodType<PrismaClient.Prisma.LinkTokenUncheckedUpdateManyWithoutLinkTokensInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const AccountUpdateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AccountUpdateWithoutUserInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  provider: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  providerAccountId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  refresh_token: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  access_token: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  expires_at: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  token_type: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  scope: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  id_token: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  session_state: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const AccountUncheckedUpdateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AccountUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  provider: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  providerAccountId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  refresh_token: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  access_token: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  expires_at: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  token_type: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  scope: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  id_token: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  session_state: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const AccountUncheckedUpdateManyWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.AccountUncheckedUpdateManyWithoutAccountsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  provider: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  providerAccountId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  refresh_token: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  access_token: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  expires_at: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  token_type: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  scope: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  id_token: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  session_state: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const SessionUpdateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.SessionUpdateWithoutUserInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  sessionToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  expires: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const SessionUncheckedUpdateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.SessionUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  sessionToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  expires: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const SessionUncheckedUpdateManyWithoutSessionsInputSchema: z.ZodType<PrismaClient.Prisma.SessionUncheckedUpdateManyWithoutSessionsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  sessionToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  expires: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const PlaidItemUpdateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUpdateWithoutUserInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isInitialUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isHistoricalUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  error: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  plaidSyncCursor: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  availableProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  billedProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  lastSyncedAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  consentExpiresAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  institution: z.lazy(() => PlaidInstitutionUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
  accounts: z.lazy(() => PlaidAccountUpdateManyWithoutItemNestedInputSchema).optional(),
}).strict();

export const PlaidItemUncheckedUpdateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  institutionId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isInitialUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isHistoricalUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  error: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  plaidSyncCursor: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  availableProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  billedProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  lastSyncedAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  consentExpiresAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUncheckedUpdateManyWithoutItemNestedInputSchema).optional(),
}).strict();

export const PlaidItemUncheckedUpdateManyWithoutPlaidItemsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUncheckedUpdateManyWithoutPlaidItemsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  institutionId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isInitialUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isHistoricalUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  error: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  plaidSyncCursor: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  availableProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  billedProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  lastSyncedAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  consentExpiresAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const AirtableTokenUpdateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenUpdateWithoutUserInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  refreshToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  tokenType: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  scope: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  refreshedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  accessTokenExpiresAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  refreshTokenExpiresAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const AirtableTokenUncheckedUpdateWithoutUserInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  refreshToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  tokenType: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  scope: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  refreshedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  accessTokenExpiresAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  refreshTokenExpiresAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const AirtableTokenUncheckedUpdateManyWithoutAirtableTokensInputSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenUncheckedUpdateManyWithoutAirtableTokensInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  refreshToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  tokenType: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  scope: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  refreshedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  accessTokenExpiresAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  refreshTokenExpiresAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const PlaidItemCreateManyInstitutionInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemCreateManyInstitutionInput> = z.object({
  id: z.string(),
  userId: z.string(),
  isInitialUpdateComplete: z.boolean().optional(),
  isHistoricalUpdateComplete: z.boolean().optional(),
  error: z.string().optional().nullable(),
  accessToken: z.string(),
  plaidSyncCursor: z.string().optional().nullable(),
  availableProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  billedProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]),
  lastSyncedAt: z.date().optional().nullable(),
  consentExpiresAt: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
}).strict();

export const PlaidItemUpdateWithoutInstitutionInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUpdateWithoutInstitutionInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isInitialUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isHistoricalUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  error: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  plaidSyncCursor: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  availableProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  billedProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  lastSyncedAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  consentExpiresAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutPlaidItemsNestedInputSchema).optional(),
  accounts: z.lazy(() => PlaidAccountUpdateManyWithoutItemNestedInputSchema).optional(),
}).strict();

export const PlaidItemUncheckedUpdateWithoutInstitutionInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUncheckedUpdateWithoutInstitutionInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isInitialUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isHistoricalUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  error: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  plaidSyncCursor: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  availableProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  billedProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  lastSyncedAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  consentExpiresAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUncheckedUpdateManyWithoutItemNestedInputSchema).optional(),
}).strict();

export const PlaidItemUncheckedUpdateManyWithoutItemsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUncheckedUpdateManyWithoutItemsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isInitialUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  isHistoricalUpdateComplete: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  error: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accessToken: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  plaidSyncCursor: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  availableProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  billedProducts: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValue]).optional(),
  lastSyncedAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  consentExpiresAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const PlaidAccountCreateManyItemInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountCreateManyItemInput> = z.object({
  id: z.string(),
  name: z.string(),
  mask: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).strict();

export const PlaidAccountUpdateWithoutItemInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUpdateWithoutItemInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  mask: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  destinations: z.lazy(() => DestinationUpdateManyWithoutAccountsNestedInputSchema).optional(),
}).strict();

export const PlaidAccountUncheckedUpdateWithoutItemInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUncheckedUpdateWithoutItemInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  mask: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  destinations: z.lazy(() => DestinationUncheckedUpdateManyWithoutAccountsNestedInputSchema).optional(),
}).strict();

export const PlaidAccountUncheckedUpdateManyWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUncheckedUpdateManyWithoutAccountsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  mask: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const DestinationUpdateWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpdateWithoutAccountsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  airtableCredential: z.lazy(() => AirtableCredentialUpdateOneWithoutDestinationNestedInputSchema).optional(),
  codaCredential: z.lazy(() => CodaCredentialUpdateOneWithoutDestinationNestedInputSchema).optional(),
  googleSheetsCredential: z.lazy(() => GoogleSheetsCredentialUpdateOneWithoutDestinationNestedInputSchema).optional(),
  notionCredential: z.lazy(() => NotionCredentialUpdateOneWithoutDestinationsNestedInputSchema).optional(),
  integration: z.union([z.lazy(() => IntegrationSchema), z.lazy(() => EnumIntegrationFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  syncStartDate: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  tableConfigs: z.lazy(() => DestinationTableConfigUpdateManyWithoutDestinationNestedInputSchema).optional(),
}).strict();

export const DestinationUncheckedUpdateWithoutAccountsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedUpdateWithoutAccountsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  airtableCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  codaCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  googleSheetsCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  notionCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  integration: z.union([z.lazy(() => IntegrationSchema), z.lazy(() => EnumIntegrationFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  syncStartDate: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  tableConfigs: z.lazy(() => DestinationTableConfigUncheckedUpdateManyWithoutDestinationNestedInputSchema).optional(),
}).strict();

export const DestinationUncheckedUpdateManyWithoutDestinationsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedUpdateManyWithoutDestinationsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  airtableCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  codaCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  googleSheetsCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  notionCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  integration: z.union([z.lazy(() => IntegrationSchema), z.lazy(() => EnumIntegrationFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  syncStartDate: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
}).strict();

export const DestinationTableConfigCreateManyDestinationInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigCreateManyDestinationInput> = z.object({
  id: z.string().optional(),
  isEnabled: z.boolean().optional(),
  table: z.lazy(() => TableSchema),
  tableId: z.string(),
}).strict();

export const PlaidAccountUpdateWithoutDestinationsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUpdateWithoutDestinationsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  mask: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  item: z.lazy(() => PlaidItemUpdateOneRequiredWithoutAccountsNestedInputSchema).optional(),
}).strict();

export const PlaidAccountUncheckedUpdateWithoutDestinationsInputSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUncheckedUpdateWithoutDestinationsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  plaidItemId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  mask: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const DestinationTableConfigUpdateWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigUpdateWithoutDestinationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isEnabled: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  table: z.union([z.lazy(() => TableSchema), z.lazy(() => EnumTableFieldUpdateOperationsInputSchema)]).optional(),
  tableId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  fieldConfigs: z.lazy(() => DestinationFieldConfigUpdateManyWithoutTableConfigNestedInputSchema).optional(),
}).strict();

export const DestinationTableConfigUncheckedUpdateWithoutDestinationInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigUncheckedUpdateWithoutDestinationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isEnabled: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  table: z.union([z.lazy(() => TableSchema), z.lazy(() => EnumTableFieldUpdateOperationsInputSchema)]).optional(),
  tableId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  fieldConfigs: z.lazy(() => DestinationFieldConfigUncheckedUpdateManyWithoutTableConfigNestedInputSchema).optional(),
}).strict();

export const DestinationTableConfigUncheckedUpdateManyWithoutTableConfigsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigUncheckedUpdateManyWithoutTableConfigsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isEnabled: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  table: z.union([z.lazy(() => TableSchema), z.lazy(() => EnumTableFieldUpdateOperationsInputSchema)]).optional(),
  tableId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const DestinationFieldConfigCreateManyTableConfigInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigCreateManyTableConfigInput> = z.object({
  id: z.string().optional(),
  field: z.lazy(() => FieldSchema),
  fieldId: z.string(),
}).strict();

export const DestinationFieldConfigUpdateWithoutTableConfigInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigUpdateWithoutTableConfigInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  field: z.union([z.lazy(() => FieldSchema), z.lazy(() => EnumFieldFieldUpdateOperationsInputSchema)]).optional(),
  fieldId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const DestinationFieldConfigUncheckedUpdateWithoutTableConfigInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigUncheckedUpdateWithoutTableConfigInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  field: z.union([z.lazy(() => FieldSchema), z.lazy(() => EnumFieldFieldUpdateOperationsInputSchema)]).optional(),
  fieldId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const DestinationFieldConfigUncheckedUpdateManyWithoutFieldConfigsInputSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigUncheckedUpdateManyWithoutFieldConfigsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  field: z.union([z.lazy(() => FieldSchema), z.lazy(() => EnumFieldFieldUpdateOperationsInputSchema)]).optional(),
  fieldId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
}).strict();

export const DestinationCreateManyNotionCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateManyNotionCredentialInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  airtableCredentialId: z.string().optional().nullable(),
  codaCredentialId: z.string().optional().nullable(),
  googleSheetsCredentialId: z.string().optional().nullable(),
  integration: z.lazy(() => IntegrationSchema),
  name: z.string(),
  syncStartDate: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  disabledAt: z.date().optional().nullable(),
}).strict();

export const DestinationUpdateWithoutNotionCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUpdateWithoutNotionCredentialInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  airtableCredential: z.lazy(() => AirtableCredentialUpdateOneWithoutDestinationNestedInputSchema).optional(),
  codaCredential: z.lazy(() => CodaCredentialUpdateOneWithoutDestinationNestedInputSchema).optional(),
  googleSheetsCredential: z.lazy(() => GoogleSheetsCredentialUpdateOneWithoutDestinationNestedInputSchema).optional(),
  integration: z.union([z.lazy(() => IntegrationSchema), z.lazy(() => EnumIntegrationFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  syncStartDate: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUpdateManyWithoutDestinationsNestedInputSchema).optional(),
  tableConfigs: z.lazy(() => DestinationTableConfigUpdateManyWithoutDestinationNestedInputSchema).optional(),
}).strict();

export const DestinationUncheckedUpdateWithoutNotionCredentialInputSchema: z.ZodType<PrismaClient.Prisma.DestinationUncheckedUpdateWithoutNotionCredentialInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  airtableCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  codaCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  googleSheetsCredentialId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  integration: z.union([z.lazy(() => IntegrationSchema), z.lazy(() => EnumIntegrationFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  syncStartDate: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  disabledAt: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  accounts: z.lazy(() => PlaidAccountUncheckedUpdateManyWithoutDestinationsNestedInputSchema).optional(),
  tableConfigs: z.lazy(() => DestinationTableConfigUncheckedUpdateManyWithoutDestinationNestedInputSchema).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const AccountFindFirstArgsSchema: z.ZodType<PrismaClient.Prisma.AccountFindFirstArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: AccountScalarFieldEnumSchema.array().optional(),
}).strict();

export const AccountFindFirstOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.AccountFindFirstOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: AccountScalarFieldEnumSchema.array().optional(),
}).strict();

export const AccountFindManyArgsSchema: z.ZodType<PrismaClient.Prisma.AccountFindManyArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: AccountScalarFieldEnumSchema.array().optional(),
}).strict();

export const AccountAggregateArgsSchema: z.ZodType<PrismaClient.Prisma.AccountAggregateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const AccountGroupByArgsSchema: z.ZodType<PrismaClient.Prisma.AccountGroupByArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([AccountOrderByWithAggregationInputSchema.array(), AccountOrderByWithAggregationInputSchema]).optional(),
  by: AccountScalarFieldEnumSchema.array(),
  having: AccountScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const AccountFindUniqueArgsSchema: z.ZodType<PrismaClient.Prisma.AccountFindUniqueArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict();

export const AccountFindUniqueOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.AccountFindUniqueOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict();

export const SessionFindFirstArgsSchema: z.ZodType<PrismaClient.Prisma.SessionFindFirstArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: SessionScalarFieldEnumSchema.array().optional(),
}).strict();

export const SessionFindFirstOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.SessionFindFirstOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: SessionScalarFieldEnumSchema.array().optional(),
}).strict();

export const SessionFindManyArgsSchema: z.ZodType<PrismaClient.Prisma.SessionFindManyArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: SessionScalarFieldEnumSchema.array().optional(),
}).strict();

export const SessionAggregateArgsSchema: z.ZodType<PrismaClient.Prisma.SessionAggregateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const SessionGroupByArgsSchema: z.ZodType<PrismaClient.Prisma.SessionGroupByArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([SessionOrderByWithAggregationInputSchema.array(), SessionOrderByWithAggregationInputSchema]).optional(),
  by: SessionScalarFieldEnumSchema.array(),
  having: SessionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const SessionFindUniqueArgsSchema: z.ZodType<PrismaClient.Prisma.SessionFindUniqueArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict();

export const SessionFindUniqueOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.SessionFindUniqueOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict();

export const UserFindFirstArgsSchema: z.ZodType<PrismaClient.Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: UserScalarFieldEnumSchema.array().optional(),
}).strict();

export const UserFindFirstOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: UserScalarFieldEnumSchema.array().optional(),
}).strict();

export const UserFindManyArgsSchema: z.ZodType<PrismaClient.Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: UserScalarFieldEnumSchema.array().optional(),
}).strict();

export const UserAggregateArgsSchema: z.ZodType<PrismaClient.Prisma.UserAggregateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserGroupByArgsSchema: z.ZodType<PrismaClient.Prisma.UserGroupByArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([UserOrderByWithAggregationInputSchema.array(), UserOrderByWithAggregationInputSchema]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserFindUniqueArgsSchema: z.ZodType<PrismaClient.Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict();

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict();

export const VerificationTokenFindFirstArgsSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenFindFirstArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([VerificationTokenOrderByWithRelationInputSchema.array(), VerificationTokenOrderByWithRelationInputSchema]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: VerificationTokenScalarFieldEnumSchema.array().optional(),
}).strict();

export const VerificationTokenFindFirstOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenFindFirstOrThrowArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([VerificationTokenOrderByWithRelationInputSchema.array(), VerificationTokenOrderByWithRelationInputSchema]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: VerificationTokenScalarFieldEnumSchema.array().optional(),
}).strict();

export const VerificationTokenFindManyArgsSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenFindManyArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([VerificationTokenOrderByWithRelationInputSchema.array(), VerificationTokenOrderByWithRelationInputSchema]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: VerificationTokenScalarFieldEnumSchema.array().optional(),
}).strict();

export const VerificationTokenAggregateArgsSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenAggregateArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([VerificationTokenOrderByWithRelationInputSchema.array(), VerificationTokenOrderByWithRelationInputSchema]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const VerificationTokenGroupByArgsSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenGroupByArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([VerificationTokenOrderByWithAggregationInputSchema.array(), VerificationTokenOrderByWithAggregationInputSchema]).optional(),
  by: VerificationTokenScalarFieldEnumSchema.array(),
  having: VerificationTokenScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const VerificationTokenFindUniqueArgsSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenFindUniqueArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
}).strict();

export const VerificationTokenFindUniqueOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenFindUniqueOrThrowArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
}).strict();

export const PlaidInstitutionFindFirstArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionFindFirstArgs> = z.object({
  select: PlaidInstitutionSelectSchema.optional(),
  include: PlaidInstitutionIncludeSchema.optional(),
  where: PlaidInstitutionWhereInputSchema.optional(),
  orderBy: z.union([PlaidInstitutionOrderByWithRelationInputSchema.array(), PlaidInstitutionOrderByWithRelationInputSchema]).optional(),
  cursor: PlaidInstitutionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: PlaidInstitutionScalarFieldEnumSchema.array().optional(),
}).strict();

export const PlaidInstitutionFindFirstOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionFindFirstOrThrowArgs> = z.object({
  select: PlaidInstitutionSelectSchema.optional(),
  include: PlaidInstitutionIncludeSchema.optional(),
  where: PlaidInstitutionWhereInputSchema.optional(),
  orderBy: z.union([PlaidInstitutionOrderByWithRelationInputSchema.array(), PlaidInstitutionOrderByWithRelationInputSchema]).optional(),
  cursor: PlaidInstitutionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: PlaidInstitutionScalarFieldEnumSchema.array().optional(),
}).strict();

export const PlaidInstitutionFindManyArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionFindManyArgs> = z.object({
  select: PlaidInstitutionSelectSchema.optional(),
  include: PlaidInstitutionIncludeSchema.optional(),
  where: PlaidInstitutionWhereInputSchema.optional(),
  orderBy: z.union([PlaidInstitutionOrderByWithRelationInputSchema.array(), PlaidInstitutionOrderByWithRelationInputSchema]).optional(),
  cursor: PlaidInstitutionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: PlaidInstitutionScalarFieldEnumSchema.array().optional(),
}).strict();

export const PlaidInstitutionAggregateArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionAggregateArgs> = z.object({
  select: PlaidInstitutionSelectSchema.optional(),
  include: PlaidInstitutionIncludeSchema.optional(),
  where: PlaidInstitutionWhereInputSchema.optional(),
  orderBy: z.union([PlaidInstitutionOrderByWithRelationInputSchema.array(), PlaidInstitutionOrderByWithRelationInputSchema]).optional(),
  cursor: PlaidInstitutionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const PlaidInstitutionGroupByArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionGroupByArgs> = z.object({
  select: PlaidInstitutionSelectSchema.optional(),
  include: PlaidInstitutionIncludeSchema.optional(),
  where: PlaidInstitutionWhereInputSchema.optional(),
  orderBy: z.union([PlaidInstitutionOrderByWithAggregationInputSchema.array(), PlaidInstitutionOrderByWithAggregationInputSchema]).optional(),
  by: PlaidInstitutionScalarFieldEnumSchema.array(),
  having: PlaidInstitutionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const PlaidInstitutionFindUniqueArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionFindUniqueArgs> = z.object({
  select: PlaidInstitutionSelectSchema.optional(),
  include: PlaidInstitutionIncludeSchema.optional(),
  where: PlaidInstitutionWhereUniqueInputSchema,
}).strict();

export const PlaidInstitutionFindUniqueOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionFindUniqueOrThrowArgs> = z.object({
  select: PlaidInstitutionSelectSchema.optional(),
  include: PlaidInstitutionIncludeSchema.optional(),
  where: PlaidInstitutionWhereUniqueInputSchema,
}).strict();

export const PlaidItemFindFirstArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidItemFindFirstArgs> = z.object({
  select: PlaidItemSelectSchema.optional(),
  include: PlaidItemIncludeSchema.optional(),
  where: PlaidItemWhereInputSchema.optional(),
  orderBy: z.union([PlaidItemOrderByWithRelationInputSchema.array(), PlaidItemOrderByWithRelationInputSchema]).optional(),
  cursor: PlaidItemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: PlaidItemScalarFieldEnumSchema.array().optional(),
}).strict();

export const PlaidItemFindFirstOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidItemFindFirstOrThrowArgs> = z.object({
  select: PlaidItemSelectSchema.optional(),
  include: PlaidItemIncludeSchema.optional(),
  where: PlaidItemWhereInputSchema.optional(),
  orderBy: z.union([PlaidItemOrderByWithRelationInputSchema.array(), PlaidItemOrderByWithRelationInputSchema]).optional(),
  cursor: PlaidItemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: PlaidItemScalarFieldEnumSchema.array().optional(),
}).strict();

export const PlaidItemFindManyArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidItemFindManyArgs> = z.object({
  select: PlaidItemSelectSchema.optional(),
  include: PlaidItemIncludeSchema.optional(),
  where: PlaidItemWhereInputSchema.optional(),
  orderBy: z.union([PlaidItemOrderByWithRelationInputSchema.array(), PlaidItemOrderByWithRelationInputSchema]).optional(),
  cursor: PlaidItemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: PlaidItemScalarFieldEnumSchema.array().optional(),
}).strict();

export const PlaidItemAggregateArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidItemAggregateArgs> = z.object({
  select: PlaidItemSelectSchema.optional(),
  include: PlaidItemIncludeSchema.optional(),
  where: PlaidItemWhereInputSchema.optional(),
  orderBy: z.union([PlaidItemOrderByWithRelationInputSchema.array(), PlaidItemOrderByWithRelationInputSchema]).optional(),
  cursor: PlaidItemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const PlaidItemGroupByArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidItemGroupByArgs> = z.object({
  select: PlaidItemSelectSchema.optional(),
  include: PlaidItemIncludeSchema.optional(),
  where: PlaidItemWhereInputSchema.optional(),
  orderBy: z.union([PlaidItemOrderByWithAggregationInputSchema.array(), PlaidItemOrderByWithAggregationInputSchema]).optional(),
  by: PlaidItemScalarFieldEnumSchema.array(),
  having: PlaidItemScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const PlaidItemFindUniqueArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidItemFindUniqueArgs> = z.object({
  select: PlaidItemSelectSchema.optional(),
  include: PlaidItemIncludeSchema.optional(),
  where: PlaidItemWhereUniqueInputSchema,
}).strict();

export const PlaidItemFindUniqueOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidItemFindUniqueOrThrowArgs> = z.object({
  select: PlaidItemSelectSchema.optional(),
  include: PlaidItemIncludeSchema.optional(),
  where: PlaidItemWhereUniqueInputSchema,
}).strict();

export const PlaidAccountFindFirstArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountFindFirstArgs> = z.object({
  select: PlaidAccountSelectSchema.optional(),
  include: PlaidAccountIncludeSchema.optional(),
  where: PlaidAccountWhereInputSchema.optional(),
  orderBy: z.union([PlaidAccountOrderByWithRelationInputSchema.array(), PlaidAccountOrderByWithRelationInputSchema]).optional(),
  cursor: PlaidAccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: PlaidAccountScalarFieldEnumSchema.array().optional(),
}).strict();

export const PlaidAccountFindFirstOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountFindFirstOrThrowArgs> = z.object({
  select: PlaidAccountSelectSchema.optional(),
  include: PlaidAccountIncludeSchema.optional(),
  where: PlaidAccountWhereInputSchema.optional(),
  orderBy: z.union([PlaidAccountOrderByWithRelationInputSchema.array(), PlaidAccountOrderByWithRelationInputSchema]).optional(),
  cursor: PlaidAccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: PlaidAccountScalarFieldEnumSchema.array().optional(),
}).strict();

export const PlaidAccountFindManyArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountFindManyArgs> = z.object({
  select: PlaidAccountSelectSchema.optional(),
  include: PlaidAccountIncludeSchema.optional(),
  where: PlaidAccountWhereInputSchema.optional(),
  orderBy: z.union([PlaidAccountOrderByWithRelationInputSchema.array(), PlaidAccountOrderByWithRelationInputSchema]).optional(),
  cursor: PlaidAccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: PlaidAccountScalarFieldEnumSchema.array().optional(),
}).strict();

export const PlaidAccountAggregateArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountAggregateArgs> = z.object({
  select: PlaidAccountSelectSchema.optional(),
  include: PlaidAccountIncludeSchema.optional(),
  where: PlaidAccountWhereInputSchema.optional(),
  orderBy: z.union([PlaidAccountOrderByWithRelationInputSchema.array(), PlaidAccountOrderByWithRelationInputSchema]).optional(),
  cursor: PlaidAccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const PlaidAccountGroupByArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountGroupByArgs> = z.object({
  select: PlaidAccountSelectSchema.optional(),
  include: PlaidAccountIncludeSchema.optional(),
  where: PlaidAccountWhereInputSchema.optional(),
  orderBy: z.union([PlaidAccountOrderByWithAggregationInputSchema.array(), PlaidAccountOrderByWithAggregationInputSchema]).optional(),
  by: PlaidAccountScalarFieldEnumSchema.array(),
  having: PlaidAccountScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const PlaidAccountFindUniqueArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountFindUniqueArgs> = z.object({
  select: PlaidAccountSelectSchema.optional(),
  include: PlaidAccountIncludeSchema.optional(),
  where: PlaidAccountWhereUniqueInputSchema,
}).strict();

export const PlaidAccountFindUniqueOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountFindUniqueOrThrowArgs> = z.object({
  select: PlaidAccountSelectSchema.optional(),
  include: PlaidAccountIncludeSchema.optional(),
  where: PlaidAccountWhereUniqueInputSchema,
}).strict();

export const LinkTokenFindFirstArgsSchema: z.ZodType<PrismaClient.Prisma.LinkTokenFindFirstArgs> = z.object({
  select: LinkTokenSelectSchema.optional(),
  include: LinkTokenIncludeSchema.optional(),
  where: LinkTokenWhereInputSchema.optional(),
  orderBy: z.union([LinkTokenOrderByWithRelationInputSchema.array(), LinkTokenOrderByWithRelationInputSchema]).optional(),
  cursor: LinkTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: LinkTokenScalarFieldEnumSchema.array().optional(),
}).strict();

export const LinkTokenFindFirstOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.LinkTokenFindFirstOrThrowArgs> = z.object({
  select: LinkTokenSelectSchema.optional(),
  include: LinkTokenIncludeSchema.optional(),
  where: LinkTokenWhereInputSchema.optional(),
  orderBy: z.union([LinkTokenOrderByWithRelationInputSchema.array(), LinkTokenOrderByWithRelationInputSchema]).optional(),
  cursor: LinkTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: LinkTokenScalarFieldEnumSchema.array().optional(),
}).strict();

export const LinkTokenFindManyArgsSchema: z.ZodType<PrismaClient.Prisma.LinkTokenFindManyArgs> = z.object({
  select: LinkTokenSelectSchema.optional(),
  include: LinkTokenIncludeSchema.optional(),
  where: LinkTokenWhereInputSchema.optional(),
  orderBy: z.union([LinkTokenOrderByWithRelationInputSchema.array(), LinkTokenOrderByWithRelationInputSchema]).optional(),
  cursor: LinkTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: LinkTokenScalarFieldEnumSchema.array().optional(),
}).strict();

export const LinkTokenAggregateArgsSchema: z.ZodType<PrismaClient.Prisma.LinkTokenAggregateArgs> = z.object({
  select: LinkTokenSelectSchema.optional(),
  include: LinkTokenIncludeSchema.optional(),
  where: LinkTokenWhereInputSchema.optional(),
  orderBy: z.union([LinkTokenOrderByWithRelationInputSchema.array(), LinkTokenOrderByWithRelationInputSchema]).optional(),
  cursor: LinkTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const LinkTokenGroupByArgsSchema: z.ZodType<PrismaClient.Prisma.LinkTokenGroupByArgs> = z.object({
  select: LinkTokenSelectSchema.optional(),
  include: LinkTokenIncludeSchema.optional(),
  where: LinkTokenWhereInputSchema.optional(),
  orderBy: z.union([LinkTokenOrderByWithAggregationInputSchema.array(), LinkTokenOrderByWithAggregationInputSchema]).optional(),
  by: LinkTokenScalarFieldEnumSchema.array(),
  having: LinkTokenScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const LinkTokenFindUniqueArgsSchema: z.ZodType<PrismaClient.Prisma.LinkTokenFindUniqueArgs> = z.object({
  select: LinkTokenSelectSchema.optional(),
  include: LinkTokenIncludeSchema.optional(),
  where: LinkTokenWhereUniqueInputSchema,
}).strict();

export const LinkTokenFindUniqueOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.LinkTokenFindUniqueOrThrowArgs> = z.object({
  select: LinkTokenSelectSchema.optional(),
  include: LinkTokenIncludeSchema.optional(),
  where: LinkTokenWhereUniqueInputSchema,
}).strict();

export const DestinationFindFirstArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationFindFirstArgs> = z.object({
  select: DestinationSelectSchema.optional(),
  include: DestinationIncludeSchema.optional(),
  where: DestinationWhereInputSchema.optional(),
  orderBy: z.union([DestinationOrderByWithRelationInputSchema.array(), DestinationOrderByWithRelationInputSchema]).optional(),
  cursor: DestinationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: DestinationScalarFieldEnumSchema.array().optional(),
}).strict();

export const DestinationFindFirstOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationFindFirstOrThrowArgs> = z.object({
  select: DestinationSelectSchema.optional(),
  include: DestinationIncludeSchema.optional(),
  where: DestinationWhereInputSchema.optional(),
  orderBy: z.union([DestinationOrderByWithRelationInputSchema.array(), DestinationOrderByWithRelationInputSchema]).optional(),
  cursor: DestinationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: DestinationScalarFieldEnumSchema.array().optional(),
}).strict();

export const DestinationFindManyArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationFindManyArgs> = z.object({
  select: DestinationSelectSchema.optional(),
  include: DestinationIncludeSchema.optional(),
  where: DestinationWhereInputSchema.optional(),
  orderBy: z.union([DestinationOrderByWithRelationInputSchema.array(), DestinationOrderByWithRelationInputSchema]).optional(),
  cursor: DestinationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: DestinationScalarFieldEnumSchema.array().optional(),
}).strict();

export const DestinationAggregateArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationAggregateArgs> = z.object({
  select: DestinationSelectSchema.optional(),
  include: DestinationIncludeSchema.optional(),
  where: DestinationWhereInputSchema.optional(),
  orderBy: z.union([DestinationOrderByWithRelationInputSchema.array(), DestinationOrderByWithRelationInputSchema]).optional(),
  cursor: DestinationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const DestinationGroupByArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationGroupByArgs> = z.object({
  select: DestinationSelectSchema.optional(),
  include: DestinationIncludeSchema.optional(),
  where: DestinationWhereInputSchema.optional(),
  orderBy: z.union([DestinationOrderByWithAggregationInputSchema.array(), DestinationOrderByWithAggregationInputSchema]).optional(),
  by: DestinationScalarFieldEnumSchema.array(),
  having: DestinationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const DestinationFindUniqueArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationFindUniqueArgs> = z.object({
  select: DestinationSelectSchema.optional(),
  include: DestinationIncludeSchema.optional(),
  where: DestinationWhereUniqueInputSchema,
}).strict();

export const DestinationFindUniqueOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationFindUniqueOrThrowArgs> = z.object({
  select: DestinationSelectSchema.optional(),
  include: DestinationIncludeSchema.optional(),
  where: DestinationWhereUniqueInputSchema,
}).strict();

export const DestinationTableConfigFindFirstArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigFindFirstArgs> = z.object({
  select: DestinationTableConfigSelectSchema.optional(),
  include: DestinationTableConfigIncludeSchema.optional(),
  where: DestinationTableConfigWhereInputSchema.optional(),
  orderBy: z.union([DestinationTableConfigOrderByWithRelationInputSchema.array(), DestinationTableConfigOrderByWithRelationInputSchema]).optional(),
  cursor: DestinationTableConfigWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: DestinationTableConfigScalarFieldEnumSchema.array().optional(),
}).strict();

export const DestinationTableConfigFindFirstOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigFindFirstOrThrowArgs> = z.object({
  select: DestinationTableConfigSelectSchema.optional(),
  include: DestinationTableConfigIncludeSchema.optional(),
  where: DestinationTableConfigWhereInputSchema.optional(),
  orderBy: z.union([DestinationTableConfigOrderByWithRelationInputSchema.array(), DestinationTableConfigOrderByWithRelationInputSchema]).optional(),
  cursor: DestinationTableConfigWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: DestinationTableConfigScalarFieldEnumSchema.array().optional(),
}).strict();

export const DestinationTableConfigFindManyArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigFindManyArgs> = z.object({
  select: DestinationTableConfigSelectSchema.optional(),
  include: DestinationTableConfigIncludeSchema.optional(),
  where: DestinationTableConfigWhereInputSchema.optional(),
  orderBy: z.union([DestinationTableConfigOrderByWithRelationInputSchema.array(), DestinationTableConfigOrderByWithRelationInputSchema]).optional(),
  cursor: DestinationTableConfigWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: DestinationTableConfigScalarFieldEnumSchema.array().optional(),
}).strict();

export const DestinationTableConfigAggregateArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigAggregateArgs> = z.object({
  select: DestinationTableConfigSelectSchema.optional(),
  include: DestinationTableConfigIncludeSchema.optional(),
  where: DestinationTableConfigWhereInputSchema.optional(),
  orderBy: z.union([DestinationTableConfigOrderByWithRelationInputSchema.array(), DestinationTableConfigOrderByWithRelationInputSchema]).optional(),
  cursor: DestinationTableConfigWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const DestinationTableConfigGroupByArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigGroupByArgs> = z.object({
  select: DestinationTableConfigSelectSchema.optional(),
  include: DestinationTableConfigIncludeSchema.optional(),
  where: DestinationTableConfigWhereInputSchema.optional(),
  orderBy: z.union([DestinationTableConfigOrderByWithAggregationInputSchema.array(), DestinationTableConfigOrderByWithAggregationInputSchema]).optional(),
  by: DestinationTableConfigScalarFieldEnumSchema.array(),
  having: DestinationTableConfigScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const DestinationTableConfigFindUniqueArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigFindUniqueArgs> = z.object({
  select: DestinationTableConfigSelectSchema.optional(),
  include: DestinationTableConfigIncludeSchema.optional(),
  where: DestinationTableConfigWhereUniqueInputSchema,
}).strict();

export const DestinationTableConfigFindUniqueOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigFindUniqueOrThrowArgs> = z.object({
  select: DestinationTableConfigSelectSchema.optional(),
  include: DestinationTableConfigIncludeSchema.optional(),
  where: DestinationTableConfigWhereUniqueInputSchema,
}).strict();

export const DestinationFieldConfigFindFirstArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigFindFirstArgs> = z.object({
  select: DestinationFieldConfigSelectSchema.optional(),
  include: DestinationFieldConfigIncludeSchema.optional(),
  where: DestinationFieldConfigWhereInputSchema.optional(),
  orderBy: z.union([DestinationFieldConfigOrderByWithRelationInputSchema.array(), DestinationFieldConfigOrderByWithRelationInputSchema]).optional(),
  cursor: DestinationFieldConfigWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: DestinationFieldConfigScalarFieldEnumSchema.array().optional(),
}).strict();

export const DestinationFieldConfigFindFirstOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigFindFirstOrThrowArgs> = z.object({
  select: DestinationFieldConfigSelectSchema.optional(),
  include: DestinationFieldConfigIncludeSchema.optional(),
  where: DestinationFieldConfigWhereInputSchema.optional(),
  orderBy: z.union([DestinationFieldConfigOrderByWithRelationInputSchema.array(), DestinationFieldConfigOrderByWithRelationInputSchema]).optional(),
  cursor: DestinationFieldConfigWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: DestinationFieldConfigScalarFieldEnumSchema.array().optional(),
}).strict();

export const DestinationFieldConfigFindManyArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigFindManyArgs> = z.object({
  select: DestinationFieldConfigSelectSchema.optional(),
  include: DestinationFieldConfigIncludeSchema.optional(),
  where: DestinationFieldConfigWhereInputSchema.optional(),
  orderBy: z.union([DestinationFieldConfigOrderByWithRelationInputSchema.array(), DestinationFieldConfigOrderByWithRelationInputSchema]).optional(),
  cursor: DestinationFieldConfigWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: DestinationFieldConfigScalarFieldEnumSchema.array().optional(),
}).strict();

export const DestinationFieldConfigAggregateArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigAggregateArgs> = z.object({
  select: DestinationFieldConfigSelectSchema.optional(),
  include: DestinationFieldConfigIncludeSchema.optional(),
  where: DestinationFieldConfigWhereInputSchema.optional(),
  orderBy: z.union([DestinationFieldConfigOrderByWithRelationInputSchema.array(), DestinationFieldConfigOrderByWithRelationInputSchema]).optional(),
  cursor: DestinationFieldConfigWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const DestinationFieldConfigGroupByArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigGroupByArgs> = z.object({
  select: DestinationFieldConfigSelectSchema.optional(),
  include: DestinationFieldConfigIncludeSchema.optional(),
  where: DestinationFieldConfigWhereInputSchema.optional(),
  orderBy: z.union([DestinationFieldConfigOrderByWithAggregationInputSchema.array(), DestinationFieldConfigOrderByWithAggregationInputSchema]).optional(),
  by: DestinationFieldConfigScalarFieldEnumSchema.array(),
  having: DestinationFieldConfigScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const DestinationFieldConfigFindUniqueArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigFindUniqueArgs> = z.object({
  select: DestinationFieldConfigSelectSchema.optional(),
  include: DestinationFieldConfigIncludeSchema.optional(),
  where: DestinationFieldConfigWhereUniqueInputSchema,
}).strict();

export const DestinationFieldConfigFindUniqueOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigFindUniqueOrThrowArgs> = z.object({
  select: DestinationFieldConfigSelectSchema.optional(),
  include: DestinationFieldConfigIncludeSchema.optional(),
  where: DestinationFieldConfigWhereUniqueInputSchema,
}).strict();

export const AirtableCredentialFindFirstArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialFindFirstArgs> = z.object({
  select: AirtableCredentialSelectSchema.optional(),
  include: AirtableCredentialIncludeSchema.optional(),
  where: AirtableCredentialWhereInputSchema.optional(),
  orderBy: z.union([AirtableCredentialOrderByWithRelationInputSchema.array(), AirtableCredentialOrderByWithRelationInputSchema]).optional(),
  cursor: AirtableCredentialWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: AirtableCredentialScalarFieldEnumSchema.array().optional(),
}).strict();

export const AirtableCredentialFindFirstOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialFindFirstOrThrowArgs> = z.object({
  select: AirtableCredentialSelectSchema.optional(),
  include: AirtableCredentialIncludeSchema.optional(),
  where: AirtableCredentialWhereInputSchema.optional(),
  orderBy: z.union([AirtableCredentialOrderByWithRelationInputSchema.array(), AirtableCredentialOrderByWithRelationInputSchema]).optional(),
  cursor: AirtableCredentialWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: AirtableCredentialScalarFieldEnumSchema.array().optional(),
}).strict();

export const AirtableCredentialFindManyArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialFindManyArgs> = z.object({
  select: AirtableCredentialSelectSchema.optional(),
  include: AirtableCredentialIncludeSchema.optional(),
  where: AirtableCredentialWhereInputSchema.optional(),
  orderBy: z.union([AirtableCredentialOrderByWithRelationInputSchema.array(), AirtableCredentialOrderByWithRelationInputSchema]).optional(),
  cursor: AirtableCredentialWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: AirtableCredentialScalarFieldEnumSchema.array().optional(),
}).strict();

export const AirtableCredentialAggregateArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialAggregateArgs> = z.object({
  select: AirtableCredentialSelectSchema.optional(),
  include: AirtableCredentialIncludeSchema.optional(),
  where: AirtableCredentialWhereInputSchema.optional(),
  orderBy: z.union([AirtableCredentialOrderByWithRelationInputSchema.array(), AirtableCredentialOrderByWithRelationInputSchema]).optional(),
  cursor: AirtableCredentialWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const AirtableCredentialGroupByArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialGroupByArgs> = z.object({
  select: AirtableCredentialSelectSchema.optional(),
  include: AirtableCredentialIncludeSchema.optional(),
  where: AirtableCredentialWhereInputSchema.optional(),
  orderBy: z.union([AirtableCredentialOrderByWithAggregationInputSchema.array(), AirtableCredentialOrderByWithAggregationInputSchema]).optional(),
  by: AirtableCredentialScalarFieldEnumSchema.array(),
  having: AirtableCredentialScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const AirtableCredentialFindUniqueArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialFindUniqueArgs> = z.object({
  select: AirtableCredentialSelectSchema.optional(),
  include: AirtableCredentialIncludeSchema.optional(),
  where: AirtableCredentialWhereUniqueInputSchema,
}).strict();

export const AirtableCredentialFindUniqueOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialFindUniqueOrThrowArgs> = z.object({
  select: AirtableCredentialSelectSchema.optional(),
  include: AirtableCredentialIncludeSchema.optional(),
  where: AirtableCredentialWhereUniqueInputSchema,
}).strict();

export const AirtableAuthorizationCacheFindFirstArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheFindFirstArgs> = z.object({
  select: AirtableAuthorizationCacheSelectSchema.optional(),
  include: AirtableAuthorizationCacheIncludeSchema.optional(),
  where: AirtableAuthorizationCacheWhereInputSchema.optional(),
  orderBy: z.union([AirtableAuthorizationCacheOrderByWithRelationInputSchema.array(), AirtableAuthorizationCacheOrderByWithRelationInputSchema]).optional(),
  cursor: AirtableAuthorizationCacheWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: AirtableAuthorizationCacheScalarFieldEnumSchema.array().optional(),
}).strict();

export const AirtableAuthorizationCacheFindFirstOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheFindFirstOrThrowArgs> = z.object({
  select: AirtableAuthorizationCacheSelectSchema.optional(),
  include: AirtableAuthorizationCacheIncludeSchema.optional(),
  where: AirtableAuthorizationCacheWhereInputSchema.optional(),
  orderBy: z.union([AirtableAuthorizationCacheOrderByWithRelationInputSchema.array(), AirtableAuthorizationCacheOrderByWithRelationInputSchema]).optional(),
  cursor: AirtableAuthorizationCacheWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: AirtableAuthorizationCacheScalarFieldEnumSchema.array().optional(),
}).strict();

export const AirtableAuthorizationCacheFindManyArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheFindManyArgs> = z.object({
  select: AirtableAuthorizationCacheSelectSchema.optional(),
  include: AirtableAuthorizationCacheIncludeSchema.optional(),
  where: AirtableAuthorizationCacheWhereInputSchema.optional(),
  orderBy: z.union([AirtableAuthorizationCacheOrderByWithRelationInputSchema.array(), AirtableAuthorizationCacheOrderByWithRelationInputSchema]).optional(),
  cursor: AirtableAuthorizationCacheWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: AirtableAuthorizationCacheScalarFieldEnumSchema.array().optional(),
}).strict();

export const AirtableAuthorizationCacheAggregateArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheAggregateArgs> = z.object({
  select: AirtableAuthorizationCacheSelectSchema.optional(),
  include: AirtableAuthorizationCacheIncludeSchema.optional(),
  where: AirtableAuthorizationCacheWhereInputSchema.optional(),
  orderBy: z.union([AirtableAuthorizationCacheOrderByWithRelationInputSchema.array(), AirtableAuthorizationCacheOrderByWithRelationInputSchema]).optional(),
  cursor: AirtableAuthorizationCacheWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const AirtableAuthorizationCacheGroupByArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheGroupByArgs> = z.object({
  select: AirtableAuthorizationCacheSelectSchema.optional(),
  include: AirtableAuthorizationCacheIncludeSchema.optional(),
  where: AirtableAuthorizationCacheWhereInputSchema.optional(),
  orderBy: z.union([AirtableAuthorizationCacheOrderByWithAggregationInputSchema.array(), AirtableAuthorizationCacheOrderByWithAggregationInputSchema]).optional(),
  by: AirtableAuthorizationCacheScalarFieldEnumSchema.array(),
  having: AirtableAuthorizationCacheScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const AirtableAuthorizationCacheFindUniqueArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheFindUniqueArgs> = z.object({
  select: AirtableAuthorizationCacheSelectSchema.optional(),
  include: AirtableAuthorizationCacheIncludeSchema.optional(),
  where: AirtableAuthorizationCacheWhereUniqueInputSchema,
}).strict();

export const AirtableAuthorizationCacheFindUniqueOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheFindUniqueOrThrowArgs> = z.object({
  select: AirtableAuthorizationCacheSelectSchema.optional(),
  include: AirtableAuthorizationCacheIncludeSchema.optional(),
  where: AirtableAuthorizationCacheWhereUniqueInputSchema,
}).strict();

export const AirtableTokenFindFirstArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenFindFirstArgs> = z.object({
  select: AirtableTokenSelectSchema.optional(),
  include: AirtableTokenIncludeSchema.optional(),
  where: AirtableTokenWhereInputSchema.optional(),
  orderBy: z.union([AirtableTokenOrderByWithRelationInputSchema.array(), AirtableTokenOrderByWithRelationInputSchema]).optional(),
  cursor: AirtableTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: AirtableTokenScalarFieldEnumSchema.array().optional(),
}).strict();

export const AirtableTokenFindFirstOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenFindFirstOrThrowArgs> = z.object({
  select: AirtableTokenSelectSchema.optional(),
  include: AirtableTokenIncludeSchema.optional(),
  where: AirtableTokenWhereInputSchema.optional(),
  orderBy: z.union([AirtableTokenOrderByWithRelationInputSchema.array(), AirtableTokenOrderByWithRelationInputSchema]).optional(),
  cursor: AirtableTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: AirtableTokenScalarFieldEnumSchema.array().optional(),
}).strict();

export const AirtableTokenFindManyArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenFindManyArgs> = z.object({
  select: AirtableTokenSelectSchema.optional(),
  include: AirtableTokenIncludeSchema.optional(),
  where: AirtableTokenWhereInputSchema.optional(),
  orderBy: z.union([AirtableTokenOrderByWithRelationInputSchema.array(), AirtableTokenOrderByWithRelationInputSchema]).optional(),
  cursor: AirtableTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: AirtableTokenScalarFieldEnumSchema.array().optional(),
}).strict();

export const AirtableTokenAggregateArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenAggregateArgs> = z.object({
  select: AirtableTokenSelectSchema.optional(),
  include: AirtableTokenIncludeSchema.optional(),
  where: AirtableTokenWhereInputSchema.optional(),
  orderBy: z.union([AirtableTokenOrderByWithRelationInputSchema.array(), AirtableTokenOrderByWithRelationInputSchema]).optional(),
  cursor: AirtableTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const AirtableTokenGroupByArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenGroupByArgs> = z.object({
  select: AirtableTokenSelectSchema.optional(),
  include: AirtableTokenIncludeSchema.optional(),
  where: AirtableTokenWhereInputSchema.optional(),
  orderBy: z.union([AirtableTokenOrderByWithAggregationInputSchema.array(), AirtableTokenOrderByWithAggregationInputSchema]).optional(),
  by: AirtableTokenScalarFieldEnumSchema.array(),
  having: AirtableTokenScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const AirtableTokenFindUniqueArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenFindUniqueArgs> = z.object({
  select: AirtableTokenSelectSchema.optional(),
  include: AirtableTokenIncludeSchema.optional(),
  where: AirtableTokenWhereUniqueInputSchema,
}).strict();

export const AirtableTokenFindUniqueOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenFindUniqueOrThrowArgs> = z.object({
  select: AirtableTokenSelectSchema.optional(),
  include: AirtableTokenIncludeSchema.optional(),
  where: AirtableTokenWhereUniqueInputSchema,
}).strict();

export const CodaCredentialFindFirstArgsSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialFindFirstArgs> = z.object({
  select: CodaCredentialSelectSchema.optional(),
  include: CodaCredentialIncludeSchema.optional(),
  where: CodaCredentialWhereInputSchema.optional(),
  orderBy: z.union([CodaCredentialOrderByWithRelationInputSchema.array(), CodaCredentialOrderByWithRelationInputSchema]).optional(),
  cursor: CodaCredentialWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: CodaCredentialScalarFieldEnumSchema.array().optional(),
}).strict();

export const CodaCredentialFindFirstOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialFindFirstOrThrowArgs> = z.object({
  select: CodaCredentialSelectSchema.optional(),
  include: CodaCredentialIncludeSchema.optional(),
  where: CodaCredentialWhereInputSchema.optional(),
  orderBy: z.union([CodaCredentialOrderByWithRelationInputSchema.array(), CodaCredentialOrderByWithRelationInputSchema]).optional(),
  cursor: CodaCredentialWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: CodaCredentialScalarFieldEnumSchema.array().optional(),
}).strict();

export const CodaCredentialFindManyArgsSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialFindManyArgs> = z.object({
  select: CodaCredentialSelectSchema.optional(),
  include: CodaCredentialIncludeSchema.optional(),
  where: CodaCredentialWhereInputSchema.optional(),
  orderBy: z.union([CodaCredentialOrderByWithRelationInputSchema.array(), CodaCredentialOrderByWithRelationInputSchema]).optional(),
  cursor: CodaCredentialWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: CodaCredentialScalarFieldEnumSchema.array().optional(),
}).strict();

export const CodaCredentialAggregateArgsSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialAggregateArgs> = z.object({
  select: CodaCredentialSelectSchema.optional(),
  include: CodaCredentialIncludeSchema.optional(),
  where: CodaCredentialWhereInputSchema.optional(),
  orderBy: z.union([CodaCredentialOrderByWithRelationInputSchema.array(), CodaCredentialOrderByWithRelationInputSchema]).optional(),
  cursor: CodaCredentialWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CodaCredentialGroupByArgsSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialGroupByArgs> = z.object({
  select: CodaCredentialSelectSchema.optional(),
  include: CodaCredentialIncludeSchema.optional(),
  where: CodaCredentialWhereInputSchema.optional(),
  orderBy: z.union([CodaCredentialOrderByWithAggregationInputSchema.array(), CodaCredentialOrderByWithAggregationInputSchema]).optional(),
  by: CodaCredentialScalarFieldEnumSchema.array(),
  having: CodaCredentialScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CodaCredentialFindUniqueArgsSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialFindUniqueArgs> = z.object({
  select: CodaCredentialSelectSchema.optional(),
  include: CodaCredentialIncludeSchema.optional(),
  where: CodaCredentialWhereUniqueInputSchema,
}).strict();

export const CodaCredentialFindUniqueOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialFindUniqueOrThrowArgs> = z.object({
  select: CodaCredentialSelectSchema.optional(),
  include: CodaCredentialIncludeSchema.optional(),
  where: CodaCredentialWhereUniqueInputSchema,
}).strict();

export const GoogleSheetsCredentialFindFirstArgsSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialFindFirstArgs> = z.object({
  select: GoogleSheetsCredentialSelectSchema.optional(),
  include: GoogleSheetsCredentialIncludeSchema.optional(),
  where: GoogleSheetsCredentialWhereInputSchema.optional(),
  orderBy: z.union([GoogleSheetsCredentialOrderByWithRelationInputSchema.array(), GoogleSheetsCredentialOrderByWithRelationInputSchema]).optional(),
  cursor: GoogleSheetsCredentialWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: GoogleSheetsCredentialScalarFieldEnumSchema.array().optional(),
}).strict();

export const GoogleSheetsCredentialFindFirstOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialFindFirstOrThrowArgs> = z.object({
  select: GoogleSheetsCredentialSelectSchema.optional(),
  include: GoogleSheetsCredentialIncludeSchema.optional(),
  where: GoogleSheetsCredentialWhereInputSchema.optional(),
  orderBy: z.union([GoogleSheetsCredentialOrderByWithRelationInputSchema.array(), GoogleSheetsCredentialOrderByWithRelationInputSchema]).optional(),
  cursor: GoogleSheetsCredentialWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: GoogleSheetsCredentialScalarFieldEnumSchema.array().optional(),
}).strict();

export const GoogleSheetsCredentialFindManyArgsSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialFindManyArgs> = z.object({
  select: GoogleSheetsCredentialSelectSchema.optional(),
  include: GoogleSheetsCredentialIncludeSchema.optional(),
  where: GoogleSheetsCredentialWhereInputSchema.optional(),
  orderBy: z.union([GoogleSheetsCredentialOrderByWithRelationInputSchema.array(), GoogleSheetsCredentialOrderByWithRelationInputSchema]).optional(),
  cursor: GoogleSheetsCredentialWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: GoogleSheetsCredentialScalarFieldEnumSchema.array().optional(),
}).strict();

export const GoogleSheetsCredentialAggregateArgsSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialAggregateArgs> = z.object({
  select: GoogleSheetsCredentialSelectSchema.optional(),
  include: GoogleSheetsCredentialIncludeSchema.optional(),
  where: GoogleSheetsCredentialWhereInputSchema.optional(),
  orderBy: z.union([GoogleSheetsCredentialOrderByWithRelationInputSchema.array(), GoogleSheetsCredentialOrderByWithRelationInputSchema]).optional(),
  cursor: GoogleSheetsCredentialWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const GoogleSheetsCredentialGroupByArgsSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialGroupByArgs> = z.object({
  select: GoogleSheetsCredentialSelectSchema.optional(),
  include: GoogleSheetsCredentialIncludeSchema.optional(),
  where: GoogleSheetsCredentialWhereInputSchema.optional(),
  orderBy: z.union([GoogleSheetsCredentialOrderByWithAggregationInputSchema.array(), GoogleSheetsCredentialOrderByWithAggregationInputSchema]).optional(),
  by: GoogleSheetsCredentialScalarFieldEnumSchema.array(),
  having: GoogleSheetsCredentialScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const GoogleSheetsCredentialFindUniqueArgsSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialFindUniqueArgs> = z.object({
  select: GoogleSheetsCredentialSelectSchema.optional(),
  include: GoogleSheetsCredentialIncludeSchema.optional(),
  where: GoogleSheetsCredentialWhereUniqueInputSchema,
}).strict();

export const GoogleSheetsCredentialFindUniqueOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialFindUniqueOrThrowArgs> = z.object({
  select: GoogleSheetsCredentialSelectSchema.optional(),
  include: GoogleSheetsCredentialIncludeSchema.optional(),
  where: GoogleSheetsCredentialWhereUniqueInputSchema,
}).strict();

export const NotionCredentialFindFirstArgsSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialFindFirstArgs> = z.object({
  select: NotionCredentialSelectSchema.optional(),
  include: NotionCredentialIncludeSchema.optional(),
  where: NotionCredentialWhereInputSchema.optional(),
  orderBy: z.union([NotionCredentialOrderByWithRelationInputSchema.array(), NotionCredentialOrderByWithRelationInputSchema]).optional(),
  cursor: NotionCredentialWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: NotionCredentialScalarFieldEnumSchema.array().optional(),
}).strict();

export const NotionCredentialFindFirstOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialFindFirstOrThrowArgs> = z.object({
  select: NotionCredentialSelectSchema.optional(),
  include: NotionCredentialIncludeSchema.optional(),
  where: NotionCredentialWhereInputSchema.optional(),
  orderBy: z.union([NotionCredentialOrderByWithRelationInputSchema.array(), NotionCredentialOrderByWithRelationInputSchema]).optional(),
  cursor: NotionCredentialWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: NotionCredentialScalarFieldEnumSchema.array().optional(),
}).strict();

export const NotionCredentialFindManyArgsSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialFindManyArgs> = z.object({
  select: NotionCredentialSelectSchema.optional(),
  include: NotionCredentialIncludeSchema.optional(),
  where: NotionCredentialWhereInputSchema.optional(),
  orderBy: z.union([NotionCredentialOrderByWithRelationInputSchema.array(), NotionCredentialOrderByWithRelationInputSchema]).optional(),
  cursor: NotionCredentialWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: NotionCredentialScalarFieldEnumSchema.array().optional(),
}).strict();

export const NotionCredentialAggregateArgsSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialAggregateArgs> = z.object({
  select: NotionCredentialSelectSchema.optional(),
  include: NotionCredentialIncludeSchema.optional(),
  where: NotionCredentialWhereInputSchema.optional(),
  orderBy: z.union([NotionCredentialOrderByWithRelationInputSchema.array(), NotionCredentialOrderByWithRelationInputSchema]).optional(),
  cursor: NotionCredentialWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const NotionCredentialGroupByArgsSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialGroupByArgs> = z.object({
  select: NotionCredentialSelectSchema.optional(),
  include: NotionCredentialIncludeSchema.optional(),
  where: NotionCredentialWhereInputSchema.optional(),
  orderBy: z.union([NotionCredentialOrderByWithAggregationInputSchema.array(), NotionCredentialOrderByWithAggregationInputSchema]).optional(),
  by: NotionCredentialScalarFieldEnumSchema.array(),
  having: NotionCredentialScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const NotionCredentialFindUniqueArgsSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialFindUniqueArgs> = z.object({
  select: NotionCredentialSelectSchema.optional(),
  include: NotionCredentialIncludeSchema.optional(),
  where: NotionCredentialWhereUniqueInputSchema,
}).strict();

export const NotionCredentialFindUniqueOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialFindUniqueOrThrowArgs> = z.object({
  select: NotionCredentialSelectSchema.optional(),
  include: NotionCredentialIncludeSchema.optional(),
  where: NotionCredentialWhereUniqueInputSchema,
}).strict();

export const SyncLogFindFirstArgsSchema: z.ZodType<PrismaClient.Prisma.SyncLogFindFirstArgs> = z.object({
  select: SyncLogSelectSchema.optional(),
  where: SyncLogWhereInputSchema.optional(),
  orderBy: z.union([SyncLogOrderByWithRelationInputSchema.array(), SyncLogOrderByWithRelationInputSchema]).optional(),
  cursor: SyncLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: SyncLogScalarFieldEnumSchema.array().optional(),
}).strict();

export const SyncLogFindFirstOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.SyncLogFindFirstOrThrowArgs> = z.object({
  select: SyncLogSelectSchema.optional(),
  where: SyncLogWhereInputSchema.optional(),
  orderBy: z.union([SyncLogOrderByWithRelationInputSchema.array(), SyncLogOrderByWithRelationInputSchema]).optional(),
  cursor: SyncLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: SyncLogScalarFieldEnumSchema.array().optional(),
}).strict();

export const SyncLogFindManyArgsSchema: z.ZodType<PrismaClient.Prisma.SyncLogFindManyArgs> = z.object({
  select: SyncLogSelectSchema.optional(),
  where: SyncLogWhereInputSchema.optional(),
  orderBy: z.union([SyncLogOrderByWithRelationInputSchema.array(), SyncLogOrderByWithRelationInputSchema]).optional(),
  cursor: SyncLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: SyncLogScalarFieldEnumSchema.array().optional(),
}).strict();

export const SyncLogAggregateArgsSchema: z.ZodType<PrismaClient.Prisma.SyncLogAggregateArgs> = z.object({
  select: SyncLogSelectSchema.optional(),
  where: SyncLogWhereInputSchema.optional(),
  orderBy: z.union([SyncLogOrderByWithRelationInputSchema.array(), SyncLogOrderByWithRelationInputSchema]).optional(),
  cursor: SyncLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const SyncLogGroupByArgsSchema: z.ZodType<PrismaClient.Prisma.SyncLogGroupByArgs> = z.object({
  select: SyncLogSelectSchema.optional(),
  where: SyncLogWhereInputSchema.optional(),
  orderBy: z.union([SyncLogOrderByWithAggregationInputSchema.array(), SyncLogOrderByWithAggregationInputSchema]).optional(),
  by: SyncLogScalarFieldEnumSchema.array(),
  having: SyncLogScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const SyncLogFindUniqueArgsSchema: z.ZodType<PrismaClient.Prisma.SyncLogFindUniqueArgs> = z.object({
  select: SyncLogSelectSchema.optional(),
  where: SyncLogWhereUniqueInputSchema,
}).strict();

export const SyncLogFindUniqueOrThrowArgsSchema: z.ZodType<PrismaClient.Prisma.SyncLogFindUniqueOrThrowArgs> = z.object({
  select: SyncLogSelectSchema.optional(),
  where: SyncLogWhereUniqueInputSchema,
}).strict();

export const AccountCreateArgsSchema: z.ZodType<PrismaClient.Prisma.AccountCreateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([AccountCreateInputSchema, AccountUncheckedCreateInputSchema]),
}).strict();

export const AccountUpsertArgsSchema: z.ZodType<PrismaClient.Prisma.AccountUpsertArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
  create: z.union([AccountCreateInputSchema, AccountUncheckedCreateInputSchema]),
  update: z.union([AccountUpdateInputSchema, AccountUncheckedUpdateInputSchema]),
}).strict();

export const AccountCreateManyArgsSchema: z.ZodType<PrismaClient.Prisma.AccountCreateManyArgs> = z.object({
  data: AccountCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const AccountDeleteArgsSchema: z.ZodType<PrismaClient.Prisma.AccountDeleteArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict();

export const AccountUpdateArgsSchema: z.ZodType<PrismaClient.Prisma.AccountUpdateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([AccountUpdateInputSchema, AccountUncheckedUpdateInputSchema]),
  where: AccountWhereUniqueInputSchema,
}).strict();

export const AccountUpdateManyArgsSchema: z.ZodType<PrismaClient.Prisma.AccountUpdateManyArgs> = z.object({
  data: z.union([AccountUpdateManyMutationInputSchema, AccountUncheckedUpdateManyInputSchema]),
  where: AccountWhereInputSchema.optional(),
}).strict();

export const AccountDeleteManyArgsSchema: z.ZodType<PrismaClient.Prisma.AccountDeleteManyArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
}).strict();

export const SessionCreateArgsSchema: z.ZodType<PrismaClient.Prisma.SessionCreateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([SessionCreateInputSchema, SessionUncheckedCreateInputSchema]),
}).strict();

export const SessionUpsertArgsSchema: z.ZodType<PrismaClient.Prisma.SessionUpsertArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
  create: z.union([SessionCreateInputSchema, SessionUncheckedCreateInputSchema]),
  update: z.union([SessionUpdateInputSchema, SessionUncheckedUpdateInputSchema]),
}).strict();

export const SessionCreateManyArgsSchema: z.ZodType<PrismaClient.Prisma.SessionCreateManyArgs> = z.object({
  data: SessionCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const SessionDeleteArgsSchema: z.ZodType<PrismaClient.Prisma.SessionDeleteArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict();

export const SessionUpdateArgsSchema: z.ZodType<PrismaClient.Prisma.SessionUpdateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([SessionUpdateInputSchema, SessionUncheckedUpdateInputSchema]),
  where: SessionWhereUniqueInputSchema,
}).strict();

export const SessionUpdateManyArgsSchema: z.ZodType<PrismaClient.Prisma.SessionUpdateManyArgs> = z.object({
  data: z.union([SessionUpdateManyMutationInputSchema, SessionUncheckedUpdateManyInputSchema]),
  where: SessionWhereInputSchema.optional(),
}).strict();

export const SessionDeleteManyArgsSchema: z.ZodType<PrismaClient.Prisma.SessionDeleteManyArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
}).strict();

export const UserCreateArgsSchema: z.ZodType<PrismaClient.Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([UserCreateInputSchema, UserUncheckedCreateInputSchema]),
}).strict();

export const UserUpsertArgsSchema: z.ZodType<PrismaClient.Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([UserCreateInputSchema, UserUncheckedCreateInputSchema]),
  update: z.union([UserUpdateInputSchema, UserUncheckedUpdateInputSchema]),
}).strict();

export const UserCreateManyArgsSchema: z.ZodType<PrismaClient.Prisma.UserCreateManyArgs> = z.object({
  data: UserCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserDeleteArgsSchema: z.ZodType<PrismaClient.Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict();

export const UserUpdateArgsSchema: z.ZodType<PrismaClient.Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([UserUpdateInputSchema, UserUncheckedUpdateInputSchema]),
  where: UserWhereUniqueInputSchema,
}).strict();

export const UserUpdateManyArgsSchema: z.ZodType<PrismaClient.Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema]),
  where: UserWhereInputSchema.optional(),
}).strict();

export const UserDeleteManyArgsSchema: z.ZodType<PrismaClient.Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict();

export const VerificationTokenCreateArgsSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenCreateArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  data: z.union([VerificationTokenCreateInputSchema, VerificationTokenUncheckedCreateInputSchema]),
}).strict();

export const VerificationTokenUpsertArgsSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenUpsertArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
  create: z.union([VerificationTokenCreateInputSchema, VerificationTokenUncheckedCreateInputSchema]),
  update: z.union([VerificationTokenUpdateInputSchema, VerificationTokenUncheckedUpdateInputSchema]),
}).strict();

export const VerificationTokenCreateManyArgsSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenCreateManyArgs> = z.object({
  data: VerificationTokenCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const VerificationTokenDeleteArgsSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenDeleteArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
}).strict();

export const VerificationTokenUpdateArgsSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenUpdateArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  data: z.union([VerificationTokenUpdateInputSchema, VerificationTokenUncheckedUpdateInputSchema]),
  where: VerificationTokenWhereUniqueInputSchema,
}).strict();

export const VerificationTokenUpdateManyArgsSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenUpdateManyArgs> = z.object({
  data: z.union([VerificationTokenUpdateManyMutationInputSchema, VerificationTokenUncheckedUpdateManyInputSchema]),
  where: VerificationTokenWhereInputSchema.optional(),
}).strict();

export const VerificationTokenDeleteManyArgsSchema: z.ZodType<PrismaClient.Prisma.VerificationTokenDeleteManyArgs> = z.object({
  where: VerificationTokenWhereInputSchema.optional(),
}).strict();

export const PlaidInstitutionCreateArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionCreateArgs> = z.object({
  select: PlaidInstitutionSelectSchema.optional(),
  include: PlaidInstitutionIncludeSchema.optional(),
  data: z.union([PlaidInstitutionCreateInputSchema, PlaidInstitutionUncheckedCreateInputSchema]),
}).strict();

export const PlaidInstitutionUpsertArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionUpsertArgs> = z.object({
  select: PlaidInstitutionSelectSchema.optional(),
  include: PlaidInstitutionIncludeSchema.optional(),
  where: PlaidInstitutionWhereUniqueInputSchema,
  create: z.union([PlaidInstitutionCreateInputSchema, PlaidInstitutionUncheckedCreateInputSchema]),
  update: z.union([PlaidInstitutionUpdateInputSchema, PlaidInstitutionUncheckedUpdateInputSchema]),
}).strict();

export const PlaidInstitutionCreateManyArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionCreateManyArgs> = z.object({
  data: PlaidInstitutionCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const PlaidInstitutionDeleteArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionDeleteArgs> = z.object({
  select: PlaidInstitutionSelectSchema.optional(),
  include: PlaidInstitutionIncludeSchema.optional(),
  where: PlaidInstitutionWhereUniqueInputSchema,
}).strict();

export const PlaidInstitutionUpdateArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionUpdateArgs> = z.object({
  select: PlaidInstitutionSelectSchema.optional(),
  include: PlaidInstitutionIncludeSchema.optional(),
  data: z.union([PlaidInstitutionUpdateInputSchema, PlaidInstitutionUncheckedUpdateInputSchema]),
  where: PlaidInstitutionWhereUniqueInputSchema,
}).strict();

export const PlaidInstitutionUpdateManyArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionUpdateManyArgs> = z.object({
  data: z.union([PlaidInstitutionUpdateManyMutationInputSchema, PlaidInstitutionUncheckedUpdateManyInputSchema]),
  where: PlaidInstitutionWhereInputSchema.optional(),
}).strict();

export const PlaidInstitutionDeleteManyArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidInstitutionDeleteManyArgs> = z.object({
  where: PlaidInstitutionWhereInputSchema.optional(),
}).strict();

export const PlaidItemCreateArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidItemCreateArgs> = z.object({
  select: PlaidItemSelectSchema.optional(),
  include: PlaidItemIncludeSchema.optional(),
  data: z.union([PlaidItemCreateInputSchema, PlaidItemUncheckedCreateInputSchema]),
}).strict();

export const PlaidItemUpsertArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUpsertArgs> = z.object({
  select: PlaidItemSelectSchema.optional(),
  include: PlaidItemIncludeSchema.optional(),
  where: PlaidItemWhereUniqueInputSchema,
  create: z.union([PlaidItemCreateInputSchema, PlaidItemUncheckedCreateInputSchema]),
  update: z.union([PlaidItemUpdateInputSchema, PlaidItemUncheckedUpdateInputSchema]),
}).strict();

export const PlaidItemCreateManyArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidItemCreateManyArgs> = z.object({
  data: PlaidItemCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const PlaidItemDeleteArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidItemDeleteArgs> = z.object({
  select: PlaidItemSelectSchema.optional(),
  include: PlaidItemIncludeSchema.optional(),
  where: PlaidItemWhereUniqueInputSchema,
}).strict();

export const PlaidItemUpdateArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUpdateArgs> = z.object({
  select: PlaidItemSelectSchema.optional(),
  include: PlaidItemIncludeSchema.optional(),
  data: z.union([PlaidItemUpdateInputSchema, PlaidItemUncheckedUpdateInputSchema]),
  where: PlaidItemWhereUniqueInputSchema,
}).strict();

export const PlaidItemUpdateManyArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidItemUpdateManyArgs> = z.object({
  data: z.union([PlaidItemUpdateManyMutationInputSchema, PlaidItemUncheckedUpdateManyInputSchema]),
  where: PlaidItemWhereInputSchema.optional(),
}).strict();

export const PlaidItemDeleteManyArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidItemDeleteManyArgs> = z.object({
  where: PlaidItemWhereInputSchema.optional(),
}).strict();

export const PlaidAccountCreateArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountCreateArgs> = z.object({
  select: PlaidAccountSelectSchema.optional(),
  include: PlaidAccountIncludeSchema.optional(),
  data: z.union([PlaidAccountCreateInputSchema, PlaidAccountUncheckedCreateInputSchema]),
}).strict();

export const PlaidAccountUpsertArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUpsertArgs> = z.object({
  select: PlaidAccountSelectSchema.optional(),
  include: PlaidAccountIncludeSchema.optional(),
  where: PlaidAccountWhereUniqueInputSchema,
  create: z.union([PlaidAccountCreateInputSchema, PlaidAccountUncheckedCreateInputSchema]),
  update: z.union([PlaidAccountUpdateInputSchema, PlaidAccountUncheckedUpdateInputSchema]),
}).strict();

export const PlaidAccountCreateManyArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountCreateManyArgs> = z.object({
  data: PlaidAccountCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const PlaidAccountDeleteArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountDeleteArgs> = z.object({
  select: PlaidAccountSelectSchema.optional(),
  include: PlaidAccountIncludeSchema.optional(),
  where: PlaidAccountWhereUniqueInputSchema,
}).strict();

export const PlaidAccountUpdateArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUpdateArgs> = z.object({
  select: PlaidAccountSelectSchema.optional(),
  include: PlaidAccountIncludeSchema.optional(),
  data: z.union([PlaidAccountUpdateInputSchema, PlaidAccountUncheckedUpdateInputSchema]),
  where: PlaidAccountWhereUniqueInputSchema,
}).strict();

export const PlaidAccountUpdateManyArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountUpdateManyArgs> = z.object({
  data: z.union([PlaidAccountUpdateManyMutationInputSchema, PlaidAccountUncheckedUpdateManyInputSchema]),
  where: PlaidAccountWhereInputSchema.optional(),
}).strict();

export const PlaidAccountDeleteManyArgsSchema: z.ZodType<PrismaClient.Prisma.PlaidAccountDeleteManyArgs> = z.object({
  where: PlaidAccountWhereInputSchema.optional(),
}).strict();

export const LinkTokenCreateArgsSchema: z.ZodType<PrismaClient.Prisma.LinkTokenCreateArgs> = z.object({
  select: LinkTokenSelectSchema.optional(),
  include: LinkTokenIncludeSchema.optional(),
  data: z.union([LinkTokenCreateInputSchema, LinkTokenUncheckedCreateInputSchema]),
}).strict();

export const LinkTokenUpsertArgsSchema: z.ZodType<PrismaClient.Prisma.LinkTokenUpsertArgs> = z.object({
  select: LinkTokenSelectSchema.optional(),
  include: LinkTokenIncludeSchema.optional(),
  where: LinkTokenWhereUniqueInputSchema,
  create: z.union([LinkTokenCreateInputSchema, LinkTokenUncheckedCreateInputSchema]),
  update: z.union([LinkTokenUpdateInputSchema, LinkTokenUncheckedUpdateInputSchema]),
}).strict();

export const LinkTokenCreateManyArgsSchema: z.ZodType<PrismaClient.Prisma.LinkTokenCreateManyArgs> = z.object({
  data: LinkTokenCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const LinkTokenDeleteArgsSchema: z.ZodType<PrismaClient.Prisma.LinkTokenDeleteArgs> = z.object({
  select: LinkTokenSelectSchema.optional(),
  include: LinkTokenIncludeSchema.optional(),
  where: LinkTokenWhereUniqueInputSchema,
}).strict();

export const LinkTokenUpdateArgsSchema: z.ZodType<PrismaClient.Prisma.LinkTokenUpdateArgs> = z.object({
  select: LinkTokenSelectSchema.optional(),
  include: LinkTokenIncludeSchema.optional(),
  data: z.union([LinkTokenUpdateInputSchema, LinkTokenUncheckedUpdateInputSchema]),
  where: LinkTokenWhereUniqueInputSchema,
}).strict();

export const LinkTokenUpdateManyArgsSchema: z.ZodType<PrismaClient.Prisma.LinkTokenUpdateManyArgs> = z.object({
  data: z.union([LinkTokenUpdateManyMutationInputSchema, LinkTokenUncheckedUpdateManyInputSchema]),
  where: LinkTokenWhereInputSchema.optional(),
}).strict();

export const LinkTokenDeleteManyArgsSchema: z.ZodType<PrismaClient.Prisma.LinkTokenDeleteManyArgs> = z.object({
  where: LinkTokenWhereInputSchema.optional(),
}).strict();

export const DestinationCreateArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateArgs> = z.object({
  select: DestinationSelectSchema.optional(),
  include: DestinationIncludeSchema.optional(),
  data: z.union([DestinationCreateInputSchema, DestinationUncheckedCreateInputSchema]),
}).strict();

export const DestinationUpsertArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationUpsertArgs> = z.object({
  select: DestinationSelectSchema.optional(),
  include: DestinationIncludeSchema.optional(),
  where: DestinationWhereUniqueInputSchema,
  create: z.union([DestinationCreateInputSchema, DestinationUncheckedCreateInputSchema]),
  update: z.union([DestinationUpdateInputSchema, DestinationUncheckedUpdateInputSchema]),
}).strict();

export const DestinationCreateManyArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationCreateManyArgs> = z.object({
  data: DestinationCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const DestinationDeleteArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationDeleteArgs> = z.object({
  select: DestinationSelectSchema.optional(),
  include: DestinationIncludeSchema.optional(),
  where: DestinationWhereUniqueInputSchema,
}).strict();

export const DestinationUpdateArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationUpdateArgs> = z.object({
  select: DestinationSelectSchema.optional(),
  include: DestinationIncludeSchema.optional(),
  data: z.union([DestinationUpdateInputSchema, DestinationUncheckedUpdateInputSchema]),
  where: DestinationWhereUniqueInputSchema,
}).strict();

export const DestinationUpdateManyArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationUpdateManyArgs> = z.object({
  data: z.union([DestinationUpdateManyMutationInputSchema, DestinationUncheckedUpdateManyInputSchema]),
  where: DestinationWhereInputSchema.optional(),
}).strict();

export const DestinationDeleteManyArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationDeleteManyArgs> = z.object({
  where: DestinationWhereInputSchema.optional(),
}).strict();

export const DestinationTableConfigCreateArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigCreateArgs> = z.object({
  select: DestinationTableConfigSelectSchema.optional(),
  include: DestinationTableConfigIncludeSchema.optional(),
  data: z.union([DestinationTableConfigCreateInputSchema, DestinationTableConfigUncheckedCreateInputSchema]),
}).strict();

export const DestinationTableConfigUpsertArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigUpsertArgs> = z.object({
  select: DestinationTableConfigSelectSchema.optional(),
  include: DestinationTableConfigIncludeSchema.optional(),
  where: DestinationTableConfigWhereUniqueInputSchema,
  create: z.union([DestinationTableConfigCreateInputSchema, DestinationTableConfigUncheckedCreateInputSchema]),
  update: z.union([DestinationTableConfigUpdateInputSchema, DestinationTableConfigUncheckedUpdateInputSchema]),
}).strict();

export const DestinationTableConfigCreateManyArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigCreateManyArgs> = z.object({
  data: DestinationTableConfigCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const DestinationTableConfigDeleteArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigDeleteArgs> = z.object({
  select: DestinationTableConfigSelectSchema.optional(),
  include: DestinationTableConfigIncludeSchema.optional(),
  where: DestinationTableConfigWhereUniqueInputSchema,
}).strict();

export const DestinationTableConfigUpdateArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigUpdateArgs> = z.object({
  select: DestinationTableConfigSelectSchema.optional(),
  include: DestinationTableConfigIncludeSchema.optional(),
  data: z.union([DestinationTableConfigUpdateInputSchema, DestinationTableConfigUncheckedUpdateInputSchema]),
  where: DestinationTableConfigWhereUniqueInputSchema,
}).strict();

export const DestinationTableConfigUpdateManyArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigUpdateManyArgs> = z.object({
  data: z.union([DestinationTableConfigUpdateManyMutationInputSchema, DestinationTableConfigUncheckedUpdateManyInputSchema]),
  where: DestinationTableConfigWhereInputSchema.optional(),
}).strict();

export const DestinationTableConfigDeleteManyArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationTableConfigDeleteManyArgs> = z.object({
  where: DestinationTableConfigWhereInputSchema.optional(),
}).strict();

export const DestinationFieldConfigCreateArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigCreateArgs> = z.object({
  select: DestinationFieldConfigSelectSchema.optional(),
  include: DestinationFieldConfigIncludeSchema.optional(),
  data: z.union([DestinationFieldConfigCreateInputSchema, DestinationFieldConfigUncheckedCreateInputSchema]),
}).strict();

export const DestinationFieldConfigUpsertArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigUpsertArgs> = z.object({
  select: DestinationFieldConfigSelectSchema.optional(),
  include: DestinationFieldConfigIncludeSchema.optional(),
  where: DestinationFieldConfigWhereUniqueInputSchema,
  create: z.union([DestinationFieldConfigCreateInputSchema, DestinationFieldConfigUncheckedCreateInputSchema]),
  update: z.union([DestinationFieldConfigUpdateInputSchema, DestinationFieldConfigUncheckedUpdateInputSchema]),
}).strict();

export const DestinationFieldConfigCreateManyArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigCreateManyArgs> = z.object({
  data: DestinationFieldConfigCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const DestinationFieldConfigDeleteArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigDeleteArgs> = z.object({
  select: DestinationFieldConfigSelectSchema.optional(),
  include: DestinationFieldConfigIncludeSchema.optional(),
  where: DestinationFieldConfigWhereUniqueInputSchema,
}).strict();

export const DestinationFieldConfigUpdateArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigUpdateArgs> = z.object({
  select: DestinationFieldConfigSelectSchema.optional(),
  include: DestinationFieldConfigIncludeSchema.optional(),
  data: z.union([DestinationFieldConfigUpdateInputSchema, DestinationFieldConfigUncheckedUpdateInputSchema]),
  where: DestinationFieldConfigWhereUniqueInputSchema,
}).strict();

export const DestinationFieldConfigUpdateManyArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigUpdateManyArgs> = z.object({
  data: z.union([DestinationFieldConfigUpdateManyMutationInputSchema, DestinationFieldConfigUncheckedUpdateManyInputSchema]),
  where: DestinationFieldConfigWhereInputSchema.optional(),
}).strict();

export const DestinationFieldConfigDeleteManyArgsSchema: z.ZodType<PrismaClient.Prisma.DestinationFieldConfigDeleteManyArgs> = z.object({
  where: DestinationFieldConfigWhereInputSchema.optional(),
}).strict();

export const AirtableCredentialCreateArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialCreateArgs> = z.object({
  select: AirtableCredentialSelectSchema.optional(),
  include: AirtableCredentialIncludeSchema.optional(),
  data: z.union([AirtableCredentialCreateInputSchema, AirtableCredentialUncheckedCreateInputSchema]),
}).strict();

export const AirtableCredentialUpsertArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialUpsertArgs> = z.object({
  select: AirtableCredentialSelectSchema.optional(),
  include: AirtableCredentialIncludeSchema.optional(),
  where: AirtableCredentialWhereUniqueInputSchema,
  create: z.union([AirtableCredentialCreateInputSchema, AirtableCredentialUncheckedCreateInputSchema]),
  update: z.union([AirtableCredentialUpdateInputSchema, AirtableCredentialUncheckedUpdateInputSchema]),
}).strict();

export const AirtableCredentialCreateManyArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialCreateManyArgs> = z.object({
  data: AirtableCredentialCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const AirtableCredentialDeleteArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialDeleteArgs> = z.object({
  select: AirtableCredentialSelectSchema.optional(),
  include: AirtableCredentialIncludeSchema.optional(),
  where: AirtableCredentialWhereUniqueInputSchema,
}).strict();

export const AirtableCredentialUpdateArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialUpdateArgs> = z.object({
  select: AirtableCredentialSelectSchema.optional(),
  include: AirtableCredentialIncludeSchema.optional(),
  data: z.union([AirtableCredentialUpdateInputSchema, AirtableCredentialUncheckedUpdateInputSchema]),
  where: AirtableCredentialWhereUniqueInputSchema,
}).strict();

export const AirtableCredentialUpdateManyArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialUpdateManyArgs> = z.object({
  data: z.union([AirtableCredentialUpdateManyMutationInputSchema, AirtableCredentialUncheckedUpdateManyInputSchema]),
  where: AirtableCredentialWhereInputSchema.optional(),
}).strict();

export const AirtableCredentialDeleteManyArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableCredentialDeleteManyArgs> = z.object({
  where: AirtableCredentialWhereInputSchema.optional(),
}).strict();

export const AirtableAuthorizationCacheCreateArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheCreateArgs> = z.object({
  select: AirtableAuthorizationCacheSelectSchema.optional(),
  include: AirtableAuthorizationCacheIncludeSchema.optional(),
  data: z.union([AirtableAuthorizationCacheCreateInputSchema, AirtableAuthorizationCacheUncheckedCreateInputSchema]),
}).strict();

export const AirtableAuthorizationCacheUpsertArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheUpsertArgs> = z.object({
  select: AirtableAuthorizationCacheSelectSchema.optional(),
  include: AirtableAuthorizationCacheIncludeSchema.optional(),
  where: AirtableAuthorizationCacheWhereUniqueInputSchema,
  create: z.union([AirtableAuthorizationCacheCreateInputSchema, AirtableAuthorizationCacheUncheckedCreateInputSchema]),
  update: z.union([AirtableAuthorizationCacheUpdateInputSchema, AirtableAuthorizationCacheUncheckedUpdateInputSchema]),
}).strict();

export const AirtableAuthorizationCacheCreateManyArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheCreateManyArgs> = z.object({
  data: AirtableAuthorizationCacheCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const AirtableAuthorizationCacheDeleteArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheDeleteArgs> = z.object({
  select: AirtableAuthorizationCacheSelectSchema.optional(),
  include: AirtableAuthorizationCacheIncludeSchema.optional(),
  where: AirtableAuthorizationCacheWhereUniqueInputSchema,
}).strict();

export const AirtableAuthorizationCacheUpdateArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheUpdateArgs> = z.object({
  select: AirtableAuthorizationCacheSelectSchema.optional(),
  include: AirtableAuthorizationCacheIncludeSchema.optional(),
  data: z.union([AirtableAuthorizationCacheUpdateInputSchema, AirtableAuthorizationCacheUncheckedUpdateInputSchema]),
  where: AirtableAuthorizationCacheWhereUniqueInputSchema,
}).strict();

export const AirtableAuthorizationCacheUpdateManyArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheUpdateManyArgs> = z.object({
  data: z.union([AirtableAuthorizationCacheUpdateManyMutationInputSchema, AirtableAuthorizationCacheUncheckedUpdateManyInputSchema]),
  where: AirtableAuthorizationCacheWhereInputSchema.optional(),
}).strict();

export const AirtableAuthorizationCacheDeleteManyArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableAuthorizationCacheDeleteManyArgs> = z.object({
  where: AirtableAuthorizationCacheWhereInputSchema.optional(),
}).strict();

export const AirtableTokenCreateArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenCreateArgs> = z.object({
  select: AirtableTokenSelectSchema.optional(),
  include: AirtableTokenIncludeSchema.optional(),
  data: z.union([AirtableTokenCreateInputSchema, AirtableTokenUncheckedCreateInputSchema]),
}).strict();

export const AirtableTokenUpsertArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenUpsertArgs> = z.object({
  select: AirtableTokenSelectSchema.optional(),
  include: AirtableTokenIncludeSchema.optional(),
  where: AirtableTokenWhereUniqueInputSchema,
  create: z.union([AirtableTokenCreateInputSchema, AirtableTokenUncheckedCreateInputSchema]),
  update: z.union([AirtableTokenUpdateInputSchema, AirtableTokenUncheckedUpdateInputSchema]),
}).strict();

export const AirtableTokenCreateManyArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenCreateManyArgs> = z.object({
  data: AirtableTokenCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const AirtableTokenDeleteArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenDeleteArgs> = z.object({
  select: AirtableTokenSelectSchema.optional(),
  include: AirtableTokenIncludeSchema.optional(),
  where: AirtableTokenWhereUniqueInputSchema,
}).strict();

export const AirtableTokenUpdateArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenUpdateArgs> = z.object({
  select: AirtableTokenSelectSchema.optional(),
  include: AirtableTokenIncludeSchema.optional(),
  data: z.union([AirtableTokenUpdateInputSchema, AirtableTokenUncheckedUpdateInputSchema]),
  where: AirtableTokenWhereUniqueInputSchema,
}).strict();

export const AirtableTokenUpdateManyArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenUpdateManyArgs> = z.object({
  data: z.union([AirtableTokenUpdateManyMutationInputSchema, AirtableTokenUncheckedUpdateManyInputSchema]),
  where: AirtableTokenWhereInputSchema.optional(),
}).strict();

export const AirtableTokenDeleteManyArgsSchema: z.ZodType<PrismaClient.Prisma.AirtableTokenDeleteManyArgs> = z.object({
  where: AirtableTokenWhereInputSchema.optional(),
}).strict();

export const CodaCredentialCreateArgsSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialCreateArgs> = z.object({
  select: CodaCredentialSelectSchema.optional(),
  include: CodaCredentialIncludeSchema.optional(),
  data: z.union([CodaCredentialCreateInputSchema, CodaCredentialUncheckedCreateInputSchema]),
}).strict();

export const CodaCredentialUpsertArgsSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialUpsertArgs> = z.object({
  select: CodaCredentialSelectSchema.optional(),
  include: CodaCredentialIncludeSchema.optional(),
  where: CodaCredentialWhereUniqueInputSchema,
  create: z.union([CodaCredentialCreateInputSchema, CodaCredentialUncheckedCreateInputSchema]),
  update: z.union([CodaCredentialUpdateInputSchema, CodaCredentialUncheckedUpdateInputSchema]),
}).strict();

export const CodaCredentialCreateManyArgsSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialCreateManyArgs> = z.object({
  data: CodaCredentialCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const CodaCredentialDeleteArgsSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialDeleteArgs> = z.object({
  select: CodaCredentialSelectSchema.optional(),
  include: CodaCredentialIncludeSchema.optional(),
  where: CodaCredentialWhereUniqueInputSchema,
}).strict();

export const CodaCredentialUpdateArgsSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialUpdateArgs> = z.object({
  select: CodaCredentialSelectSchema.optional(),
  include: CodaCredentialIncludeSchema.optional(),
  data: z.union([CodaCredentialUpdateInputSchema, CodaCredentialUncheckedUpdateInputSchema]),
  where: CodaCredentialWhereUniqueInputSchema,
}).strict();

export const CodaCredentialUpdateManyArgsSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialUpdateManyArgs> = z.object({
  data: z.union([CodaCredentialUpdateManyMutationInputSchema, CodaCredentialUncheckedUpdateManyInputSchema]),
  where: CodaCredentialWhereInputSchema.optional(),
}).strict();

export const CodaCredentialDeleteManyArgsSchema: z.ZodType<PrismaClient.Prisma.CodaCredentialDeleteManyArgs> = z.object({
  where: CodaCredentialWhereInputSchema.optional(),
}).strict();

export const GoogleSheetsCredentialCreateArgsSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialCreateArgs> = z.object({
  select: GoogleSheetsCredentialSelectSchema.optional(),
  include: GoogleSheetsCredentialIncludeSchema.optional(),
  data: z.union([GoogleSheetsCredentialCreateInputSchema, GoogleSheetsCredentialUncheckedCreateInputSchema]),
}).strict();

export const GoogleSheetsCredentialUpsertArgsSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialUpsertArgs> = z.object({
  select: GoogleSheetsCredentialSelectSchema.optional(),
  include: GoogleSheetsCredentialIncludeSchema.optional(),
  where: GoogleSheetsCredentialWhereUniqueInputSchema,
  create: z.union([GoogleSheetsCredentialCreateInputSchema, GoogleSheetsCredentialUncheckedCreateInputSchema]),
  update: z.union([GoogleSheetsCredentialUpdateInputSchema, GoogleSheetsCredentialUncheckedUpdateInputSchema]),
}).strict();

export const GoogleSheetsCredentialCreateManyArgsSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialCreateManyArgs> = z.object({
  data: GoogleSheetsCredentialCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const GoogleSheetsCredentialDeleteArgsSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialDeleteArgs> = z.object({
  select: GoogleSheetsCredentialSelectSchema.optional(),
  include: GoogleSheetsCredentialIncludeSchema.optional(),
  where: GoogleSheetsCredentialWhereUniqueInputSchema,
}).strict();

export const GoogleSheetsCredentialUpdateArgsSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialUpdateArgs> = z.object({
  select: GoogleSheetsCredentialSelectSchema.optional(),
  include: GoogleSheetsCredentialIncludeSchema.optional(),
  data: z.union([GoogleSheetsCredentialUpdateInputSchema, GoogleSheetsCredentialUncheckedUpdateInputSchema]),
  where: GoogleSheetsCredentialWhereUniqueInputSchema,
}).strict();

export const GoogleSheetsCredentialUpdateManyArgsSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialUpdateManyArgs> = z.object({
  data: z.union([GoogleSheetsCredentialUpdateManyMutationInputSchema, GoogleSheetsCredentialUncheckedUpdateManyInputSchema]),
  where: GoogleSheetsCredentialWhereInputSchema.optional(),
}).strict();

export const GoogleSheetsCredentialDeleteManyArgsSchema: z.ZodType<PrismaClient.Prisma.GoogleSheetsCredentialDeleteManyArgs> = z.object({
  where: GoogleSheetsCredentialWhereInputSchema.optional(),
}).strict();

export const NotionCredentialCreateArgsSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialCreateArgs> = z.object({
  select: NotionCredentialSelectSchema.optional(),
  include: NotionCredentialIncludeSchema.optional(),
  data: z.union([NotionCredentialCreateInputSchema, NotionCredentialUncheckedCreateInputSchema]),
}).strict();

export const NotionCredentialUpsertArgsSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialUpsertArgs> = z.object({
  select: NotionCredentialSelectSchema.optional(),
  include: NotionCredentialIncludeSchema.optional(),
  where: NotionCredentialWhereUniqueInputSchema,
  create: z.union([NotionCredentialCreateInputSchema, NotionCredentialUncheckedCreateInputSchema]),
  update: z.union([NotionCredentialUpdateInputSchema, NotionCredentialUncheckedUpdateInputSchema]),
}).strict();

export const NotionCredentialCreateManyArgsSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialCreateManyArgs> = z.object({
  data: NotionCredentialCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const NotionCredentialDeleteArgsSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialDeleteArgs> = z.object({
  select: NotionCredentialSelectSchema.optional(),
  include: NotionCredentialIncludeSchema.optional(),
  where: NotionCredentialWhereUniqueInputSchema,
}).strict();

export const NotionCredentialUpdateArgsSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialUpdateArgs> = z.object({
  select: NotionCredentialSelectSchema.optional(),
  include: NotionCredentialIncludeSchema.optional(),
  data: z.union([NotionCredentialUpdateInputSchema, NotionCredentialUncheckedUpdateInputSchema]),
  where: NotionCredentialWhereUniqueInputSchema,
}).strict();

export const NotionCredentialUpdateManyArgsSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialUpdateManyArgs> = z.object({
  data: z.union([NotionCredentialUpdateManyMutationInputSchema, NotionCredentialUncheckedUpdateManyInputSchema]),
  where: NotionCredentialWhereInputSchema.optional(),
}).strict();

export const NotionCredentialDeleteManyArgsSchema: z.ZodType<PrismaClient.Prisma.NotionCredentialDeleteManyArgs> = z.object({
  where: NotionCredentialWhereInputSchema.optional(),
}).strict();

export const SyncLogCreateArgsSchema: z.ZodType<PrismaClient.Prisma.SyncLogCreateArgs> = z.object({
  select: SyncLogSelectSchema.optional(),
  data: z.union([SyncLogCreateInputSchema, SyncLogUncheckedCreateInputSchema]),
}).strict();

export const SyncLogUpsertArgsSchema: z.ZodType<PrismaClient.Prisma.SyncLogUpsertArgs> = z.object({
  select: SyncLogSelectSchema.optional(),
  where: SyncLogWhereUniqueInputSchema,
  create: z.union([SyncLogCreateInputSchema, SyncLogUncheckedCreateInputSchema]),
  update: z.union([SyncLogUpdateInputSchema, SyncLogUncheckedUpdateInputSchema]),
}).strict();

export const SyncLogCreateManyArgsSchema: z.ZodType<PrismaClient.Prisma.SyncLogCreateManyArgs> = z.object({
  data: SyncLogCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const SyncLogDeleteArgsSchema: z.ZodType<PrismaClient.Prisma.SyncLogDeleteArgs> = z.object({
  select: SyncLogSelectSchema.optional(),
  where: SyncLogWhereUniqueInputSchema,
}).strict();

export const SyncLogUpdateArgsSchema: z.ZodType<PrismaClient.Prisma.SyncLogUpdateArgs> = z.object({
  select: SyncLogSelectSchema.optional(),
  data: z.union([SyncLogUpdateInputSchema, SyncLogUncheckedUpdateInputSchema]),
  where: SyncLogWhereUniqueInputSchema,
}).strict();

export const SyncLogUpdateManyArgsSchema: z.ZodType<PrismaClient.Prisma.SyncLogUpdateManyArgs> = z.object({
  data: z.union([SyncLogUpdateManyMutationInputSchema, SyncLogUncheckedUpdateManyInputSchema]),
  where: SyncLogWhereInputSchema.optional(),
}).strict();

export const SyncLogDeleteManyArgsSchema: z.ZodType<PrismaClient.Prisma.SyncLogDeleteManyArgs> = z.object({
  where: SyncLogWhereInputSchema.optional(),
}).strict();
