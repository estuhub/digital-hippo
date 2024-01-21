import { buildConfig } from "payload/config";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { slateEditor } from "@payloadcms/richtext-slate";
import path from "path";
import dotenv from "dotenv";
import { Users } from "./collections/Users";
import { Products } from "./collections/Products/Products";
import { Media } from "./collections/Media";
import { ProductFiles } from "./collections/ProductFile";
import { Orders } from "./collections/Orders";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// Build Payload Configuration
export default buildConfig({
  // Payload CMS Configuration Options:
  // Sets the server URL for the Payload CMS, using the value from the NEXT_PUBLIC_SERVER_URL environment variable or an empty string if not defined.
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
  // Specifies the collections (content types) used in the CMS.
  collections: [Users, Products, Media, ProductFiles, Orders],
  // Defines custom routes, such as the admin route being set to "/sell".
  routes: {
    admin: "/sell",
  },
  // Configures admin-related settings, including the user collection, bundler, and meta information for SEO.
  admin: {
    user: "users",
    bundler: webpackBundler(),
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
  editor: slateEditor({}),
  // Configures the database adapter, using MongoDB as the database and the URL from the MONGODB_URL environment variable.
  db: mongooseAdapter({
    url: process.env.MONGODB_URL!,
  }),
  // Specifies TypeScript-related options, such as the output file for generated types.
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
});

// This configuration file defines how the Payload CMS should behave, including its server URL, collections,
// routes, admin settings, rate-limiting, editor configuration, database connection, and TypeScript-related settings.
// The configuration provides flexibility to tailor the CMS to specific needs.
