alter table "public"."destinations" alter column "should_sync_holdings" set default false;
alter table "public"."destinations" alter column "should_sync_holdings" drop not null;
alter table "public"."destinations" add column "should_sync_holdings" bool;
