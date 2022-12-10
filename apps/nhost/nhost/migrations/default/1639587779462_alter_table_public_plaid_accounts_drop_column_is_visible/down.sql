alter table "public"."plaid_accounts" alter column "is_visible" set default true;
alter table "public"."plaid_accounts" alter column "is_visible" drop not null;
alter table "public"."plaid_accounts" add column "is_visible" bool;
