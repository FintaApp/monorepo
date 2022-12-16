alter table "public"."destinations" add column "should_sync_transactions" boolean
 not null default 'true';
