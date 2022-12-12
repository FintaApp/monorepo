import * as baremetrics from "./baremetrics"
import { graphql } from "~/graphql/backend";
import { Integrations_Enum } from "~/graphql/backend/sdk";

export const insights = async () => {
  // const { arr, mrr, net_revenue, subscriptions, trials } = await baremetrics.metrics();
  // const { destinations, itemsCount } = await graphql.GetInsights().then(response => {
  //   const destinations = Object.fromEntries(response.integrations.map(integration => {
  //     return [ integration.id, integration.destinations_aggregate.aggregate?.count || 0 ]
  //   })) as Record<Integrations_Enum, number>;
    
  //   const itemsCount = response.plaid_items_aggregate.aggregate?.count || 0;
  //   return { destinations, itemsCount }
  // });

  // return Promise.all([
  //   logsnag.insight({ title: 'ARR', value: `$${arr.toLocaleString()}`, icon: "📈" }),
  //   logsnag.insight({ title: 'MRR', value: `$${mrr.toLocaleString()}`, icon: "📈" }),
  //   logsnag.insight({ title: 'Net Revenue', value: `$${net_revenue.toLocaleString()}`, icon: "💰" }),
  //   logsnag.insight({ title: 'Monthly Subscribers', value: subscriptions.month, icon: "👤" }),
  //   logsnag.insight({ title: 'Yearly Subscribers', value: subscriptions.year, icon: "👤" }),
  //   logsnag.insight({ title: 'Current Trials', value: trials, icon: "⏳" }),
  //   logsnag.insight({ title: "Airtable Destinations", value: destinations.airtable, icon: "🗺" }),
  //   logsnag.insight({ title: "Coda Destinations", value: destinations.coda, icon: "🗺" }),
  //   logsnag.insight({ title: "Notion Destinations", value: destinations.notion, icon: "🗺" }),
  //   logsnag.insight({ title: "Google Sheet Destinations", value: destinations.google, icon: "🗺" }),
  //   logsnag.insight({ title: "Total Items", value: itemsCount, icon: "🏦" })
  // ]);
}