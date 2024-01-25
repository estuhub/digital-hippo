"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
// Import necessary modules and components
var PrimaryActionEmail_1 = require("../components/emails/PrimaryActionEmail");
// Access control function to determine if the user has permission to access the collection
var adminsAndUser = function (_a) {
    var user = _a.req.user;
    // Allow access for admin users
    if (user.role === "admin")
        return true;
    // Limit access to the user's own data using the user's ID
    return {
        id: {
            equals: user.id,
        },
    };
};
// Configuration for the Users collection
exports.Users = {
    // Collection slug used in the database
    slug: "users",
    // Authentication settings for the collection
    auth: {
        // Verification settings for email verification
        verify: {
            generateEmailHTML: function (_a) {
                var token = _a.token;
                // Generate email HTML using the PrimaryActionEmailHtml component
                return (0, PrimaryActionEmail_1.PrimaryActionEmailHtml)({
                    actionLabel: "verify your account",
                    buttonText: "Verify Account",
                    href: "".concat(process.env.NEXT_PUBLIC_SERVER_URL, "/verify-email?token=").concat(token),
                });
            },
        },
    },
    // Access control rules for different collection operations
    access: {
        // Read access for both admins and the user associated with the data
        read: adminsAndUser,
        // Create access allowed for all users
        create: function () { return true; },
        // Update access allowed only for admin users
        update: function (_a) {
            var req = _a.req;
            return req.user.role === "admin";
        },
        // Delete access allowed only for admin users
        delete: function (_a) {
            var req = _a.req;
            return req.user.role === "admin";
        },
    },
    // Admin panel configuration for the Users collection
    admin: {
        // Hide the collection from non-admin users
        hidden: function (_a) {
            var user = _a.user;
            return user.role !== "admin";
        },
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
                condition: function () { return false; },
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
                condition: function () { return false; },
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
