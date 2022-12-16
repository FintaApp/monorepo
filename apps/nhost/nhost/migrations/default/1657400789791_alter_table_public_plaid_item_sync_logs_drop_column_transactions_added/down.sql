alter table "public"."plaid_item_sync_logs" alter column "transactions_added" set default 0;
alter table "public"."plaid_item_sync_logs" alter column "transactions_added" drop not null;
alter table "public"."plaid_item_sync_logs" add column "transactions_added" int4;
