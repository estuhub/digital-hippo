import { z } from "zod";
import { privateProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../get-payload";
import { stripe } from "../lib/stripe";
import type Stripe from "stripe";

// Router configuration for payment-related procedures
export const paymentRouter = router({
  // Procedure for creating a payment session
  createSession: privateProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      // Extracting user information from the context
      const { user } = ctx;
      let { productIds } = input;

      // Check if productIds array is empty, throw a bad request error if true
      if (productIds.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      // Fetching products from the payload collection
      const payload = await getPayloadClient();
      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          id: {
            in: productIds,
          },
        },
      });

      // Filtering products that have a valid priceId
      const filteredProducts = products.filter((product) =>
        Boolean(product.priceId)
      );

      // Creating an order in the 'orders' collection
      const order = await payload.create({
        collection: "orders",
        data: {
          _isPaid: false,
          products: filteredProducts.map((prod) => prod.id),
          user: user.id,
        },
      });

      // Creating line items for the Stripe checkout session
      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      filteredProducts.forEach((product) => {
        line_items.push({
          price: product.priceId!,
          quantity: 1,
        });
      });

      // Adding a placeholder line item (optional)
      line_items.push({
        price: "price_1ObK1NBs7dTHSh2vtdA9LKEg",
        quantity: 1,
        adjustable_quantity: {
          enabled: false,
        },
      });

      try {
        // Creating a Stripe checkout session
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          payment_method_types: ["card"],
          mode: "payment",
          metadata: {
            userId: user.id,
            orderId: order.id,
          },
          line_items,
        });

        // Returning the URL of the Stripe checkout session
        return { url: stripeSession.url };
      } catch (error) {
        // Handling errors, logging and returning a null URL
        console.log(error);
        return { url: null };
      }
    }),
});
