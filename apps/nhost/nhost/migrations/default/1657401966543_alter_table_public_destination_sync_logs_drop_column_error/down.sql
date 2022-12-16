alter table "public"."destination_sync_logs" alter column "error" drop not null;
alter table "public"."destination_sync_logs" add column "error" text;
