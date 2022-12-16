alter table "public"."plaid_item_sync_logs" alter column "holdings_updated" set default 0;
alter table "public"."plaid_item_sync_logs" alter column "holdings_updated" drop not null;
alter table "public"."plaid_item_sync_logs" add column "holdings_updated" int4;
