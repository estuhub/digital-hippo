"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("payload/config");
var bundler_webpack_1 = require("@payloadcms/bundler-webpack");
var db_mongodb_1 = require("@payloadcms/db-mongodb");
var richtext_slate_1 = require("@payloadcms/richtext-slate");
var path_1 = __importDefault(require("path"));
var dotenv_1 = __importDefault(require("dotenv"));
var Users_1 = require("./collections/Users");
var Products_1 = require("./collections/Products/Products");
var Media_1 = require("./collections/Media");
var ProductFile_1 = require("./collections/ProductFile");
var Orders_1 = require("./collections/Orders");
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, "../.env"),
});
// Build Payload Configuration
exports.default = (0, config_1.buildConfig)({
    // Payload CMS Configuration Options:
    // Sets the server URL for the Payload CMS, using the value from the NEXT_PUBLIC_SERVER_URL environment variable or an empty string if not defined.
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
    // Specifies the collections (content types) used in the CMS.
    collections: [Users_1.Users, Products_1.Products, Media_1.Media, ProductFile_1.ProductFiles, Orders_1.Orders],
    // Defines custom routes, such as the admin route being set to "/sell".
    routes: {
        admin: "/sell",
    },
    // Configures admin-related settings, including the user collection, bundler, and meta information for SEO.
    admin: {
        user: "users",
        bundler: (0, bundler_webpack_1.webpackBundler)(),
        meta: {
            titleSuffix: "- DigitalHippo",
            favicon: "/favicon.ico",
            ogImage: "/thumbnail.jpg",
        },
    },
    // Sets up rate-limiting with a maximum of 2000 requests.
    rateLimit: {
        max: 2000,
    },
    // Configures the rich text editor using the Slate editor.
    editor: (0, richtext_slate_1.slateEditor)({}),
    // Configures the database adapter, using MongoDB as the database and the URL from the MONGODB_URL environment variable.
    db: (0, db_mongodb_1.mongooseAdapter)({
        url: process.env.MONGODB_URL,
    }),
    // Specifies TypeScript-related options, such as the output file for generated types.
    typescript: {
        outputFile: path_1.default.resolve(__dirname, "payload-types.ts"),
    },
});
// This configuration file defines how the Payload CMS should behave, including its server URL, collections,
// routes, admin settings, rate-limiting, editor configuration, database connection, and TypeScript-related settings.
// The configuration provides flexibility to tailor the CMS to specific needs.
