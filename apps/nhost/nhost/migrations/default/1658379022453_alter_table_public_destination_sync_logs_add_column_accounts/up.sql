alter table "public"."destination_sync_logs" add column "accounts" jsonb
 not null default jsonb_build_object('added', jsonb_build_array(), 'updated', jsonb_build_array());
