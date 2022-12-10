import {
  Image
} from "@chakra-ui/react";
import { Integrations_Enum } from "src/graphql";

import airtableLogo from "./airtable-logo.svg";
import codaLogo from "./coda-logo.png";
import googleLogo from "./google-logo.png";
import notionLogo from "./notion-logo.png";

export const AirtableLogo = ({ ...props }) => <Image src = { airtableLogo } alt = "Airtable logo" { ...props } />
export const CodaLogo = ({ ...props }) => <Image src = { codaLogo } alt = "Coda logo" { ...props } />

export const destinationLogos  ={
  [Integrations_Enum.Airtable]: airtableLogo,
  [Integrations_Enum.Coda]: codaLogo,
  [Integrations_Enum.Google]: googleLogo,
  [Integrations_Enum.Notion]: notionLogo
}