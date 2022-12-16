alter table "public"."plaid_item_sync_logs" add column "transactions_updated" integer
 not null default '0';
