import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/ProductReel";
import { PRODUCT_CATEGORIES } from "@/config";

// Define the possible types for the 'sort' and 'category' parameters
type Param = string | string[] | undefined;

// Define the expected props for the ProductsPage component
interface ProductsPageProps {
  searchParams: { [key: string]: Param };
}

// Helper function to parse a parameter and ensure it is a string
const parse = (param: Param) => {
  return typeof param === "string" ? param : undefined;
};

// ProductsPage component that renders a list of products based on search parameters
const ProductsPage = ({ searchParams }: ProductsPageProps) => {
  // Parse 'sort' and 'category' parameters from searchParams
  const sort = parse(searchParams.sort);
  const category = parse(searchParams.category);

  // Find the corresponding label for the selected category
  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === category
  )?.label;

  return (
    // Render the product list within a MaxWidthWrapper component
    <MaxWidthWrapper>
      <ProductReel
        // Pass relevant query parameters to the ProductReel component
        title={label ?? "Browse high-quality assets"}
        query={{
          category,
          limit: 40,
          sort: sort === "desc" || sort === "asc" ? sort : undefined,
        }}
      />
    </MaxWidthWrapper>
  );
};

export default ProductsPage;
