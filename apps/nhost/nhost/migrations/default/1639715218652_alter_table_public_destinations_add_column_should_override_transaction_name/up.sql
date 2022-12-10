alter table "public"."destinations" add column "should_override_transaction_name" boolean
 not null default 'false';
