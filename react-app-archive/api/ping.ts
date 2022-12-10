import { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(request: VercelRequest, response: VercelResponse) {
  response.status(200).json({
    body: { message: `${process.env.VERCEL_ENV} says pong` } 
  });
}