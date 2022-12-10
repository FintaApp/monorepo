alter table "public"."user_profiles"
  add constraint "user_profiles_user_id_fkey"
  foreign key ("user_id")
  references "auth"."users"
  ("id") on update restrict on delete cascade;
