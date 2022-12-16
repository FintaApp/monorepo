CREATE EXTENSION IF NOT EXISTS pgcrypto;
alter table "public"."destination_accounts" add column "id" uuid
 not null unique default gen_random_uuid();
