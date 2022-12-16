alter table "public"."destination_sync_logs" alter column "error" set not null;
alter table "public"."destination_sync_logs" alter column "error" set default jsonb_build_object();
