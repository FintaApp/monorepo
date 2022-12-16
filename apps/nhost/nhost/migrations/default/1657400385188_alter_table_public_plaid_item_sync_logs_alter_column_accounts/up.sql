alter table "public"."plaid_item_sync_logs" alter column "accounts" set default jsonb_build_object('added', jsonb_build_array(), 'updated', jsonb_build_array());
