import { DBEventPayload, DBUserProfile } from "../../types";

import * as easyCron from "../../easyCron";

export const handelDeleteUserProfile = async ({ body }: { body: DBEventPayload<'DELETE', DBUserProfile>}) => {
  const { old: oldUserProfile } = body.event.data;

  let jobId = oldUserProfile.sync_updates_job_id;
  if ( !jobId ) { return; }

  return easyCron.deleteJob({ jobId });
}