import { Field, Integration, Table } from "@prisma/client";

import { NotionPropertyType, AirtableFieldType } from "~/types/shared/models";

export const tableConfigsMeta = [
  // Institutions

  { table: Table.Institutions, isRequired: true, templateName: "Institutions", fields: [
    { field: Field.Id, 
      label: "Institution ID", 
      templateName: { withoutId: "ID"}, 
      isRequired: true, 
      allowedTypes: { 
        [Integration.Notion]: [ 'rich_text' ], 
        [Integration.Airtable]: [ 'singleLineText', 'richText', 'multilineText' ] 
    }},
    { field: Field.Name, 
      label: "Institution Name", 
      templateName: { withoutId: "Name"}, 
      isRequired: true, 
      allowedTypes: { 
        [Integration.Notion]: [ 'title' ], 
        [Integration.Airtable]: [ 'primary' ] 
    }},
    { field: Field.LastUpdate, 
      label: "Last Update", 
      templateName: { withoutId: "Last Update" }, 
      isRequired: true, 
      allowedTypes: { 
        [Integration.Notion]: [ 'date' ], 
        [Integration.Airtable]: [ 'date', 'dateTime' ] 
    }},
    { field: Field.Error, 
      label: "Error", 
      templateName: { withoutId: "Error" }, 
      isRequired: false, 
      allowedTypes: { 
        [Integration.Notion]: [ 'rich_text' ], 
        [Integration.Airtable]: [ 'singleLineText', 'richText', 'multilineText' ] 
    }}
  ]},

  // Accounts
  { table: Table.Accounts, isRequired: true, templateName: "Accounts", fields: [
    { field: Field.Institution, 
      label: "Related Institution", 
      templateName: { withoutId: "Institution", withId: "Institution ID" }, 
      isRequired: true, 
      allowedTypes: { 
        [Integration.Notion]: [ 'relation' ], 
        [Integration.Airtable]: [ 'multipleRecordLinks' ] 
      }
    },
    { field: Field.Id , 
      label: "Account ID", 
      templateName: { 
        withoutId: "ID"
      }, 
      isRequired: true, 
      allowedTypes: { 
        [Integration.Notion]: [ 'rich_text' ], 
        [Integration.Airtable]: [ 'singleLineText', 'richText', 'multilineText' ] 
      }
    },
    { field: Field.Name , 
      label: "Account Name", 
      templateName: { withoutId: "Name" }, 
      isRequired: true, 
      allowedTypes: { 
        [Integration.Notion]: [ 'title' ], 
        [Integration.Airtable]: [ 'primary' ] 
      }
    },
    { field: Field.Available , label: "Available Balance", templateName: { withoutId: "Available" }, isRequired: false, allowedTypes: { [Integration.Notion]: [ 'number' ], [Integration.Airtable]: [ 'currency', 'number'] }},
    { field: Field.Current , label: "Current Balance", templateName: { withoutId: "Current" }, isRequired: false, allowedTypes: { [Integration.Notion]: [ 'number' ], [Integration.Airtable]: [ 'currency', 'number'] }},
    { field: Field.Currency , label: "Account Currency", templateName: { withoutId: "Currency" }, isRequired: false, allowedTypes: { [Integration.Notion]: [ 'select' ], [Integration.Airtable]: [ 'multipleSelects', 'singleSelect', 'singleLineText', 'richText', 'multilineText' ] }},
    { field: Field.Mask , label: "Account Mask", templateName: { withoutId: "Mask" }, isRequired: false, allowedTypes: { [Integration.Notion]: [ 'rich_text' ], [Integration.Airtable]: [ 'singleLineText', 'richText', 'multilineText' ] }},
    { field: Field.Type , label: "Account Type", templateName: { withoutId: "Type" }, isRequired: false, allowedTypes: { [Integration.Notion]: [ 'select' ], [Integration.Airtable]: [ 'multipleSelects', 'singleSelect' ] }},
    { field: Field.Subtype , label: "Account Subtype", templateName: { withoutId: "Subtype" }, isRequired: false, allowedTypes: { [Integration.Notion]: [ 'select' ], [Integration.Airtable]: [ 'multipleSelects', 'singleSelect' ] }},
    { field: Field.Limit , label: "Account Limit", templateName: { withoutId: "Limit" }, isRequired: false, allowedTypes: { [Integration.Notion]: [ 'number' ], [Integration.Airtable]: [ 'currency', 'number'] }},
    { field: Field.InterestRate , label: "Liability Interest Rate", templateName: { withoutId: "Interest Rate" }, isRequired: false, allowedTypes: { [Integration.Notion]: [ 'number' ], [Integration.Airtable]: [ 'number' ] }},
    { field: Field.LastPaymentAmount , label: "Last Payment Amount", templateName: { withoutId: "Last Payment Amount" }, isRequired: false, allowedTypes: { [Integration.Notion]: [ 'number' ], [Integration.Airtable]: [ 'currency', 'number'] }},
    { field: Field.LastPaymentDate , label: "Last Payment Date", templateName: { withoutId: "Last Payment Date" }, isRequired: false, allowedTypes: { [Integration.Notion]: [ 'date' ], [Integration.Airtable]: [ 'date', 'dateTime' ] }},
    { field: Field.NextPaymentDueDate , label: "Next Payment Due Date", templateName: { withoutId: "Next Payment Due Date" }, isRequired: false, allowedTypes: { [Integration.Notion]: [ 'date' ], [Integration.Airtable]: [ 'date', 'dateTime' ] }},
    { field: Field.LastStatementBalance , label: "Last Statement Balance", templateName: { withoutId: "Last Statement Balance" }, isRequired: false, allowedTypes: { [Integration.Notion]: [ 'number' ], [Integration.Airtable]: [ 'currency', 'number'] }},
    { field: Field.MinimumPaymentAmount , label: "Minimum Payment Amount", templateName: { withoutId: "Minimum Payment Amount" }, isRequired: false, allowedTypes: { [Integration.Notion]: [ 'number' ], [Integration.Airtable]: [ 'currency', 'number'] }},
    { field: Field.NextMonthlyPayment , label: "Next Monthly Payment", templateName: { withoutId: "Next Monthly Payment" }, isRequired: false, allowedTypes: { [Integration.Notion]: [ 'number' ], [Integration.Airtable]: [ 'currency', 'number'] }},
    { field: Field.OriginationDate , label: "Origination Date", templateName: { withoutId: "Origination Date" }, isRequired: false, allowedTypes: { [Integration.Notion]: [ 'date' ], [Integration.Airtable]: [ 'date', 'dateTime' ] }},
    { field: Field.OriginationPrincipalAmount , label: "Origination Principal Amount", templateName: { withoutId: "Origination Principal Amount" }, isRequired: false, allowedTypes: { [Integration.Notion]: [ 'number' ], [Integration.Airtable]: [ 'currency', 'number'] }}
  ]},

  // Transactions
  { table: Table.Transactions, isRequired: false, templateName: "Transactions", fields: [
    { field: Field.Account, label: "Related Account", templateName: { withoutId: "Account", withId: "Account ID" }, isRequired: true, allowedTypes: { [Integration.Notion]: [ 'relation' ], [Integration.Airtable]: [ 'multipleRecordLinks' ] }},
    { field: Field.Summary, label: "Transaction Summary", templateName: { withoutId: "Summary" }, isRequired: true, allowedTypes: { [Integration.Notion]: [ 'title' ], [Integration.Airtable]: [ 'primary' ] }},
    { field: Field.Id, label: "Transaction ID", templateName: { withoutId: "ID" }, isRequired: true, allowedTypes: { [Integration.Notion]: ['rich_text'], [Integration.Airtable]: [ 'singleLineText', 'richText', 'multilineText' ] }},
    { field: Field.Date, label: "Transaction Date", templateName: { withoutId: "Date" }, isRequired: true, allowedTypes: { [Integration.Notion]: [ 'date' ], [Integration.Airtable]: [ 'date', 'dateTime' ] }},
    { field: Field.Amount, label: "Transaction Amount", templateName: { withoutId: "Amount" }, isRequired: true, allowedTypes: { [Integration.Notion]: [ 'number' ], [Integration.Airtable]: [ 'currency', 'number'] }},
    { field: Field.Currency, label: "Transaction Currency", templateName: { withoutId: "Currency" }, isRequired: false, allowedTypes: { [Integration.Notion]: ['select'], [Integration.Airtable]: [ 'multipleSelects', 'singleSelect', 'singleLineText', 'richText', 'multilineText' ] }},
    { field: Field.IsPending, label: "Pending Status", templateName: { withoutId: "Pending?" }, isRequired: false, allowedTypes: { [Integration.Notion]: ['checkbox'], [Integration.Airtable]: [ 'checkbox' ] }},
    { field: Field.Category, label: "Transaction Category", templateName: { withoutId: "Category", withId: "Category ID" }, isRequired: false, allowedTypes: { [Integration.Notion]: [ 'relation' ], [Integration.Airtable]: [ 'multipleRecordLinks' ] }},
    { field: Field.SubAccount, label: "Transaction Sub-Account", templateName: { withoutId: "Sub Account" }, isRequired: false, allowedTypes: { [Integration.Notion]: ['rich_text'], [Integration.Airtable]: [ 'singleLineText', 'richText', 'multilineText' ] }}
  ]},

  // Categories
  { table: Table.Categories, isRequired: true, templateName: "Categories", fields: [
    { field: Field.Name, label: "Category Name", templateName: { withoutId: "Name" }, isRequired: true, allowedTypes: { [Integration.Notion]: ['title'], [Integration.Airtable]: [ 'primary' ] }},
    { field: Field.Id, label: "Category ID", templateName: { withoutId: "ID" }, isRequired: true, allowedTypes: { [Integration.Notion]: [ 'rich_text' ], [Integration.Airtable]: [ 'singleLineText', 'richText', 'multilineText' ] }},
    { field: Field.Group, label: "Category Group", templateName: { withoutId: "Category Group" }, isRequired: false, allowedTypes: { [Integration.Notion]: ['select'], [Integration.Airtable]: [ 'multipleSelects', 'singleSelect' ] }}
  ]},

  // Holdings
  { table: Table.Holdings, isRequired: false, templateName: "Holdings", fields: [
    { field: Field.Account, label: "Related Account", templateName: { withoutId: "Account", withId: "Account ID" }, isRequired: true, allowedTypes: { [Integration.Notion]: ['relation'], [Integration.Airtable]: ['multipleRecordLinks']}},
    { field: Field.Security, label: "Related Security", templateName: { withoutId: "Security", withId: "Security ID" }, isRequired: true, allowedTypes: { [Integration.Notion]: ['relation'], [Integration.Airtable]: ['multipleRecordLinks'] }},
    { field: Field.Summary, label: "Summary", templateName: { withoutId: "Summary" }, isRequired: true, allowedTypes: { [Integration.Notion]: ['title'], [Integration.Airtable]: [ 'primary' ]}, hideFor: [ Integration.Google ] },
    { field: Field.Quantity, label: "Quantity", templateName: { withoutId: "Quantity" }, isRequired: true, allowedTypes: { [Integration.Notion]: ['number'], [Integration.Airtable]: [ 'currency', 'number']}},
    { field: Field.CostBasis, label: "Cost Basis", templateName: { withoutId: "Cost Basis" }, isRequired: false, allowedTypes: { [Integration.Notion]: ['number'], [Integration.Airtable]: [ 'currency', 'number']}},
    { field: Field.Currency, label: "Base Currency", templateName: { withoutId: "Currency" }, isRequired: false, allowedTypes: { [Integration.Notion]: ['select'], [Integration.Airtable]: [ 'multipleSelects', 'singleSelect', 'singleLineText', 'richText', 'multilineText' ]}}
  ]},

  // Investment Transactions
  { table: Table.InvestmentTransactions, isRequired: false, templateName: "Investment Transactions", fields: [
    { field: Field.Account, label: "Related Account", templateName: { withoutId: "Account", withId: "Account ID" }, isRequired: true, allowedTypes: { [Integration.Notion]: ['relation'], [Integration.Airtable]: ['multipleRecordLinks']}},
    { field: Field.Security, label: "Related Security", templateName: { withoutId: "Security", withId: "Security ID" }, isRequired: true, allowedTypes: { [Integration.Notion]: ['relation'], [Integration.Airtable]: ['multipleRecordLinks']}},
    { field: Field.Summary, label: "Transaction Summary", templateName: { withoutId: "Summary" }, isRequired: true, allowedTypes: { [Integration.Notion]: ['title'], [Integration.Airtable]: [ 'primary' ]}},
    { field: Field.Id, label: "Transaction ID", templateName: { withoutId: "ID" }, isRequired: true, allowedTypes: { [Integration.Notion]: ['rich_text'], [Integration.Airtable]: [ 'singleLineText', 'richText', 'multilineText' ]}},
    { field: Field.Date, label: "Date", templateName: { withoutId: "Date" }, isRequired: true, allowedTypes: { [Integration.Notion]: ['date'], [Integration.Airtable]: [ 'date', 'dateTime' ]}},
    { field: Field.Quantity, label: "Quantity", templateName: { withoutId: "Quantity" }, isRequired: true, allowedTypes: { [Integration.Notion]: ['number'], [Integration.Airtable]: [ 'number']}},
    { field: Field.Price, label: "Price", templateName: { withoutId: "Price" }, isRequired: true, allowedTypes: { [Integration.Notion]: ['number'], [Integration.Airtable]: [ 'currency', 'number']}},
    { field: Field.Amount, label: "Amount", templateName: { withoutId: "Amount" }, isRequired: false, allowedTypes: { [Integration.Notion]: ['number'], [Integration.Airtable]: [ 'currency', 'number']}},
    { field: Field.Fees, label: "Fees", templateName: { withoutId: "Fees" }, isRequired: false, allowedTypes: { [Integration.Notion]: ['number'], [Integration.Airtable]: [ 'currency', 'number']}},
    { field: Field.Currency, label: "Base Currency", templateName: { withoutId: "Currency" }, isRequired: false, allowedTypes: { [Integration.Notion]: ['select'], [Integration.Airtable]: [ 'multipleSelects', 'singleSelect', 'singleLineText', 'richText', 'multilineText' ]}},
    { field: Field.Type, label: "Transaction Type", templateName: { withoutId: "Type" }, isRequired: false, allowedTypes: { [Integration.Notion]: ['select'], [Integration.Airtable]: [ 'multipleSelects', 'singleSelect' ]}},
    { field: Field.Subtype, label: "Transaction Subtype", templateName: { withoutId: "Subtype" }, isRequired: false, allowedTypes: { [Integration.Notion]: ['select'], [Integration.Airtable]: [ 'multipleSelects', 'singleSelect' ]}}

  ]},

  // Securities
  { table: Table.Securities, isRequired: true, templateName: "Securities", fields: [
    { field: Field.Symbol, label: "Symbol", templateName: { withoutId: "Symbol" }, isRequired: true, allowedTypes: { [Integration.Notion]: ['title'], [Integration.Airtable]: [ 'primary' ]}},
    { field: Field.Id, label: "Security ID", templateName: { withoutId: "ID" }, isRequired: true, allowedTypes: { [Integration.Notion]: ['rich_text'], [Integration.Airtable]: [ 'singleLineText', 'richText', 'multilineText' ]}},
    { field: Field.Name, label: "Security Name", templateName: { withoutId: "Name" }, isRequired: false, allowedTypes: { [Integration.Notion]: ['rich_text'], [Integration.Airtable]: [ 'singleLineText', 'richText', 'multilineText' ]}},
    { field: Field.ClosePrice, label: "Close Price", templateName: { withoutId: "Close Price" }, isRequired: false, allowedTypes: { [Integration.Notion]: ['number'], [Integration.Airtable]: [ 'currency', 'number']}},
    { field: Field.ClosePriceAsOf, label: "Close Price As Of", templateName: { withoutId: "Close Price As Of" }, isRequired: false, allowedTypes: { [Integration.Notion]: ['date'], [Integration.Airtable]: [ 'date', 'dateTime' ]}},
    { field: Field.Type, label: "Security Type", templateName: { withoutId: "Type" }, isRequired: false, allowedTypes: { [Integration.Notion]: ['select'], [Integration.Airtable]: [ 'multipleSelects', 'singleSelect' ]}}
  ]}
] as {
    table: Table; isRequired: boolean; templateName: string; fields: {
    field: Field, label: string; templateName: { withId?: string; withoutId: string; }; isRequired: boolean, hideFor?: Integration[]; allowedTypes: { [Integration.Notion]: NotionPropertyType[], [Integration.Airtable]: AirtableFieldType[], [Integration.Coda]?: [], [Integration.Google]?: [] }
  }[]
}[]