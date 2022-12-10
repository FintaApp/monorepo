import { Integrations_Enum } from "src/graphql";
import { Airtable } from "./Airtable";
import { CodaSetup, CodaSetupProps } from "./CodaSetup";
import { Google } from "./Google";
import { Notion } from "./Notion";
import { GoogleSheetsCredentials, AirtableCredentials, NotionCredentials } from "src/types";


export const Credentials = {
  [Integrations_Enum.Airtable]: ({ onSubmitAuthentication, onBack, setActiveStep }: { 
    onSubmitAuthentication: (props: AirtableCredentials) => void;
    onBack: () => void;
    setActiveStep: (step: number) => void
  }) => <Airtable setActiveStep = { setActiveStep } onSubmitAuthentication = { onSubmitAuthentication } onBack = { onBack } />,
  [Integrations_Enum.Coda]: ({ onBack, onClose, setActiveStep }: CodaSetupProps) => (
    <CodaSetup setActiveStep = { setActiveStep } onBack = { onBack } onClose = { onClose } />
  ),
  [Integrations_Enum.Notion]: ({ onSubmitAuthentication, onBack, setActiveStep }: { 
    onSubmitAuthentication: (props: NotionCredentials) => void;
    onBack: () => void;
    setActiveStep: (step: number) => void
  }) => <Notion setActiveStep = { setActiveStep } onSubmitAuthentication = { onSubmitAuthentication } onBack = { onBack } />,
  [Integrations_Enum.Google]: ({ onSubmitAuthentication, onBack, setActiveStep }: { 
    onSubmitAuthentication: (props: GoogleSheetsCredentials) => void;
    onBack: () => void;
    setActiveStep: (step: number) => void
  }) => <Google setActiveStep = { setActiveStep } onSubmitAuthentication = { onSubmitAuthentication } onBack = { onBack } />,
}