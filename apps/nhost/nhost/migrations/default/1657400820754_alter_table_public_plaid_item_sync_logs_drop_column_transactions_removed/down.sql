alter table "public"."plaid_item_sync_logs" alter column "transactions_removed" set default 0;
alter table "public"."plaid_item_sync_logs" alter column "transactions_removed" drop not null;
alter table "public"."plaid_item_sync_logs" add column "transactions_removed" int4;
