// contentlayer.config.js
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import readingTime from "reading-time";
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
    id: integrationField
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, "")
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
  computedFields: {
    readingTime: { type: "json", resolve: (doc) => readingTime(doc.body.raw) },
    wordCount: {
      type: "number",
      resolve: (doc) => doc.body.raw.split(/\s+/gu).length
    },
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, "")
    }
  }
}));
var Documentation = defineDocumentType(() => ({
  name: "Documentation",
  filePathPattern: "docs/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true }
  }
}));
var contentLayerConfig = makeSource({
  contentDirPath: "data",
  documentTypes: [Integration, BlogPost, Documentation]
});
//# sourceMappingURL=compiled-contentlayer-config-LWVIRERX.mjs.map
