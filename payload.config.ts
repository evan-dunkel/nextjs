import { buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { CollectionConfig } from "payload/types";
import sharp from "sharp";
import path from "path";

const Media: CollectionConfig = {
  slug: "media",
  upload: {
    staticURL: "/api/media",
    staticDir: "media",
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*"],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
};

const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "technologies",
      type: "array",
      required: true,
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "githubUrl",
      type: "text",
      required: true,
    },
    {
      name: "liveUrl",
      type: "text",
      required: false,
    },
    {
      name: "size",
      type: "select",
      options: [
        { label: "Small", value: "small" },
        { label: "Medium", value: "medium" },
        { label: "Large", value: "large" },
      ],
      defaultValue: "small",
      required: true,
    },
  ],
};

export default buildConfig({
  editor: lexicalEditor(),
  collections: [Media, Projects],
  secret: process.env.PAYLOAD_SECRET || "",
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  sharp,
  upload: {
    limits: {
      fileSize: 5000000, // 5MB, adjust as needed
    },
  },
});
