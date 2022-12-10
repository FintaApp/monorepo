alter table "public"."integrations" alter column "connection_type" drop not null;
alter table "public"."integrations" add column "connection_type" text;
