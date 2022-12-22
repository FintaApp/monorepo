import { Integration } from "@prisma/client";

export const integrationsMeta = {
  Airtable: {
    name: 'Airtable',
    logo: '/logos/airtable-logo.png'
  },
  Coda: {
    name: 'Coda',
    logo: "/logos/coda-logo.png"
  },
  Google: {
    name: 'Google Sheets',
    logo: "/logos/google-logo.png"
  },
  Notion: {
    name: "Notion",
    logo: "/logos/notion-logo.png"
  }
} as Record<Integration, { name: string; logo: string }>