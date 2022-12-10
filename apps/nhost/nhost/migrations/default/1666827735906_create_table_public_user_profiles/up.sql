CREATE TABLE "public"."user_profiles" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "timezone" text, "is_subscribed_general" boolean NOT NULL DEFAULT true, "is_subscribed_sync_updates" boolean NOT NULL DEFAULT true, "sync_updates_frequency" text, "sync_updates_job_id" text, PRIMARY KEY ("id") , FOREIGN KEY ("sync_updates_frequency") REFERENCES "public"."frequencies"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("user_id"), UNIQUE ("sync_updates_job_id"));
CREATE TRIGGER "set_public_user_profiles_updated_at"
BEFORE UPDATE ON "public"."user_profiles"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_user_profiles_updated_at" ON "public"."user_profiles" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
