alter table "public"."destination_sync_logs" add column "transactions" jsonb
 not null default jsonb_build_object('added', jsonb_build_array(), 'updated', jsonb_build_array(), 'removed', jsonb_build_array());
