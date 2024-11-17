import { Link } from "@/components/ui/link"
import { db } from "@/db"
import { collections } from "@/db/schema"
import { getCollectionDetails } from "@/lib/queries"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export async function generateStaticParams() {
  return await db.select({ collection: collections.slug }).from(collections)
}

export default async function CollectionPage(props: {
  params: Promise<{
    collection: string
  }>
}) {
  const collectionName = decodeURIComponent((await props.params).collection)
  const collections = await getCollectionDetails(collectionName)
  let imageCount = 0

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-8 py-16">
      
        {collections.map((collection) => (
          <div key={collection.name} className="mb-16">
            <h1 className="text-3xl font-semibold text-foreground mb-8">{collection.name}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {collection.categories.map((category) => (
                <Card key={category.name} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Link
                      prefetch={true}
                      className="flex flex-col items-center text-center"
                      href={`/products/${category.slug}`}
                    >
                      <div className="w-40 h-40 mb-6 overflow-hidden rounded-full">
                        <Image
                          priority={imageCount < 4}
                          loading={imageCount++ < 8 ? "eager" : "lazy"}
                          src={category.image_url ?? "/placeholder.svg"}
                          alt={category.name}
                          className="object-cover flex-shrink-0 w-full h-full"
                          width={160}
                          height={160}
                          quality={65}
                          sizes="160px"
                        />
                      </div>
                      <span className="text-lg font-medium text-foreground">{category.name}</span>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}