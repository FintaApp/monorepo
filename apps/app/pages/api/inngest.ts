import { serve } from "inngest/next";
import { setupPlaidItem } from "~/lib/inngest/setupPlaidItem";
import { syncDestination } from "~/lib/inngest/syncDestination";

export default serve("Finta Jobs", [ setupPlaidItem, syncDestination ])