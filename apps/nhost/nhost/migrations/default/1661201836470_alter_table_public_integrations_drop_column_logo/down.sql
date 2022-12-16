alter table "public"."integrations" alter column "logo" drop not null;
alter table "public"."integrations" add column "logo" text;
