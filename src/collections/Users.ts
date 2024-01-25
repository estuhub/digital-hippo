// Import necessary modules and components
import { PrimaryActionEmailHtml } from "../components/emails/PrimaryActionEmail";
import { Access, CollectionConfig } from "payload/types";

// Access control function to determine if the user has permission to access the collection
const adminsAndUser: Access = ({ req: { user } }) => {
  // Allow access for admin users
  if (user.role === "admin") return true;

  // Limit access to the user's own data using the user's ID
  return {
    id: {
      equals: user.id,
    },
  };
};

// Configuration for the Users collection
export const Users: CollectionConfig = {
  // Collection slug used in the database
  slug: "users",

  // Authentication settings for the collection
  auth: {
    // Verification settings for email verification
    verify: {
      generateEmailHTML: ({ token }) => {
        // Generate email HTML using the PrimaryActionEmailHtml component
        return PrimaryActionEmailHtml({
          actionLabel: "verify your account",
          buttonText: "Verify Account",
          href: `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}`,
        });
      },
    },
  },

  // Access control rules for different collection operations
  access: {
    // Read access for both admins and the user associated with the data
    read: adminsAndUser,
    // Create access allowed for all users
    create: () => true,
    // Update access allowed only for admin users
    update: ({ req }) => req.user.role === "admin",
    // Delete access allowed only for admin users
    delete: ({ req }) => req.user.role === "admin",
  },

  // Admin panel configuration for the Users collection
  admin: {
    // Hide the collection from non-admin users
    hidden: ({ user }) => user.role !== "admin",
    // Specify default columns to display in the admin panel
    defaultColumns: ["id"],
  },

  // Fields definition for the Users collection
  fields: [
    {
      name: "products",
      label: "Products",
      // Disable this field in the admin panel
      admin: {
        condition: () => false,
      },
      type: "relationship",
      relationTo: "products",
      hasMany: true,
    },
    {
      name: "product_files",
      label: "Product files",
      // Disable this field in the admin panel
      admin: {
        condition: () => false,
      },
      type: "relationship",
      relationTo: "product_files",
      hasMany: true,
    },
    {
      name: "role",
      // Set a default value for the 'role' field
      defaultValue: "user",
      // Make the 'role' field required
      required: true,

      // Specify the type of the 'role' field as a select dropdown
      type: "select",
      // Define options for the select dropdown
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
    },
  ],
};
