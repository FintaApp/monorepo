import { useEffect } from "react";

import { Page, PageHeader } from "src/components/Page";
import * as analytics from "src/lib/analytics";
import { InstitutionsList } from "./InstitutionsList";
import { AddBankAccount } from "./AddBankAccount";

export const Accounts = () => {
  useEffect(() => { analytics.page({ name: analytics.PageNames.ACCOUNTS })}, []); 

  return (
    <Page>
      <PageHeader title = "Accounts"><AddBankAccount /></PageHeader>
      <InstitutionsList />
    </Page>
  )
}