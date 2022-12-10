alter table "public"."oauth_clients"
  add constraint "oauth_clients_integration_id_fkey"
  foreign key ("integration_id")
  references "public"."integrations"
  ("id") on update restrict on delete restrict;
