"use client";

import { Product } from "@/payload-types";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/config";
import ImageSlider from "./ImageSlider";

// Props interface for the ProductListing component
interface ProductListingProps {
  product: Product | null;
  index: number;
}

// ProductListing component
const ProductListing = ({ product, index }: ProductListingProps) => {
  // State to track visibility
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // useEffect to delay visibility based on index
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);

    return () => clearTimeout(timer);
  }, [index]);

  // Placeholder for non-visible or undefined product
  if (!product || !isVisible) return <ProductPlaceholder />;

  // Finding the category label based on the product's category value
  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label;

  // Extracting valid image URLs from the product's images
  const validUrls = product.images
    .map(({ image }) => (typeof image === "string" ? image : image.url))
    .filter(Boolean) as string[];

  // Rendering the product if it is visible and defined
  if (isVisible && product) {
    return (
      <Link
        className={cn("invisible h-full w-full cursor-pointer group/main", {
          "visible animate-in fade-in-5": isVisible,
        })}
        href={`/product/${product.id}`}
      >
        <div className="flex flex-col w-full">
          {/* Rendering the ImageSlider component with valid image URLs */}
          <ImageSlider urls={validUrls} />

          {/* Rendering product details */}
          <h3 className="mt-4 font-medium text-sm text-gray-700">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{label}</p>
          <p className="mt-1 font-medium text-sm text-gray-900">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    );
  }
};

// Placeholder component for non-visible or undefined product
const ProductPlaceholder = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Placeholder for product image */}
      <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>
      {/* Skeleton placeholders for product details */}
      <Skeleton className="mt-4 w-2/3 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-16 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-12 h-4 rounded-lg" />
    </div>
  );
};

export default ProductListing;
