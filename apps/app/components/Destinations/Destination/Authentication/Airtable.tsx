import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Text,
  VStack
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { SymbolIcon } from "@radix-ui/react-icons";

import { Select } from '~/components/Forms';
import { useUpdateDestinationMutation } from "~/graphql/frontend";
import { AirtableAuthentication } from "~/types/shared/models";
import { getAirtableBases } from "~/utils/frontend/functions";
import { useToast } from '~/utils/frontend/useToast';
import { trpc } from "~/lib/trpc";

interface AirtableProps {
  destinationId?: string;
  onChange?: (newAuthentication: AirtableAuthentication) => void;
  errorMessage?: string;
  authentication: AirtableAuthentication
}

export const Airtable = ({ destinationId, onChange: onChangeProp, errorMessage, authentication }: AirtableProps) => {
  const renderToast = useToast()
  const [ bases, setBases ] = useState(null as { id: string; name: string }[] | null);
  const [ updateDestinationMutation ] = useUpdateDestinationMutation();

  const [ isLoadingBases, setIsLoadingBases ] = useState(false);
  const [ hasLoadedBases, setHasLoadedBases ] = useState(false);
  
  const [ shouldPoll, setShouldPoll ] = useState(false);
  const { data: hasToken } = trpc.airtable.doesUserHaveToken.useQuery(undefined, { refetchInterval: shouldPoll ? 2000 : false })
  const { mutateAsync: getAuthorizationUrlMutation, isLoading: isGettingAuthUrl } = trpc.airtable.getAuthorizationUrl.useMutation();

  const fetchBases = useCallback(() => {
    if ( !isLoadingBases && hasToken ) {
      setIsLoadingBases(true);
      getAirtableBases({})
      .then(({ bases }) => setBases(bases))
      .finally(() => { setIsLoadingBases(false); setHasLoadedBases(true) })
    }
  }, [ isLoadingBases, hasToken ])

  const getAuthorizationUrl = () => { 
    setShouldPoll(true);
    getAuthorizationUrlMutation().then(({ url }) => window.open(url, '_blank'));
  } ;

  const options = bases?.map(base => ({ label: base.name, value: base.id })) || [];
  const value = options.find(option => option.value === authentication.base_id);

  const onChange = (newValue: typeof options[0]) => {
    const newAuthentication = { base_id: newValue.value } as AirtableAuthentication;
    onChangeProp && onChangeProp(newAuthentication );

    if ( destinationId ) {
      updateDestinationMutation({
        variables: { destinationId, _set: { authentication: newAuthentication }}
      })
      .then(() => {
        renderToast({ status: 'success', title: "Destination Updated"})
      })
    }
  }


  if ( !hasToken ) {
    return (
      <VStack>
        <Button isLoading = { isGettingAuthUrl } onClick = { getAuthorizationUrl } variant = "primaryOutline" size = "md" width = "full">Connect to Airtable</Button>
        <Text>Log in with Airtable so that Finta can sync data to your base. You can </Text>
      </VStack>
    )
  }
  
  return (
    <HStack spacing = '6'>
      <FormControl isInvalid = { !!errorMessage }>
        <FormLabel>Base</FormLabel>
        <HStack spacing = "4">
          <Select 
            value = { value } 
            options = { options } 
            onChange = { (item: any) => onChange(item) } 
            isLoading = { isLoadingBases }
            noOptionsMessage = { () => hasLoadedBases ? "No bases have been shared with Finta" : "Hit the refresh button to fetch your Airtable Bases"}
            placeholder = { hasLoadedBases ? "Select Base" : "Hit the refresh button to fetch your Airtable Bases" }
          />
          <Button ml = "2" isLoading = { isLoadingBases } onClick = { fetchBases } variant = "icon"><SymbolIcon /></Button>
          </HStack>
        <FormErrorMessage>{ errorMessage }</FormErrorMessage>
      </FormControl>
    </HStack>
  )
}


// import { FormEvent, useState } from "react";
// import {
//   Button,
//   Flex,
//   FormControl,
//   FormErrorMessage,
//   Input,
//   Stack,
// } from "@chakra-ui/react";
// import { Pencil2Icon, Cross1Icon, CheckIcon } from "@radix-ui/react-icons";

// import { useToast } from "~/utils/frontend/useToast";
// import { validateDestinationAuthentication } from "~/utils/frontend/functions";
// import { LegacyAirtableCredentials } from "~/types/shared/models";
// import { Integrations_Enum, useUpdateDestinationMutation } from "~/graphql/frontend";
// import { FormLabelWithTooltip } from "~/components/Forms/FormLabelWithTooltip";

// export const Airtable = ({ authentication, destinationId, onChange: onChangeProp, errorMessage }: { destinationId?: string; onChange: ( newAuthentication: LegacyAirtableCredentials ) => void; errorMessage?: string; authentication: LegacyAirtableCredentials }) => {
//   const [ isCheckLoading, setIsCheckLoading ] = useState(false);
//   const { api_key, base_id } = authentication;
//   const [ newAPIKey, setNewAPIKey ] = useState(api_key || "");
//   const [ newBaseID, setNewBaseID ] = useState(base_id || "");
//   const [ isEditMode, setIsEditMode ] = useState(!destinationId);
//   const [ error, setError ] = useState({ field: "", message: "" });
//   const renderToast = useToast();
//   const [ updateDestination, { loading: isUpdateLoading } ] = useUpdateDestinationMutation()

//   const onSubmit = (e: FormEvent ) => {
//     e.preventDefault();
//     setError({ field: "", message: "" });
//     if ( newAPIKey === api_key && newBaseID === base_id ) { setIsEditMode(false); return; }

//     setIsCheckLoading(true);

//     validateDestinationAuthentication({ integrationId: Integrations_Enum.Airtable, authentication: { api_key: newAPIKey!, base_id: newBaseID! }})
//     .then(({ isValid }) => {
//       if ( isValid ) {
//         setIsEditMode(false);
//         updateDestination({
//           variables: { destinationId, _set: { authentication: { api_key: newAPIKey, base_id: newBaseID }}}
//         })
//         .then(() => {
//           renderToast({
//             title: "Airtable Credential Updated",
//             status: "success"
//           })
//         })
//         return;
//       } else {
//         setError({ field: 'api_key', message: 'The API key is incorrect'})
//       }
//     })
//     .catch(() => {
//       renderToast({
//         status: 'error',
//         title: "Uh Oh",
//         message: "There was an error processing this request."
//       })
//     })
//     .finally(() => setIsCheckLoading(false))
//   }

//   const onCancel = () => {
//     setError({ field: "", message: "" });
//     setIsEditMode(false);

//     setNewAPIKey(api_key || "");
//     setNewBaseID(base_id || "");
//   }

//   const onChange = (part: 'api_key' | 'base_id', value: string) => {
//     onChangeProp && onChangeProp({ api_key: newAPIKey, base_id: newBaseID, [ part ]: value });
//     if ( part === 'api_key' ) { setNewAPIKey(value) }
//     if ( part === 'base_id' ) { setNewBaseID(value) }
//   }


//   return (
//     <form onSubmit = { destinationId && onSubmit }>
//       <Stack direction = 'column' spacing = "2" mt = "2">
//         <Stack spacing = "2" direction = {{ base: 'column', md: 'row' }} width = "full">
//           <FormControl isInvalid = { error.field === 'api_key' || !!errorMessage }>
//             <FormLabelWithTooltip tooltipText = "You can find your Airtable API Key by logging into Airtable and then going to your account page">API Key</FormLabelWithTooltip>
//             <Input 
//               value = { newAPIKey }
//               variant = { isEditMode ? 'outline' : 'flushed' }
//               onFocus = { () => !isEditMode && setIsEditMode(true) }
//               onChange = { e => onChange('api_key', e.target.value) }
//             />
//             <FormErrorMessage>{ error.message || errorMessage }</FormErrorMessage>
//           </FormControl>

//           <FormControl>
//             <FormLabelWithTooltip tooltipText = "On 'https://airtable.com/api', click on your base. Its base ID can be found in the introduction on the page.">Base ID</FormLabelWithTooltip>
//             <Input 
//               value = { newBaseID }
//               variant = { isEditMode ? 'outline' : 'flushed' }
//               onFocus = { () => !isEditMode && setIsEditMode(true) }
//               onChange = { e => onChange('base_id', e.target.value) }
//             />
//             <FormErrorMessage>{ error.message }</FormErrorMessage>
//           </FormControl>
//         </Stack>
//         { destinationId 
//           ? isEditMode 
//             ? (
//               <Stack justifyContent = {{ base: 'stretch', md: 'flex-end' }} spacing = "1" direction = {{ base: 'column-reverse', md: 'row' }} width = 'full'>
//                 <Button leftIcon = {<Cross1Icon /> } onClick = { onCancel }>Cancel</Button>
//                 <Button type = "submit" isDisabled = { newAPIKey.length === 0 || newBaseID.length === 0 } isLoading = { isCheckLoading || isUpdateLoading } leftIcon = {<CheckIcon /> } variant = 'primary'>Save</Button>
//               </Stack>
//             ) : (
//               <Flex justifyContent = {{ base: 'stretch', md: 'flex-end' }} width = "full">
//                 <Button
//                   size = "sm"
//                   leftIcon = { <Pencil2Icon /> }
//                   onClick = { () => setIsEditMode(true) }
//                 >Edit
//                 </Button>
//               </Flex>
//             )
//           : null 
//         }
//       </Stack>
//     </form>
//   )
// }