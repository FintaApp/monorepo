import { serve } from "inngest/next";
import { setupPlaidItem } from "~/lib/inngest/setupPlaidItem";

export default serve("Finta Jobs", [ setupPlaidItem ])