import FormData from 'form-data';

import { DBEventPayload, DBPlaidInstitution } from "../../types";
import { graphql } from "../../graphql";
import { storage } from '../../nhost';
import * as plaid from "../../../../../apps/app/utils/backend/plaid";

export const on_insert_plaid_institution = async ({ body }: { body: DBEventPayload<'INSERT', DBPlaidInstitution> }) => {
  const { new: { id, name }} = body.event.data;

  await plaid.getInstitution({ institutionId: id })
  .then(async response => {
    const { institution: { logo } } = response.data;
    if ( !logo ) { return; }

    const formData = new FormData();
    const logoBuffer = Buffer.from(logo, 'base64');
    formData.append('file', logoBuffer, `${name}.png`)
    
    const { error, fileMetadata } = await storage.upload({ formData, bucketId: 'institution-logos' });
    if ( error ) { return; }

    return graphql.UpdatePlaidInstitution({ plaid_institution_id: id, _set: { logo_file_id: fileMetadata!.id }})
  })
}