import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, getCategoryProductCount } from "@/lib/queries";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { ChevronRight } from 'lucide-react';

export async function generateStaticParams() {
  return await db.select({ category: categories.slug }).from(categories);
}

export default async function Page(props: {
  params: Promise<{
    category: string;
  }>;
}) {
  const { category } = await props.params;
  const urlDecoded = decodeURIComponent(category);
  const cat = await getCategory(urlDecoded);
  if (!cat) {
    return notFound();
  }

  const countRes = await getCategoryProductCount(urlDecoded);
  const finalCount = countRes[0]?.count;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:pl-6 lg:px-16">
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                בית
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  {cat.name}
                  
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <h1 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 text-center">
          {cat.name}{' '}
          {finalCount && (
            <span className="ml-3 text-lg font-medium text-gray-600">
              ({finalCount} {finalCount === 1 ? "מוצר" : "מוצרים"})
            </span>
          )}
        </h1>
        
        
        <div className="space-y-6">
          {cat.subcollections
            .sort((a, b) => b.subcategories.length - a.subcategories.length)
            .map((subcollection, index) => (
            <div key={index} className="overflow-hidden">
              <h2 className="mb-3 text-center text-base font-semibold text-gray-900">
                {subcollection.name}
              </h2>
              <div className="flex justify-center gap-4">
                {subcollection.subcategories.map((subcategory, subcategoryIndex) => (
                  <Link
                    key={subcategoryIndex}
                    href={`/products/${category}/${subcategory.slug}`}
                    className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]"
                  >
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={subcategory.image_url ?? "/placeholder.svg"}
                        alt={subcategory.name}
                        width={300}
                        height={300}
                        quality={75}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-base font-medium text-gray-900 group-hover:text-blue-600">
                        {subcategory.name}
                      </h3>
                      <div className="mt-1.5 flex items-center">
                        <span className="text-sm text-gray-500">
                          צפה קטגורה →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}