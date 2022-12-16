BEGIN TRANSACTION;
ALTER TABLE "public"."user_profiles" DROP CONSTRAINT "user_profiles_pkey";

ALTER TABLE "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("user_id");
COMMIT TRANSACTION;
