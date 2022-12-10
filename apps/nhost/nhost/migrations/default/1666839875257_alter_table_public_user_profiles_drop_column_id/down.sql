alter table "public"."user_profiles" alter column "id" set default gen_random_uuid();
alter table "public"."user_profiles" alter column "id" drop not null;
alter table "public"."user_profiles" add column "id" uuid;
