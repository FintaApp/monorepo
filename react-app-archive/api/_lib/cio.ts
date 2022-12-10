import { APIClient, SendEmailRequest, TrackClient } from "customerio-node";

const CIO_API_KEY = process.env.CIO_API_KEY;
const CIO_TRACKING_API_KEY = process.env.CIO_TRACKING_API_KEY;
const CIO_SITE_ID = process.env.CIO_SITE_ID;

export enum TRANSACTIONAL_EMAILS {
  SYNC_UPDATE = 9
}

const client = new APIClient(CIO_API_KEY!);
const trackClient = new TrackClient(CIO_SITE_ID!, CIO_TRACKING_API_KEY!);

export const deleteUserProfle = ({ userId }: { userId: string }) => trackClient.destroy(userId);

export const sendTransactionalEmail = async ({ messageKey, user, data }: { messageKey: TRANSACTIONAL_EMAILS, user: { id: string; email?: string }, data: any}) => {
  if ( process.env.VERCEL_ENV !== 'production' || !user.email ) { return; }

  const request = new SendEmailRequest({
    to: user.email,
    transactional_message_id: messageKey,
    message_data: data,
    identifiers: { id: user.id }
  });

  return client.sendEmail(request)
}
