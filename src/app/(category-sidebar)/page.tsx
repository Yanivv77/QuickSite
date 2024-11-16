import Link from "next/link";
import { db } from "@/db";
import Image from "next/image";

export default async function Home() {
  const collections = await db.query.collections.findMany({
    with: {
      categories: true,
    },
    orderBy: (collections, { asc }) => asc(collections.name),
  });

  return (
    <div className="flex flex-col gap-8">

      <div className="flex flex-row justify-center">
      hero section
      </div>

      {collections.map((collection) => (
        <section key={collection.name}>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight text-center">
            {collection.name}
          </h2>
          <div className="flex flex-wrap gap-16 justify-center">
            {collection.categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products/${category.slug}`}
                className="group relative overflow-hidden"
              >
                <div className="h-[200px] w-[200px] overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src={category.image_url ?? "/placeholder.svg"}
                    alt={category.name}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
    </div>
  );
}