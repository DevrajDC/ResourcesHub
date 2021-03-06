import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from 'contentlayer/source-files';
import { nanoid } from 'nanoid';

const Category = defineDocumentType(() => ({
  name: 'Category',
  filePathPattern: `**/*.json`,
  contentType: 'data',
  fields: {
    name: {
      type: 'string',
      required: true,
    },
    resources: {
      type: 'list',
      required: true,
      of: Resource,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (resource: any) => `/resources/${resource._raw.flattenedPath}`,
    },
  },
}));

export const Resource = defineNestedType(() => ({
  name: 'Resource',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the resource',
      required: true,
    },
    description: {
      type: 'string',
      description: 'The description of the resource',
      required: true,
    },
    image: {
      type: 'string',
      default: '', //TODO: Add a placeholder image url here
      description: 'Image for the resource',
    },
    url: {
      type: 'string',
      required: true,
    },
    _id: {
      type: 'string',
      required: true,
    },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Category],
});
