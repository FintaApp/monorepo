CREATE TABLE "public"."airtable_configs" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "api_key" text NOT NULL, "base_id" text NOT NULL, "destination_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON UPDATE restrict ON DELETE cascade);
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
CREATE TRIGGER "set_public_airtable_configs_updated_at"
BEFORE UPDATE ON "public"."airtable_configs"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_airtable_configs_updated_at" ON "public"."airtable_configs" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
