ALTER TABLE "public"."destination_sync_logs" ALTER COLUMN "error" drop default;
alter table "public"."destination_sync_logs" alter column "error" drop not null;
