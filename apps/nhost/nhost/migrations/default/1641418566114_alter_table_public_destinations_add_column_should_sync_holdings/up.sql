alter table "public"."destinations" add column "should_sync_holdings" boolean
 not null default 'false';
