CREATE TABLE "public"."stripe_webhook_events" ("id" text NOT NULL, "event" text NOT NULL, "state" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") );
