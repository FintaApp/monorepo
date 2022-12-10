alter table "public"."oauth_codes"
  add constraint "oauth_codes_oauth_client_id_fkey"
  foreign key ("oauth_client_id")
  references "public"."oauth_clients"
  ("id") on update restrict on delete cascade;
