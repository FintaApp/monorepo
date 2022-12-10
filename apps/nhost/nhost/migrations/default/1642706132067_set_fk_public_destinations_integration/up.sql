alter table "public"."destinations"
  add constraint "destinations_integration_fkey"
  foreign key ("integration")
  references "public"."integrations"
  ("id") on update restrict on delete restrict;
