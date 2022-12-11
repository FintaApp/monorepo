import FormData from 'form-data';
import { graphql } from "~/graphql/backend";
import { DBEventPayload, DBPlaidInstitution } from "~/types/backend/db";
import { Logger } from "../logger";
import { getInstitution } from "../plaid";
import { storage } from '../nhost';
import { AxiosError } from 'axios';

export const onInsertPlaidInstitution = async ({ body, logger }: { body: DBEventPayload<'INSERT', DBPlaidInstitution> | DBEventPayload<'MANUAL', DBPlaidInstitution>; logger: Logger }) => {
  const { new: { id, name }} = body.event.data;

  await getInstitution({ institutionId: id })
  .then(async response => {
    logger.info("Institution fetched", { data: response.data });
    const { institution: { logo }} = response.data;
    if ( !logo ) { return; }

    const formData = new FormData();
    const logoBuffer = Buffer.from(logo, 'base64');
    formData.append('file', logoBuffer, `${name}.png`);

    const { error, fileMetadata } = await storage.upload({ formData, bucketId: 'institution-logos' });
    if ( error ) { 
      logger.error(error, { data: (error as AxiosError).response.data });
      return;
    }

    return graphql.UpdatePlaidInstitution({ plaidInstitutionId: id, _set: { logo_file_id: fileMetadata!.id }})
  .then(response => logger.info("Plaid institution updated with logo", { response }))
  })
  .catch(error => logger.error(new Error("Get Plaid institution error"), { data: error.response.data }))
}