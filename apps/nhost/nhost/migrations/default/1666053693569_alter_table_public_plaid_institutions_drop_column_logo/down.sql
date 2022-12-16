alter table "public"."plaid_institutions" alter column "logo" drop not null;
alter table "public"."plaid_institutions" add column "logo" text;
