alter table "public"."plaid_accounts" add column "is_closed" boolean
 not null default 'false';
