import { Integration } from "@prisma/client";
import { ReactNode } from "react";
import { AccordionItem } from "~/components/AccordionItem";

import { useDestination } from "../../context";
import { Airtable } from "./Airtable";
import { Coda } from "./Coda";
import { Google } from "./Google";
import { Notion } from "./Notion";

const Wrapper = ({ isSetupMode, integration, children }: { isSetupMode: boolean; integration: Integration; children: ReactNode[] }) => {
  if ( isSetupMode || integration === Integration.Coda ) { return <>{ children }</> };
  return (
    <AccordionItem buttonLabel = "Credentials" buttonChildren = {<></>}>{ children }</AccordionItem>
  )
}

export const DestinationCredentials = () => {
  const { integration, isSetupMode } = useDestination();

  return (
    <Wrapper isSetupMode = { isSetupMode } integration = { integration }>
      { integration === Integration.Airtable && <Airtable /> }
      { integration === Integration.Coda && <Coda />   }
      { integration === Integration.Google && <Google />  }
      { integration === Integration.Notion && <Notion /> }
    </Wrapper>
  )
}