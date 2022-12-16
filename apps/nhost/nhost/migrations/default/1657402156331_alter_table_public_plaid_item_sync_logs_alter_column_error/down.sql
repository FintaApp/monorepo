alter table "public"."plaid_item_sync_logs" alter column "error" set not null;
alter table "public"."plaid_item_sync_logs" alter column "error" set default jsonb_build_object();
