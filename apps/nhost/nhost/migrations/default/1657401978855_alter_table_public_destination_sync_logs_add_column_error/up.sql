alter table "public"."destination_sync_logs" add column "error" jsonb
 not null default jsonb_build_object();
