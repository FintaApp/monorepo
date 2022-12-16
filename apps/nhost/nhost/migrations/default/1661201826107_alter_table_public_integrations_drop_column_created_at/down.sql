alter table "public"."integrations" alter column "created_at" set default now();
alter table "public"."integrations" alter column "created_at" drop not null;
alter table "public"."integrations" add column "created_at" timestamptz;
