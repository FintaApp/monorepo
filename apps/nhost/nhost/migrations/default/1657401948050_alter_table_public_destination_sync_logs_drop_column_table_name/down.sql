alter table "public"."destination_sync_logs" alter column "table_name" drop not null;
alter table "public"."destination_sync_logs" add column "table_name" text;
