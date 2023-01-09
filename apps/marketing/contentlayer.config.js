import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import readingTime from 'reading-time';

const computedFields = {
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, '')
  },
  slugAsParams: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
  },
  readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
  wordCount: {
    type: 'number',
    resolve: (doc) => doc.body.raw.split(/\s+/gu).length,
  }
}

const integrationField = {
  type: 'enum',
  options: ['airtable', 'coda', 'google', 'notion', 'none' ]
}

const categoryField = {
  type: 'enum',
  options: [ 'company', 'how-to' ],
  required: true
}

const Integration = defineDocumentType(() => ({
  name: 'Integration',
  filePathPattern: 'integrations/*.mdx',
  contentType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    logo: { type: 'string', required: true },
    id: integrationField,
    description: { type: 'string', required: true },
    companyUrl: { type: 'string', required: true },
  },
  computedFields
}))

const BlogPost = defineDocumentType(() => ({
  name: 'BlogPost',
  filePathPattern: 'posts/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    publishedAt: { type: 'string', required: true },
    image: { type: 'string', required: true },
    description: { type: 'string', required: true },
    category: categoryField,
    integration: integrationField,
    hasGenericPost: { type: 'boolean', required: true },
    cta: { type: 'string', required: true }
  },
  computedFields
}))

const Documentation = defineDocumentType(() => ({
  name: "Documentation",
  filePathPattern: 'docs/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true }
  },
  computedFields
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [ Integration, BlogPost, Documentation ],
});