alter table "public"."destinations"
  add constraint "destinations_user_id_notion_connection_id_fkey"
  foreign key ("user_id", "notion_connection_id")
  references "public"."notion_connections"
  ("user_id", "bot_id") on update restrict on delete cascade;
