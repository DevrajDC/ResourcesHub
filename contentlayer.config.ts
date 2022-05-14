import { defineDocumentType, makeSource } from 'contentlayer/source-files';

// const Collection = defineDocumentType(() => ({
//   name: 'Collection',
// }));

export const Resource = defineDocumentType(() => ({
  name: 'Resource',
  filePathPattern: `**/*.json`,
  contentType: 'data',
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
      description: 'Image for the resource',
      required: true,
    },
    link: {
      type: 'string',
      required: true,
    },
    tags: {
      type: 'list',
      of: {
        type: 'string',
      },
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (resource) => `/resources/${resource._raw.flattenedPath}`,
    },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Resource],
});
