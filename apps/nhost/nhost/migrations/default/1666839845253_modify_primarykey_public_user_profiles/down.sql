alter table "public"."user_profiles" drop constraint "user_profiles_pkey";
alter table "public"."user_profiles"
    add constraint "user_profiles_pkey"
    primary key ("id");
