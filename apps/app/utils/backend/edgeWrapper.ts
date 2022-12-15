import { NextRequest, NextResponse } from 'next/server';
import winston from 'winston';
import { logger } from "./newLogger";

export const edgeConfig = { runtime: 'experimental-edge'}

type WrappedFunctionResponse = Promise<{ status: number; message: any }>;
export type WrappedFunction = ({ req, logger }: { req: NextRequest, logger: winston.Logger }) => WrappedFunctionResponse;

export const wrapper = (fn: WrappedFunction) => async (req: NextRequest) => {
  const route = req.url;
  logger.info(`${route} request started`, { headers: req.headers });

  const { status, message } = await fn({ req, logger })
    .catch(error => {
      logger.error(error);
      return { status: 500, message: "Internal Error"}
    })
  
  logger.info(`${route} request finished`, { status, body: message })
  return new Response(JSON.stringify(message), { status })
}