import axios from "axios";

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
  user: {
    name: string;
    email: string;
  }
}) => {
  return client.post('/tickets.json', {
    ticket: {
      subject,
      comment: {
        body
      },
      requester: {
        name: user.name,
        email: user.email
      }
    }
  })
}