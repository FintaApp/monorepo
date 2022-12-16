CREATE TABLE "public"."sync_logs" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "ended_at" timestamptz, "trigger" text NOT NULL, "is_success" boolean NOT NULL DEFAULT false, "error" text, PRIMARY KEY ("id") );COMMENT ON TABLE "public"."sync_logs" IS E'logs for all automatic and manual data syncs';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
