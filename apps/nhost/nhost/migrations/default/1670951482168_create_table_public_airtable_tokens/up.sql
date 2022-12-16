CREATE TABLE "public"."airtable_tokens" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "access_token" text NOT NULL, "refresh_token" text NOT NULL, "token_type" text NOT NULL, "scope" text NOT NULL, "refreshed_at" timestamptz NOT NULL DEFAULT now(), "access_token_expires_at" timestamptz NOT NULL, "refresh_token_expires_at" timestamptz NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE restrict ON DELETE cascade);COMMENT ON TABLE "public"."airtable_tokens" IS E'Used to house Airtable access and refresh tokens for users';
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_airtable_tokens_updated_at"
BEFORE UPDATE ON "public"."airtable_tokens"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_airtable_tokens_updated_at" ON "public"."airtable_tokens" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
