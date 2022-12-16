alter table "public"."destinations"
  add constraint "destinations_notion_connection_id_fkey"
  foreign key ("notion_connection_id")
  references "public"."notion_connections"
  ("bot_id") on update restrict on delete cascade;
