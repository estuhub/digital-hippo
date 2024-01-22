"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES } from "@/config";
import { useCart } from "@/hooks/use-cart";
import { cn, formatPrice } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Check, Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CartPage = () => {
  const { items, removeItem } = useCart();

  const router = useRouter();

  const [isMounted, setIsMounted] = useState<boolean>(false);
  useEffect(() => setIsMounted(true), []);

  const cartTotal = items.reduce(
    (total, { product }) => total + product.price,
    0
  );

  const fee = 1;

  return (
    <MaxWidthWrapper>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>

          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            {/* List of items in cart */}
            <div
              className={cn("lg:col-span-7", {
                "rounded-lg border-2 border-dashed border-zinc-200 p-12":
                  isMounted && items.length === 0,
              })}
            >
              <h2 className="sr-only">Items in your shopping cart</h2>
              {/* Empty cart message */}
              {isMounted && items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center space-y-1">
                  <div
                    aria-hidden="true"
                    className="relative mb-4 h-40 w-40 text-muted-foreground"
                  >
                    <Image
                      src="/hippo-empty-cart.png"
                      fill
                      loading="eager"
                      alt="empty shopping cart hippo"
                    />
                  </div>
                  <h3 className="font-semibold text-2xl">Your cart is empty</h3>
                  <p className="text-muted-foreground text-center">
                    Whoops! Nothing to show here yet.
                  </p>
                </div>
              ) : null}
              {/* List of items in cart */}
              <ul
                className={cn({
                  "divide-y divide-gray-200 border-b border-t border-gray-200":
                    isMounted && items.length > 0,
                })}
              >
                {isMounted &&
                  items.map(({ product }) => {
                    const label = PRODUCT_CATEGORIES.find(
                      (c) => c.value === product.category
                    )?.label;

                    const { image } = product.images[0];

                    return (
                      <li key={product.id} className="flex py-6 sm:py-10">
                        {/* Product image */}
                        <div className="flex-shrink-0">
                          <div className="relative h-24 w-24">
                            {typeof image !== "string" && image.url ? (
                              <Image
                                fill
                                src={image.url}
                                alt="product image"
                                className="h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48"
                              />
                            ) : null}
                          </div>
                        </div>
                        {/* Product name */}
                        <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                            <div>
                              <div className="flex justify-between">
                                <h3 className="text-sm">
                                  <Link
                                    href={`/product/${product.id}`}
                                    className="font-medium text-gray-700 hover:text-gray-800"
                                  >
                                    {product.name}
                                  </Link>
                                </h3>
                              </div>
                              {/* Product category */}
                              <div className="mt-1 flex text-sm">
                                <p className="text-muted-foreground">
                                  Category: {label}
                                </p>
                              </div>
                              {/* Product price */}
                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {formatPrice(product.price)}
                              </p>
                            </div>
                            {/* Remove product button */}
                            <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
                              <div className="absolute right-0 top-0">
                                <Button
                                  aria-label="remove product"
                                  onClick={() => removeItem(product.id)}
                                  variant="ghost"
                                >
                                  <X className="h-5 w-5" aria-hidden="true" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          {/* Product benefit */}
                          <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                            <Check className="h-5 w-5 flex-shrink-0 text-green-500" />

                            <span>Eligible for instant delivery</span>
                          </p>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default CartPage;