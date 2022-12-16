alter table "public"."destinations" add column "is_disabled" boolean
 not null default 'false';
