import { ProductLink } from "@/components/ui/product-card"
import Image from "next/image";
import { notFound } from "next/navigation"
import { AddToCartForm } from "@/components/add-to-cart-form"
import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { getProductDetails, getProductsForSubcategoryLimited, getCategory, getSubcategory } from "@/lib/queries";

export async function generateMetadata(props: {
  params: Promise<{ product: string; category: string; subcategory: string }>;
}): Promise<Metadata> {
  const { product: productParam } = await props.params;
  const urlDecodedProduct = decodeURIComponent(productParam);

  const product = await getProductDetails(urlDecodedProduct);

  if (!product) {
    return notFound();
  }

  return {
    openGraph: { title: product.name, description: product.description },
  };
}

export const revalidate = 3600 

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

  const [productData, relatedUnshifted, subcategoryData, categoryData] = await Promise.all([
    getProductDetails(urlDecodedProduct),
    getProductsForSubcategoryLimited(urlDecodedSubcategory),
    getSubcategory(urlDecodedSubcategory),
    getCategory(urlDecodedCategory),
  ]);

  if (!productData || !subcategoryData || !categoryData) {
    return notFound();
  }

  const currentProductIndex = relatedUnshifted.findIndex(
    (p) => p.slug === productData.slug,
  );
  const related = [
    ...relatedUnshifted.slice(currentProductIndex + 1),
    ...relatedUnshifted.slice(0, currentProductIndex),
  ];
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-4 py-16">
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
              <BreadcrumbLink href={`/products/${category}/${subcategory}`}>
                {subcategoryData.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{productData.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 md:grid-cols-2 mb-12 justify-items-center">
            <Image
              priority={true}
              loading="eager"
              decoding="sync"
              src={productData.image_url ?? "/placeholder.svg?height=600&width=600"}
              alt={productData.name}
              quality={65}
              width={300}
              height={400}
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
          ספרים קשורים
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {related?.map((product) => (
            <Card key={product.slug}>
              <CardContent className="p-4">
                <ProductLink
                  loading="eager"
                  category_slug={category}
                  subcategory_slug={subcategory}
                  product={product}
                  imageUrl={product.image_url}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}