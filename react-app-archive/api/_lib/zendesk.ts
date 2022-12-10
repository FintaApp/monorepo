import axios from "axios";
import { UserModel } from "./types";

const authString = `taylor@finta.io/token:${process.env.ZENDESK_TOKEN}`;

const client = axios.create({
  baseURL: `https://finta.zendesk.com/api/v2`,
  headers: {
    'Authorization': `Basic ${Buffer.from(authString).toString('base64')}`
  }
});

export const createTicket = async ({ subject, body, user }: {
  subject: string;
  body: string;
  user: UserModel
}) => {
  return client.post('/tickets.json', {
    ticket: {
      subject,
      comment: {
        body
      },
      requester: {
        name: user.display_name,
        email: user.email
      }
    }
  })
}