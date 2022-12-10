alter table "public"."destinations" alter column "is_disabled" set default false;
alter table "public"."destinations" alter column "is_disabled" drop not null;
alter table "public"."destinations" add column "is_disabled" bool;
