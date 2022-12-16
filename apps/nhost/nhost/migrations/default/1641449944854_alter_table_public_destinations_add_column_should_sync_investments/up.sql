alter table "public"."destinations" add column "should_sync_investments" boolean
 not null default 'false';
