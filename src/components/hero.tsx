import { getRandomProducts } from "@/db/products"
import { unstable_cache } from 'next/cache'
import { ProductLink } from './ui/product-card'
import { HeroContent } from './hero-content'

// Create a stable cache key and cache the random products with a longer duration
const getRandomProductsCached = unstable_cache(async () => {
  return await getRandomProducts(2)
})

// ProductDisplay component
function ProductDisplay({ products }: { products: any[] }) {
  return (
    <div className="relative grid grid-cols-2 gap-8 p-4 bg-background/95 backdrop-blur-sm rounded-xl shadow-lg">
      {products.map((product) => (
        <div key={product.slug} className="group relative flex flex-col">
          <ProductLink
            key={product.name}
            category_slug={product.category_slug ?? ""}
            subcategory_slug={product.subcategory_slug}
            product={product}
            imageUrl={product.image_url}
            loading="eager"
          />
        </div>
      ))}
    </div>
  )
}

// Hero component marked as async to enable Server Component behavior
export default async function Hero() {
  // Get cached products
  const randomProducts = await getRandomProductsCached()

  return (
    <section className="text-right overflow-hidden" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <HeroContent />
          
          <div 
            className="flex-1 relative w-full max-w-md perspective-1000"
            role="complementary" 
            aria-label="תצוגת ספרים אקראית"
          >
            <div 
              className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-xl transform rotate-2 blur-[1px]"
              aria-hidden="true"
            />
            <ProductDisplay products={randomProducts} />
          </div>
        </div>
      </div>
    </section>
  )
}
