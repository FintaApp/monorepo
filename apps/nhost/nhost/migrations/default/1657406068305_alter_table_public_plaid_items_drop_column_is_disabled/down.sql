alter table "public"."plaid_items" alter column "is_disabled" set default false;
alter table "public"."plaid_items" alter column "is_disabled" drop not null;
alter table "public"."plaid_items" add column "is_disabled" bool;
