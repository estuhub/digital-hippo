import { CollectionConfig } from "payload/types";

export const Users: CollectionConfig = {
  slug: "users",
  // Indicates that authentication is enabled for this collection.
  // This suggests that user data may be sensitive and requires authentication.
  auth: true,
  // Defines access control rules for the collection to different types of users.
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: "role",
      defaultValue: "user",
      required: true,
      // admin: {
      //   condition: () => false,
      // },
      type: "select",
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "User",
          value: "user",
        },
      ],
    },
  ],
};

// Users is the auth collection, so it's special and we need to set the auth to true to make this file accesible
