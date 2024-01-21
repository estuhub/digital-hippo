import { PRODUCT_CATEGORIES } from "../../config";
import { CollectionConfig } from "payload/types";

// Collection configuration for the "Products" collection
export const Products: CollectionConfig = {
  slug: "products", // Unique identifier for the collection
  // Admin configuration for display purposes
  admin: {
    useAsTitle: "name", // Use the "name" field as the title in the admin interface
  },
  // Access control settings for various operations (read, update, delete, create)
  access: {},
  // Fields configuration for the collection
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        condition: () => false, // Hide "user" field in the admin interface
      },
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Product Details",
      type: "textarea",
    },
    {
      name: "price",
      label: "Price in USD",
      type: "number",
      required: true,
      min: 0,
      max: 1000,
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      options: PRODUCT_CATEGORIES.map(({ label, value }) => ({ label, value })),
    },
    {
      name: "product_files",
      label: "Product File(s)",
      type: "relationship",
      relationTo: "product_files",
      required: true,
      hasMany: false,
    },
    {
      name: "approvedForSale",
      label: "Product Status",
      type: "select",
      defaultValue: "pending",
      access: {
        create: ({ req }) => req.user.role === "admin",
        read: ({ req }) => req.user.role === "admin",
        update: ({ req }) => req.user.role === "admin",
      },
      options: [
        {
          label: "Pending verification",
          value: "pending",
        },
        {
          label: "Approved",
          value: "approved",
        },
        {
          label: "Denied",
          value: "denied",
        },
      ],
    },
    {
      name: "priceId",
      type: "text",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      admin: {
        hidden: true, // Hide "priceId" field in the admin interface
      },
    },
    {
      name: "stripeId",
      type: "text",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      admin: {
        hidden: true, // Hide "stripeId" field in the admin interface
      },
    },
    {
      name: "images",
      label: "Product Images",
      labels: {
        singular: "Image",
        plural: "Image",
      },
      type: "array",
      required: true,
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};
