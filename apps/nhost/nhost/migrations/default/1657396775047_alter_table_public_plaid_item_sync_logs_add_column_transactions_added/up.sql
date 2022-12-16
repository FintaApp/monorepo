alter table "public"."plaid_item_sync_logs" add column "transactions_added" integer
 not null default '0';
