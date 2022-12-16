alter table "public"."destination_sync_logs" alter column "column_name" drop not null;
alter table "public"."destination_sync_logs" add column "column_name" text;
