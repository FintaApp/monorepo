BEGIN TRANSACTION;
ALTER TABLE "public"."notion_connections" DROP CONSTRAINT "notion_connections_pkey";

ALTER TABLE "public"."notion_connections"
    ADD CONSTRAINT "notion_connections_pkey" PRIMARY KEY ("bot_id", "user_id");
COMMIT TRANSACTION;
