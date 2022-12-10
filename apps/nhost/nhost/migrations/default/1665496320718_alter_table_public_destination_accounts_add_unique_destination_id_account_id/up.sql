alter table "public"."destination_accounts" add constraint "destination_accounts_destination_id_account_id_key" unique ("destination_id", "account_id");
