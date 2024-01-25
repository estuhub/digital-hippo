import {
  AfterChangeHook,
  BeforeChangeHook,
} from "payload/dist/collections/config/types";
import { PRODUCT_CATEGORIES } from "../../config";
import { Access, CollectionConfig } from "payload/types";
import { Product, User } from "../../payload-types";
import { stripe } from "../../lib/stripe";

// BeforeChange hook to add the user ID to the product data before creation
const addUser: BeforeChangeHook<Product> = async ({ req, data }) => {
  const user = req.user;
  return { ...data, user: user.id };
};

// AfterChange hook to sync the product ID with the user's products array after creation
const syncUser: AfterChangeHook<Product> = async ({ req, doc }) => {
  // Find the full user information based on the current user ID
  const fullUser = await req.payload.findByID({
    collection: "users",
    id: req.user.id,
  });

  // Check if the user information is found and is an object
  if (fullUser && typeof fullUser === "object") {
    // Extract the products array from the full user information
    const { products } = fullUser;

    // Create an array of all product IDs associated with the user
    const allIDs = [
      ...(products?.map((product) =>
        typeof product === "object" ? product.id : product
      ) || []),
    ];

    // Remove duplicate product IDs, keeping only the unique ones
    const createdProductIDs = allIDs.filter(
      (id, index) => allIDs.indexOf(id) === index
    );

    // Create an array of product IDs to update, including the new product
    const dataToUpdate = [...createdProductIDs, doc.id];

    // Update the user's products array with the new data
    await req.payload.update({
      collection: "users",
      id: fullUser.id,
      data: {
        products: dataToUpdate,
      },
    });
  }
};

// Access control function to determine if the user has permission to access the collection
const isAdminOrHasAccess =
  (): Access =>
  ({ req: { user: _user } }) => {
    // Extract the user information from the request
    const user = _user as User | undefined;

    // If no user is present, deny access
    if (!user) return false;

    // Grant access to admin users
    if (user.role === "admin") return true;

    // Extract product IDs associated with the user, handling different formats
    const userProductIDs = (user.products || []).reduce<Array<string>>(
      (acc, product) => {
        // Skip null or undefined products
        if (!product) return acc;

        // Add product ID to the array, handling different formats
        if (typeof product === "string") {
          acc.push(product);
        } else {
          acc.push(product.id);
        }

        return acc;
      },
      []
    );

    // Grant access to products that are associated with the user
    return {
      id: {
        in: userProductIDs,
      },
    };
  };

// Collection configuration for the "Products" collection
export const Products: CollectionConfig = {
  slug: "products", // Unique identifier for the collection
  // Admin configuration for display purposes
  admin: {
    useAsTitle: "name", // Use the "name" field as the title in the admin interface
  },
  access: {
    read: isAdminOrHasAccess(),
    update: isAdminOrHasAccess(),
    delete: isAdminOrHasAccess(),
  },
  // Access control settings for various operations (read, update, delete, create)
  // Hooks configuration to execute functions before changes
  hooks: {
    afterChange: [syncUser],
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
        plural: "Images",
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
