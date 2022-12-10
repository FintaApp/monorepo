alter table "public"."plaid_item_sync_logs" alter column "holdings_added" set default 0;
alter table "public"."plaid_item_sync_logs" alter column "holdings_added" drop not null;
alter table "public"."plaid_item_sync_logs" add column "holdings_added" int4;
