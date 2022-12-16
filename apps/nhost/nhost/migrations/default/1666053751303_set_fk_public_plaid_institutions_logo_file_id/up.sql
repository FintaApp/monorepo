alter table "public"."plaid_institutions"
  add constraint "plaid_institutions_logo_file_id_fkey"
  foreign key ("logo_file_id")
  references "storage"."files"
  ("id") on update restrict on delete restrict;
