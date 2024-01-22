import { getServerSideUser } from "@/lib/payload-utils";
import Image from "next/image";
import { cookies } from "next/headers";
import { getPayloadClient } from "@/get-payload";
import { notFound, redirect } from "next/navigation";
import { Product, ProductFile, User } from "@/payload-types";
import { PRODUCT_CATEGORIES } from "@/config";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

// Interface for page props
interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

// ThankYouPage functional component
const ThankYouPage = async ({ searchParams }: PageProps) => {
  // Extract orderId from searchParams
  const orderId = searchParams.orderId;
  const nextCookies = cookies();

  // Retrieve user data using getServerSideUser
  const { user } = await getServerSideUser(nextCookies);

  // Retrieve payload client
  const payload = await getPayloadClient();

  // Fetch order details from the database
  const { docs: orders } = await payload.find({
    collection: "orders",
    depth: 2, // Gives user data as well
    where: {
      id: {
        equals: orderId,
      },
    },
  });

  // Get the first order (if exists)
  const [order] = orders;

  // If no order is found, return a not found response
  if (!order) return notFound();

  // Extract user ID from the order
  const orderUserId =
    typeof order.user === "string" ? order.user : order.user.id;

  // If the user that made the order is not the same as the logged-in user, redirect to sign-in
  // origin --> sends them back to the page they were before redirected
  if (orderUserId !== user?.id) {
    return redirect(`/sign-in?origin=thank-you?orderId=${order.id}`);
  }

  // Extract products from the order
  const products = order.products as Product[];

  // Calculate the total price of the order
  const orderTotal = products.reduce((total, product) => {
    return total + product.price;
  }, 0);

  return (
    <main className="relative lg:min-h-full">
      {/* Display background image */}
      <div className="hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <Image
          fill
          src="/checkout-thank-you.jpg"
          className="h-full w-full object-cover object-center"
          alt="thank you for your order"
        />
      </div>

      <div>
        {/* Main content section */}
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
          {/* Right column for order details */}
          <div className="lg:col-start-2">
            {/* Order success message */}
            <p className="text-sm font-medium text-blue-600">
              Order successful
            </p>
            {/* Heading for the thank you message */}
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Thanks for ordering
            </h1>
            {/* Order status message based on payment */}
            {order._isPaid ? (
              <p className="mt-2 text-base text-muted-foreground">
                Your order was processed and your assets are available to
                download below. We&apos;ve sent your receipt and order details
                to{" "}
                {typeof order.user !== "string" ? (
                  <span className="font-medium text-gray-900">
                    {order.user.email}
                  </span>
                ) : null}
                .
              </p>
            ) : (
              <p className="mt-2 text-base text-muted-foreground">
                We appreciate your order, and we&apos;re currently processing
                it. So hang tight and we&apos;ll send you confirmation very
                soon!
              </p>
            )}

            {/* Order details section */}
            <div className="mt-16 text-sm font-medium">
              {/* Order number */}
              <div className="text-muted-foreground">Order nr.</div>
              <div className="mt-2 text-gray-900">{order.id}</div>

              {/* List of ordered products */}
              <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
                {/* Mapping through ordered products */}
                {(order.products as Product[]).map((product) => {
                  const label = PRODUCT_CATEGORIES.find(
                    ({ value }) => value === product.category
                  )?.label;

                  const downloadUrl = (product.product_files as ProductFile)
                    .url as string;

                  const { image } = product.images[0];

                  return (
                    <li key={product.id} className="flex space-x-6 py-6">
                      {/* Product image */}
                      <div className="relative h-24 w-24">
                        {typeof image !== "string" && image.url ? (
                          <Image
                            fill
                            src={image.url}
                            alt={`${product.name} image`}
                            className="flex-none rounded-md bg-gray-100 object-cover object-center"
                          />
                        ) : null}
                      </div>

                      {/* Product details */}
                      <div className="flex-auto flex flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="text-gray-900">{product.name}</h3>

                          <p className="my-1">Category: {label}</p>
                        </div>

                        {/* Download link for paid orders */}
                        {order._isPaid ? (
                          <a
                            href={downloadUrl}
                            download={product.name}
                            className="text-blue-600 hover:underline underline-offset-2"
                          >
                            Download asset
                          </a>
                        ) : null}
                      </div>

                      {/* Product price */}
                      <p className="flex-none font-medium text-gray-900">
                        {formatPrice(product.price)}
                      </p>
                    </li>
                  );
                })}
              </ul>

              {/* Order summary details */}
              <div className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p className="text-gray-900">{formatPrice(orderTotal)}</p>
                </div>

                {/* Transaction Fee */}
                <div className="flex justify-between">
                  <p>Transaction Fee</p>
                  <p className="text-gray-900">{formatPrice(1)}</p>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                  <p className="text-base">Total</p>
                  <p className="text-base">{formatPrice(orderTotal + 1)}</p>
                </div>
              </div>

              {/* Continue shopping link */}
              <div className="mt-16 border-t border-gray-200 py-6 text-right">
                <Link
                  href="/products"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Continue shopping &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThankYouPage;
