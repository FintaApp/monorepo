alter table "public"."plaid_item_sync_logs" add column "error" jsonb
 not null default jsonb_build_object();
