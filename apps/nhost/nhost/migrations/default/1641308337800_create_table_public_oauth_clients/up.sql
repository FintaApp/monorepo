CREATE TABLE "public"."oauth_clients" ("id" UUID NOT NULL DEFAULT gen_random_uuid(), "secret_hash" text NOT NULL, "name" text NOT NULL, PRIMARY KEY ("id") );
