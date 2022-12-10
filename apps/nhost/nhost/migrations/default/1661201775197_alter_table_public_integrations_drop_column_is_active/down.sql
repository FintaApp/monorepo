alter table "public"."integrations" alter column "is_active" set default false;
alter table "public"."integrations" alter column "is_active" drop not null;
alter table "public"."integrations" add column "is_active" bool;
