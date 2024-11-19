import Image from "next/image";
import { Link } from "@/components/ui/link";
import { notFound } from "next/navigation";
import { getCategory, getCategoryProductCount } from "@/lib/queries";
import { db } from "@/db";
import { categories } from "@/db/schema";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
  let imageCount = 0;

  if (!cat) {
    notFound();
  }

  const countRes = await getCategoryProductCount(urlDecoded);
  const finalCount = countRes[0]?.count ?? 0;

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">בית</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{cat.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 text-center">
        {cat.name}{" "}
        {typeof finalCount === "number" && (
          <span className="ml-3 text-lg font-medium text-gray-600">
            ({finalCount} {finalCount === 1 ? "מוצר" : "מוצרים"})
          </span>
        )}
      </h1>

      <div className="space-y-6">
        {cat.subcollections.map((subcollection, index) => (
          <div key={subcollection.name || index} className="overflow-hidden">
            <h2 className="mb-3 text-center text-base font-semibold text-gray-900">
              {subcollection.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {subcollection.subcategories.map((subcategory, subcategoryIndex) => (
                <Link
                  key={subcategoryIndex}
                  href={`/products/${category}/${subcategory.slug}`}
                  className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg"
                >
                  <div className="aspect-square overflow-hidden">
                    <Image
                      loading={imageCount++ < 10 ? "eager" : "lazy"}
                      decoding="sync"
                      src={subcategory.image_url ?? "/placeholder.svg"}
                      alt={subcategory.name}
                      width={200}
                      height={200}
                      quality={65}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-base font-medium text-gray-900 group-hover:text-blue-600">
                      {subcategory.name}
                    </h3>
                    <div className="mt-1.5">
                      <span className="text-sm text-gray-500">צפה קטגוריה →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
