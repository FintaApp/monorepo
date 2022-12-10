alter table "public"."destination_accounts" alter column "id" set default gen_random_uuid();
alter table "public"."destination_accounts" add constraint "destination_accounts_id_key" unique (id);
alter table "public"."destination_accounts" alter column "id" drop not null;
alter table "public"."destination_accounts" add column "id" uuid;
