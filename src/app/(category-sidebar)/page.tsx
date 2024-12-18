import { Footer } from "@/components/footer";
import Hero from "@/components/hero";
import { Link } from "@/components/ui/link";
import { getCollections } from "@/lib/queries";
import Image from "next/image";

export default async function Home() {
  const [collections] = await Promise.all([
    getCollections(),
  ]);


  return (
    <div className="flex flex-col gap-8">
      <Hero />
      {collections.map((collection) => (
        <section key={collection.name}>
          <h1 className="mb-6 text-2xl font-semibold tracking-tight text-center">
            {collection.name} 
          </h1>
          <div className="flex flex-wrap gap-8 md:gap-16 justify-center pl-4">
            {collection.categories.map((category,categoryIndex) => (
              <Link
                prefetch={true}
                key={category.slug}
                href={`/products/${category.slug}`}
                className="group relative overflow-hidden w-[120px] sm:w-auto"
              >
                 <div className="h-[100px] w-[100x] sm:h-[200px] sm:w-[200px] rounded-lg border bg-muted">
                  <Image
                    loading={categoryIndex < 8 ? "eager" : "lazy"}
                    decoding="sync"
                    src={category.image_url ?? "/placeholder.svg"}
                    alt={category.slug}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    quality={65}
                  />
                </div>
                <div className="mt-2">
                  <h2
                    className="font-medium text-center text-sm line-clamp-2"
                  >
                    {category.name}
                  </h2>
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