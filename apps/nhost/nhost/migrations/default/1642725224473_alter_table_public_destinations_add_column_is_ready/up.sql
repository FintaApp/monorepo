alter table "public"."destinations" add column "is_ready" boolean
 not null default 'false';
