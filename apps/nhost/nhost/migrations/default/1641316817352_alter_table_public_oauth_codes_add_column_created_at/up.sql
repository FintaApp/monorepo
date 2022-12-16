alter table "public"."oauth_codes" add column "created_at" timestamptz
 not null default now();
