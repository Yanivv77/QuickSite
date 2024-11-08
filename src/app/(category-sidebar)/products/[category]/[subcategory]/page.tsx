import { notFound } from "next/navigation";
import { getSubcategoryDetails } from "@/db/utils";
import Link from "next/link";


export default async function Page(props: {
  params: Promise<{
    subcategory: string;
    category: string;
  }>;
}) {
  const { subcategory, category } = await props.params;
  const urlDecodedCategory = decodeURIComponent(category);
  const urlDecodedSubcategory = decodeURIComponent(subcategory);
  const sub = getSubcategoryDetails({
    category: urlDecodedCategory,
    subcategory: urlDecodedSubcategory,
  });
  if (!sub) {
    return notFound();
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-2 border-b-2 text-sm font-bold">690 Products</h1>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
        {sub.products.map((item) => (
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
  );
}
