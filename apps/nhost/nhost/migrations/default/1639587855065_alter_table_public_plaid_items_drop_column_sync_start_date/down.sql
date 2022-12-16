alter table "public"."plaid_items" alter column "sync_start_date" drop not null;
alter table "public"."plaid_items" add column "sync_start_date" text;
