import { APIClient, SendEmailRequest, TrackClient } from "customerio-node";
import { Logger } from "./logger";

const CIO_API_KEY = process.env.CIO_API_KEY;
const CIO_TRACKING_API_KEY = process.env.CIO_TRACKING_API_KEY;
const CIO_SITE_ID = process.env.CIO_SITE_ID;
const isProduction = (process.env.VERCEL_ENV || 'production') !== 'production';

export enum TRANSACTIONAL_EMAILS {
  SYNC_UPDATE = 9
}

const client = new APIClient(CIO_API_KEY!);
const trackClient = new TrackClient(CIO_SITE_ID!, CIO_TRACKING_API_KEY!);

export const deleteUserProfle = ({ userId }: { userId: string }) => trackClient.destroy(userId);

export const sendTransactionalEmail = async ({ messageKey, user, data, logger }: { messageKey: TRANSACTIONAL_EMAILS, user: { id: string; email?: string; }, data: any; logger: Logger}) => {
  if ( !isProduction ) {
    return logger.info("Mocking email send", { messageKey, data })
  }

  if ( !user.email ) {
    return logger.info("No user email")
  }

  const request = new SendEmailRequest({
    to: user.email,
    transactional_message_id: messageKey,
    message_data: data,
    identifiers: { id: user.id }
  });

  return client.sendEmail(request).then(response => logger.info("Email sent", { messageKey, data, response }))
}
