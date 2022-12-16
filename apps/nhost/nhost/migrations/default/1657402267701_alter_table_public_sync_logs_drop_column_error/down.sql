comment on column "public"."sync_logs"."error" is E'logs for all automatic and manual data syncs';
alter table "public"."sync_logs" alter column "error" drop not null;
alter table "public"."sync_logs" add column "error" text;
