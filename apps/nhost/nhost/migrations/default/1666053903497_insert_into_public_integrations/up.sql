INSERT INTO "public"."integrations"("id", "name") VALUES (E'airtable', E'Airtable') ON CONFLICT ON CONSTRAINT integrations_pkey DO NOTHING;
