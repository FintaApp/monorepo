// contentlayer.config.js
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import readingTime from "reading-time";
var computedFields = {
  slug: {
    type: "string",
    resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, "")
  },
  slugAsParams: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/")
  },
  readingTime: { type: "json", resolve: (doc) => readingTime(doc.body.raw) },
  wordCount: {
    type: "number",
    resolve: (doc) => doc.body.raw.split(/\s+/gu).length
  }
};
var integrationField = {
  type: "enum",
  options: ["airtable", "coda", "google", "notion"]
};
var categoryField = {
  type: "enum",
  options: ["company"],
  required: true
};
var Integration = defineDocumentType(() => ({
  name: "Integration",
  filePathPattern: "integrations/*.mdx",
  contentType: "mdx",
  fields: {
    name: { type: "string", required: true },
    logo: { type: "string", required: true },
    id: integrationField,
    shortDescription: { type: "string", required: true },
    companyUrl: { type: "string", required: true }
  },
  computedFields: {
    ...computedFields,
    title: {
      type: "string",
      resolve: (doc) => `Sync financial data to ${doc.name}`
    },
    description: {
      type: "string",
      resolve: (doc) => doc.shortDescription
    }
  }
}));
var BlogPost = defineDocumentType(() => ({
  name: "BlogPost",
  filePathPattern: "posts/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    publishedAt: { type: "string", required: true },
    image: { type: "string", required: true },
    description: { type: "string", required: true },
    seoDescription: { type: "string", required: true },
    category: categoryField,
    integrations: { type: "list", of: integrationField }
  },
  computedFields
}));
var Documentation = defineDocumentType(() => ({
  name: "Documentation",
  filePathPattern: "docs/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true }
  },
  computedFields
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Integration, BlogPost, Documentation]
});
export {
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-IXJSVNDW.mjs.map