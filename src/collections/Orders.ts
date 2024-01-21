import { Access, CollectionConfig } from "payload/types";

// Access control function to limit access to the orders
const yourOwn: Access = ({ req: { user } }) => {
  if (user.role === "admin") return true;

  return {
    user: {
      equals: user?.id,
    },
  };
};

// Collection configuration for the "Orders" collection
export const Orders: CollectionConfig = {
  slug: "orders", // Unique identifier for the collection
  // Admin configuration for display purposes
  admin: {
    useAsTitle: "Your Orders",
    description: "A summary of all your orders on DigitalHippo.",
  },
  // Access control settings for various operations (read, update, delete, create)
  access: {
    read: yourOwn, // Access control function for reading orders
    update: ({ req }) => req.user.role === "admin", // Only admins can update orders
    delete: ({ req }) => req.user.role === "admin", // Only admins can delete orders
    create: ({ req }) => req.user.role === "admin", // Only admins can create orders
  },
  // Fields configuration for the collection
  fields: [
    {
      name: "_isPaid",
      type: "checkbox",
      access: {
        read: ({ req }) => req.user.role === "admin", // Only admins can read the "_isPaid" field
        create: () => false, // Prevent users from setting "_isPaid" during order creation
        update: () => false, // Prevent users from updating "_isPaid" field
      },
      admin: {
        hidden: true, // Hide "_isPaid" field in the admin interface
      },
      required: true, // _isPaid field is required during order creation
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      admin: {
        hidden: true, // Hide "user" field in the admin interface
      },
    },
    {
      name: "products",
      type: "relationship",
      relationTo: "products",
      required: true,
      hasMany: true, // Indicates that an order can have multiple products
    },
  ],
};
