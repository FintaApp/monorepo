ALTER TABLE "public"."plaid_item_sync_logs" ALTER COLUMN "error" drop default;
alter table "public"."plaid_item_sync_logs" alter column "error" drop not null;
