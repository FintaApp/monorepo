CREATE TABLE "public"."integrations" ("id" text NOT NULL, "name" text NOT NULL, "logo" text, "created_at" timestamptz NOT NULL DEFAULT now(), "connection_type" text NOT NULL, PRIMARY KEY ("id") );
