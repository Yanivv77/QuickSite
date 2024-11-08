import { getProductDetails, getRelatedProducts } from "@/db/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{
    product: string;
    subcategory: string;
    category: string;
  }>;
}) {
  const { product, subcategory, category } = await props.params;
  const urlDecodedProduct = decodeURIComponent(product);
  const urlDecodedSubcategory = decodeURIComponent(subcategory);
  const urlDecodedCategory = decodeURIComponent(category);
  const productData = getProductDetails({
    category: urlDecodedCategory,
    subcategory: urlDecodedSubcategory,
    product: urlDecodedProduct,
  });
  const related = getRelatedProducts({
    category: urlDecodedCategory,
    subcategory: urlDecodedSubcategory,
    product: urlDecodedProduct,
  });
  if (!productData) {
    return notFound();
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="border-t-2 pt-1 text-xl font-bold text-green-800">
        {productData.name}
      </h1>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <Image
            src={"/placeholder.svg?height=64&width=64"}
            alt={productData.name}
            height={64}
            width={64}
            className="h-64 w-64 flex-shrink-0 border-2"
          />
          <p className="flex-grow text-base">{productData.description}</p>
        </div>
        <form className="flex flex-col gap-2">
          <input type="hidden" name="product_slug" value={productData.name} />
          <button
            type="submit"
            className="max-w-[150px] rounded-[2px] bg-green-800 px-5 py-1 text-sm font-semibold text-white"
          >
            Add to cart
          </button>
        </form>
      </div>
      <div className="pt-8">
        <h2 className="text-lg font-bold text-green-800">
          Explore more products
        </h2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
          {related?.map((item) => (
            <Link
              key={item.name}
              href={`/products/${category}/${subcategory}/${item.name}`}
              className="text-xs text-gray-800 hover:bg-yellow-100 hover:underline"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
