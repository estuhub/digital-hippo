import { User } from "../payload-types";
import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { Access, CollectionConfig } from "payload/types";

// Hook to add the user ID to the data before changing
const addUser: BeforeChangeHook = ({ req, data }) => {
  const user = req.user as User | null;
  return { ...data, user: user?.id };
};

// Access control function to allow reading product files that belong to the user or are purchased by the user
const yourOwnAndPurchased: Access = async ({ req }) => {
  const user = req.user as User | null;

  // If the user is an admin, grant access to all product files
  if (user?.role === "admin") return true;

  // If no user is present, deny access
  if (!user) return false;

  // Fetch products owned by the user
  const { docs: products } = await req.payload.find({
    collection: "products",
    depth: 0,
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  // Extract product file IDs owned by the user
  const ownProductFileIds = products.map((prod) => prod.product_files).flat();

  // Fetch orders made by the user
  const { docs: orders } = await req.payload.find({
    collection: "orders",
    depth: 2, // It indicates that the query should fetch data up to a depth of 2 levels of relationships
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  // Extract product file IDs purchased by the user
  const purchasedProductFileIds = orders
    .map((order) => {
      return order.products.map((product) => {
        if (typeof product === "string")
          return req.payload.logger.error(
            "Search depth not sufficient to find purchased file IDs"
          );

        return typeof product.product_files === "string"
          ? product.product_files
          : product.product_files.id;
      });
    })
    .filter(Boolean)
    .flat();

  // Return an access control condition based on the collected product file IDs
  return {
    id: {
      in: [...ownProductFileIds, ...purchasedProductFileIds],
    },
  };
};

// Configuration for the "product_files" collection in the Payload CMS
export const ProductFiles: CollectionConfig = {
  slug: "product_files", // Unique identifier for the collection
  admin: {
    // Hide the "product_files" collection in the admin interface for non-admin users
    hidden: ({ user }) => user.role !== "admin",
  },
  hooks: {
    // Before changing data, add the user ID to the data
    beforeChange: [addUser],
  },
  access: {
    // Define access control for reading, updating, and deleting product files
    read: yourOwnAndPurchased,
    update: ({ req }) => req.user.role === "admin", // Only admins can update product files
    delete: ({ req }) => req.user.role === "admin", // Only admins can delete product files
  },
  upload: {
    // Configuration for uploading product files
    staticURL: "/product_files", // URL where product files will be served
    staticDir: "product_files", // Directory where product files will be stored
    mimeTypes: ["image/*", "font/*", "application/postscript"], // Allow specific mime types
  },
  fields: [
    // Define the "user" field as a relationship to the "users" collection
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      admin: {
        condition: () => false,
      },
      hasMany: false,
      required: true,
    },
  ],
};
