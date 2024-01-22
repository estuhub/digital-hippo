import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { Product } from "../../payload-types";
import { PRODUCT_CATEGORIES } from "../../config";
import { CollectionConfig } from "payload/types";
import { stripe } from "../../lib/stripe";

const addUser: BeforeChangeHook<Product> = async ({ req, data }) => {
  const user = req.user;
  return { ...data, user: user.id };
};

// Collection configuration for the "Products" collection
export const Products: CollectionConfig = {
  slug: "products", // Unique identifier for the collection
  // Admin configuration for display purposes
  admin: {
    useAsTitle: "name", // Use the "name" field as the title in the admin interface
  },
  // Access control settings for various operations (read, update, delete, create)
  access: {},
  // Hooks configuration to execute functions before changes
  hooks: {
    beforeChange: [
      addUser, // Execute addUser hook
      async (args) => {
        // Additional hook logic for create and update operations
        if (args.operation === "create") {
          // Logic for creating a new product
          const data = args.data as Product;

          // Create a new product on Stripe
          const createdProduct = await stripe.products.create({
            name: data.name,
            default_price_data: {
              currency: "USD",
              unit_amount: Math.round(data.price * 100),
            },
          });

          // Update the product data with Stripe IDs
          const updated: Product = {
            ...data,
            stripeId: createdProduct.id,
            priceId: createdProduct.default_price as string,
          };

          return updated;
        } else if (args.operation === "update") {
          // Logic for updating an existing product
          const data = args.data as Product;

          // Update the product on Stripe
          const updatedProduct = await stripe.products.update(data.stripeId!, {
            name: data.name,
            default_price: data.priceId!,
          });

          // Update the product data with new Stripe IDs
          const updated: Product = {
            ...data,
            stripeId: updatedProduct.id,
            priceId: updatedProduct.default_price as string,
          };

          return updated;
        }
      },
    ],
  },
  // Fields configuration for the collection
  fields: [
    // Relationship field for the 'user' associated with the product
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
    // Text field for the product name
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    // Textarea field for product details
    {
      name: "description",
      label: "Product Details",
      type: "textarea",
    },
    // Number field for the product price
    {
      name: "price",
      label: "Price in USD",
      type: "number",
      required: true,
      min: 0,
      max: 1000,
    },
    // Select field for the product category
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      options: PRODUCT_CATEGORIES.map(({ label, value }) => ({ label, value })),
    },
    // Relationship field for product files
    {
      name: "product_files",
      label: "Product File(s)",
      type: "relationship",
      relationTo: "product_files",
      required: true,
      hasMany: false,
    },
    // Select field for product status
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
    // Text field for the Stripe ID of the product (hidden in the admin interface)
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
    // Text field for the Stripe ID of the product (hidden in the admin interface)
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
    // Array field for product images
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
