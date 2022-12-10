alter table "public"."plaid_item_sync_logs" alter column "transactions_updated" set default 0;
alter table "public"."plaid_item_sync_logs" alter column "transactions_updated" drop not null;
alter table "public"."plaid_item_sync_logs" add column "transactions_updated" int4;
