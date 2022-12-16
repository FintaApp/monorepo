CREATE TABLE "public"."oauth_codes" ("code" uuid NOT NULL DEFAULT gen_random_uuid(), "access_token" text NOT NULL, PRIMARY KEY ("code") );
CREATE EXTENSION IF NOT EXISTS pgcrypto;
