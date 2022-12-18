import { APIClient, SendEmailRequest } from "customerio-node";

export enum EMAIL_TEMPLATES {
  ACTIVATE_ACCOUNT = "activate_account",
  PERIODIC_UPDATE = "periodic_update",
  SIGN_IN = "sign_in"
}

const apiClient = new APIClient(process.env.CIO_API_KEY || "");


export const sendTransactionalEmail = async ({ templateId, userId, email, data }: {
  templateId: EMAIL_TEMPLATES;
  userId?: string;
  email: string;
  data: any
}) => {
  const request = new SendEmailRequest({
    to: email,
    transactional_message_id: templateId,
    message_data: { ...data, xEntityRefId: new Date().getTime().toString() },
    identifiers: userId ? { id: userId } : { email }
  })

  return apiClient.sendEmail(request)
}