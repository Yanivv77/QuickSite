import { notFound } from "next/navigation"
import Link from "next/link"
import { ProductLink } from "@/components/ui/product-card"
import type { Metadata } from "next"
import {
  getProductsForSubcategory,
  getSubcategory,
  getSubcategoryProductCount,
  getCategory,
} from "@/lib/queries"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export async function generateMetadata(props: {
  params: Promise<{ category: string; subcategory: string }>
}): Promise<Metadata> {
  const { subcategory: subcategoryParam } = await props.params
  const urlDecodedCategory = decodeURIComponent(subcategoryParam)

  const [subcategory, rows] = await Promise.all([
    getSubcategory(urlDecodedCategory),
    getSubcategoryProductCount(urlDecodedCategory),
  ])

  if (!subcategory) {
    return notFound()
  }

  const description = rows[0]?.count
    ? `בחר מתוך ${rows[0]?.count - 1} מוצרים ב${subcategory.name}. במלאי ומוכן למשלוח.`
    : undefined

  return {
    title: subcategory.name,
    description,
    openGraph: { title: subcategory.name, description },
  }
}

export default async function Page(props: {
  params: Promise<{
    subcategory: string
    category: string
  }>
}) {
  const { subcategory, category } = await props.params
  const urlDecodedSubcategory = decodeURIComponent(subcategory)
  const urlDecodedCategory = decodeURIComponent(category)
  
  const [products, countRes, subcategoryData, categoryData] = await Promise.all([
    getProductsForSubcategory(urlDecodedSubcategory),
    getSubcategoryProductCount(urlDecodedSubcategory),
    getSubcategory(urlDecodedSubcategory),
    getCategory(urlDecodedCategory),
  ])

  if (!products || !subcategoryData || !categoryData) {
    return notFound()
  }

  const finalCount = countRes[0]?.count

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-16 py-16">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">דף הבית</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/products/${category}`}>
                {categoryData.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{subcategoryData.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
          {subcategoryData.name}{' '}
          {finalCount > 0 && (
            <span className="text-xl font-medium text-muted-foreground">
              ({finalCount} {finalCount === 1 ? "מוצר" : "מוצרים"})
            </span>
          )}
        </h1>

        {finalCount > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductLink
                key={product.name}
                loading="eager"
                category_slug={category}
                subcategory_slug={subcategory}
                product={product}
                imageUrl={product.image_url}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">אין מוצרים בקטגוריה זו</p>
        )}
      </div>
    </div>
  )
}