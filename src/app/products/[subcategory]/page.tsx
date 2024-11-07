import Image from "next/image";
import Link from "next/link";
import { productCategories } from "@/app/data";

export default async function Page(props: {
  params: Promise<{
    subcategory: string;
  }>;
}) {
  const { subcategory } = await props.params;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-sm font-bold mb-2 border-b-2">Browse Our Book Collection</h1>
      <div className="space-y-4">
        {productCategories.map((category, index) => (
          <div key={index}>
            <h2 className="text-lg font-semibold mb-2 border-b-2">
              {category.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {category.subcategories.map((item, itemIndex) => (
                <Link
                  key={itemIndex}
                  href={`/products/${category.name.toLowerCase()}/${item.name}`}
                  className="flex flex-col border p-4 group hover:bg-gray-100"
                >
                  <div className="py-2">
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 flex-shrink-0 object-cover"
                    />
                  </div>
                  <div className="flex h-24 flex-grow flex-col items-start py-2">
                    <div className="text-sm font-medium text-gray-700 group-hover:underline">
                      {item.name}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
