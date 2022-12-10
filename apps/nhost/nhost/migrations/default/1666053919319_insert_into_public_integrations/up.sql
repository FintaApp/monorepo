INSERT INTO "public"."integrations"("id", "name") VALUES (E'coda', E'Coda') ON CONFLICT ON CONSTRAINT integrations_pkey DO NOTHING;;
