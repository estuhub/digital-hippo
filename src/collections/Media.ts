import { User } from "../payload-types";
import { Access, CollectionConfig } from "payload/types";

// Function to check if the user is an admin or has access to images
const isAdminOrHasAccessToImages =
  (): Access =>
  async ({ req }) => {
    // Extract user information from the request
    const user = req.user as User | undefined;

    // If no user is present, deny access
    if (!user) return false;

    // If the user is an admin, grant access
    if (user.role === "admin") return true;

    // Otherwise, restrict access to images owned by the user
    return {
      user: {
        equals: req.user.id,
      },
    };
  };

// Configuration for the "media" collection in the Payload CMS
export const Media: CollectionConfig = {
  slug: "media", // Unique identifier for the collection
  hooks: {
    // Before changing data, set the user field to the ID of the authenticated user
    beforeChange: [
      ({ req, data }) => {
        return { ...data, user: req.user.id };
      },
    ],
  },
  access: {
    // Define access control for reading media
    read: async ({ req }) => {
      // Get the referer header from the request
      const referer = req.headers.referer;

      // If there is no user or the referer does not include "sell," grant access
      if (!req.user || !referer?.includes("sell")) return true;

      // Check if the user is an admin or has access to images
      return await isAdminOrHasAccessToImages()({ req });
    },
    // Define access control for deleting and updating media
    delete: isAdminOrHasAccessToImages(),
    update: isAdminOrHasAccessToImages(),
  },
  admin: {
    // Hide the "media" collection in the admin interface for non-admin users
    hidden: ({ user }) => user.role !== "admin",
  },
  upload: {
    // Configuration for uploading media files
    staticURL: "/media", // URL where media files will be served
    staticDir: "media", // Directory where media files will be stored
    imageSizes: [
      // Define different image sizes and their configurations
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "tablet",
        width: 1024,
        height: undefined, // Maintain aspect ratio
        position: "centre",
      },
    ],
    mimeTypes: ["image/*"], // Allow only image mime types
  },
  fields: [
    // Define the "user" field as a relationship to the "users" collection
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
  ],
};
