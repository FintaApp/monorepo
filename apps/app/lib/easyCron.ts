import axios from "axios";
import { CronBuilder } from 'cron-builder-ts';

import { Frequency } from "@prisma/client";

const syncUpdatesEmailUrl = {
  'development': 'https://finta.ngrok.io/api/sendSyncUpdateEmail',
  'staging': 'https://staging.app.finta.io/api/sendSyncUpdateEmail',
  'production': 'https://app.finta.io/api/sendSyncUpdateEmail' 
}

type Job = {
  frequency: Frequency,
  timezone?: string;
  userId: string;
  isEnabled: boolean;
}

const getCronExpression = (frequency: Frequency) => {
  const cronExp = new CronBuilder('0 9 * * *');

  if ( frequency === Frequency.Weekly ) { cronExp.addValue('dayOfTheWeek', '1')}
  if ( ([Frequency.Monthly, Frequency.Quarterly, Frequency.Yearly] as Frequency[]).includes(frequency) ) { cronExp.addValue('dayOfTheMonth', '1')}
  if ( frequency === Frequency.Quarterly ) { cronExp.addValue('month', '1,4,7,10') }
  if ( frequency === Frequency.Yearly ) { cronExp.addValue('month', '1')}
  return cronExp.build();
}

const client = axios.create({
  baseURL: "https://www.easycron.com/rest",
  headers: { 'Accept-Encoding': 'application/json' }
});

client.interceptors.request.use(config => {
  config.params = {
    token: process.env.EASY_CRON_API_TOKEN,
    ...(config.params || {}),
  };
  return config;
});

export const upsertJob = async ({ jobId, job }: { jobId?: string | null; job: Job }): Promise<{ status: string; cron_job_id: string }> => {
  return client.get(jobId ? '/edit' : '/add', { params: {
    id: jobId,
    cron_job_name: job.userId,
    url: syncUpdatesEmailUrl[(process.env.VERCEL_ENV || 'production') as keyof typeof syncUpdatesEmailUrl],
    cron_expression: getCronExpression(job.frequency),
    timezone_from: 2,
    timezone: job.timezone || 'America/New_York',
    http_method: 'POST',
    http_message_body: JSON.stringify({
      userId: job.userId,
      frequency: job.frequency
    }),
    status: job.isEnabled ? 1 : 0
  }})
  .then(response => response.data)
};

export const enableJob = async ({ jobId }: { jobId: string }): Promise<{ status: string; cron_job_id: string }> => {
  return client.get('/enable', { params: { id: jobId }}).then(response => response.data)
}

export const disableJob = async ({ jobId }: { jobId: string }): Promise<{ status: string; cron_job_id: string }> => {
  return client.get('/disable', { params: { id: jobId }}).then(response => response.data)
}

export const deleteJob = async ({ jobId }: { jobId: string }): Promise<{ status: string; cron_job_id: string }> => {
  return client.get('/delete', { params: { id: jobId }}).then(response => response.data)
}