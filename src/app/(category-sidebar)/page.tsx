import { Footer } from "@/components/footer";
import Hero from "@/components/hero";
import { Link } from "@/components/ui/link";
import { getCollections, getProductCount } from "@/lib/queries";

import Image from "next/image";

export default async function Home() {
  const [collections, productCount] = await Promise.all([
    getCollections(),
    getProductCount(),
  ]);
  let imageCount = 0;

  return (
    <div className="flex flex-col gap-8">
      <Hero />
      {collections.map((collection) => (
        <section key={collection.name}>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight text-center">
            {collection.name}
          </h2>
          <div className="flex flex-wrap gap-8 md:gap-16 justify-center pl-4">
            {collection.categories.map((category) => (
              <Link
                prefetch={true}
                key={category.slug}
                href={`/products/${category.slug}`}
                className="group relative overflow-hidden"
              >
                <div className="h-[100px] w-[100x] sm:h-[200px] sm:w-[200px] rounded-lg border bg-muted">
                  <Image
                    loading="eager"
                    decoding="sync"
                    src={category.image_url ?? "/placeholder.svg"}
                    alt={category.slug}
                    width={200}
                    height={200}
                    priority={imageCount < 2}
                    className="h-full w-full flex-shrink-0 object-cover transition-transform duration-300 group-hover:scale-105"
                    quality={65}
                  />
                </div>
                <div className="mt-2">
                  <h3 className="font-medium text-center">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
      <Footer />
    </div>
  );
}