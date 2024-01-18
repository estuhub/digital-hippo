This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# Packages Used in this Project

## Components Library: ShadCN/UI

For reusable NextJS components. For more info, check [documentation](https://ui.shadcn.com/docs) \
To install: `npx shadcn-ui@latest init`

## Icons: Lucide

For more info, check [documentation](https://lucide.dev/guide/packages/lucide-react) \
To install: `npm install lucide-react`

## Express

Used for server side rendering. For more info, check [documentation](https://www.npmjs.com/package/express) \
To install: `npm install express` \
To add types: `npm install -D --save @types/express`

## Headless CMS: Payload

For more info, check [documentation](https://www.npmjs.com/package/payload) \
To install: `npm i payload`

## cross-env

For more info, check [documentation](https://www.npmjs.com/package/cross-env) \
To install: `npm install --save-dev cross-env`

## Editor: slate.js with Payload

For more info, check [documentation](https://payloadcms.com/docs/rich-text/slate) \
To install: `npm install --save @payloadcms/richtext-slate`

## Backend: bundle-webpack with Payload

For more info, check [documentation](https://payloadcms.com/docs/admin/webpack) \
To install: `npm install @payloadcms/bundler-webpack`

## Database: MongoDB with Payload

For more info, check [documentation](https://www.npmjs.com/package/@payloadcms/db-mongodb) \
To install: `npm install @payloadcms/db-mongodb`

## Form: react-hook-form, @hookform/resolver, zod & sooner

### react-hook-form

For form handling. For more info, check [documentation](https://www.npmjs.com/package/react-hook-form) \
To install: `npm i react-hook-form`

### @hookform/resolvers

For form validation. For more info, check [documentation](https://www.npmjs.com/package/@hookform/resolvers/v/1.3.7) \
To install: `npm i @hookform/resolvers`

### zod

For schema validation library. For more info, check [documentation](https://www.npmjs.com/package/zod) \
To install: `npm i zod`

### sonner

For toast notification library. For more info, check [documentation](https://www.npmjs.com/package/sonner) \
To install: `npm i sonner`

## tRPR & [Tanstack](https://tanstack.com/query/v4/docs/react/installation)

A tool for building and consuming TypeScript RPC services. Type safety to back end and front end. For more info, check [documentation](https://trpc.io/docs/quickstart) \
To install: `npm i @trpc/client @trpc/server @trpc/next @trpc/react-query @tanstack/react-query`
