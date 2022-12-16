alter table "public"."plaid_item_sync_logs" add column "transactions_removed" integer
 not null default '0';
