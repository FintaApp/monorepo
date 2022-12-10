alter table "public"."notion_connections" drop constraint "notion_connections_pkey";
alter table "public"."notion_connections"
    add constraint "notion_connections_pkey"
    primary key ("bot_id");
