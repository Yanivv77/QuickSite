import { ProductLink } from "@/components/ui/product-card"
import { db } from "@/db"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ne } from "drizzle-orm"
import { AddToCartForm } from "@/components/add-to-cart-form"
import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ChevronLeft } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export async function generateMetadata({ params }: {
  params: { product: string }
}): Promise<Metadata> {
  const urlDecodedProduct = decodeURIComponent(params.product)
  const product = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.slug, urlDecodedProduct),
  })
  
  return {
    title: product?.name,
    description: product?.description,
  }
}

export const revalidate = 3600 // Revalidate every hour

export default async function Page(props: {
  params: Promise<{
    product: string
    subcategory: string
    category: string
  }>
}) {
  const { product, subcategory, category } = await props.params
  const urlDecodedProduct = decodeURIComponent(product)
  const urlDecodedSubcategory = decodeURIComponent(subcategory)
  const urlDecodedCategory = decodeURIComponent(category)
  const productData = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.slug, urlDecodedProduct),
    with: {
      subcategory: {
        with: {
          subcollection: true
        }
      }
    },
  })
  const related = await db.query.products.findMany({
    where: (products, { eq, and }) =>
      and(
        eq(products.subcategory_slug, urlDecodedSubcategory),
        ne(products.slug, urlDecodedProduct),
      ),
    with: {
      subcategory: true,
    },
    limit: 4,
  })
  if (!productData) {
    return notFound()
  }
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-4 py-16">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">דף הבית</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronLeft className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/products/${urlDecodedCategory}`}>
                {productData.subcategory.subcollection.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronLeft className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/products/${urlDecodedCategory}/${urlDecodedSubcategory}`}>
                {productData.subcategory.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronLeft className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{productData.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 md:grid-cols-2  mb-12 justify-items-center">
            <Image
              src={productData.image_url ?? "/placeholder.svg?height=600&width=600"}
              alt={productData.name}
              quality={75}
              width={400}
              height={500}
              className="rounded-lg"
            />
          
          <div className="flex flex-col justify-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                {productData.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">{productData.description}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary mb-4">₪{productData.price}</p>
              <AddToCartForm productSlug={productData.slug} />
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        <h2 className="text-2xl font-bold text-foreground mb-6">
          מוצרים קשורים
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {related?.map((product) => (
            <Card key={product.name}>
              <CardContent className="p-4">
                <ProductLink
                  category_slug={category}
                  subcategory_slug={subcategory}
                  product={product}
                  imageUrl={product.image_url}
                  loading="lazy"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}