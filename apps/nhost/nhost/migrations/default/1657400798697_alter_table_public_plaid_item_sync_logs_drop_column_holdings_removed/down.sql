alter table "public"."plaid_item_sync_logs" alter column "holdings_removed" set default 0;
alter table "public"."plaid_item_sync_logs" alter column "holdings_removed" drop not null;
alter table "public"."plaid_item_sync_logs" add column "holdings_removed" int4;
