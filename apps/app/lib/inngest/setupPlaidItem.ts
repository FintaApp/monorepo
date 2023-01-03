import { createFunction } from "inngest";
import { Products } from "plaid";

import { getInstitution, getItem, initiateProducts } from "../plaid";
import { db } from "../db";
import { uploadPlaidInstitutionLogo } from "../uploadToStorageBucket";

export const setupPlaidItem = createFunction("Setup Plaid Item", "plaid_item/setup", async ({ event }) => {
  const { plaidItemId } = event.data;

  const plaidItem = await db.plaidItem.findFirstOrThrow({ where: { id: plaidItemId }, select: {
    institution: true,
    accessToken: true
  }});

  const { accessToken, institution: { id: institutionId } } = plaidItem;
  // Store institution logo
  if ( !plaidItem.institution.logoUrl ) {
    const { logo } = await getInstitution({ institutionId })
      .then(response => response.data.institution);

    if ( logo ) { 
      const logoUrl = await uploadPlaidInstitutionLogo(institutionId, logo);
      await db.plaidInstitution.update({ where: { id: institutionId }, data: { logoUrl }})
    }
  }

  // Turn on all possible data
  const initialItem = await getItem({ accessToken })
    .then(response => response.data.item);

  await initiateProducts({ 
    accessToken, 
    availableProducts: initialItem.available_products.filter(product => product !== 'transactions').concat('transactions' as Products) // Make sure transactions is in there exactly once
  });

  const newItem = await getItem({ accessToken })
    .then(response => response.data.item);

  await db.plaidItem.update({ where: { id: plaidItemId }, data: { availableProducts: newItem.available_products, billedProducts: newItem.billed_products }})
  return "OK"
})
