import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { getRandomProducts } from "@/db/products"
import { cache } from 'react'
import Link from "next/link"
import { ProductLink } from './ui/product-card'

// Cache the random products fetch
const getRandomProductsCached = cache(async () => {
  return await getRandomProducts(2)
})

export default async function Hero() {
  const randomProducts = await getRandomProductsCached()

  return (
    <section 
      className=" text-right overflow-hidden" 
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              גלה את
              <span className="block text-primary mt-1">הספר הבא שלך</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              גלה את האוסף שלנו המונה 14,034 ספרים מוקפדים, מהקלאסיקות הנצחיות ועד לרבי המכר העכשוויים.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="group relative overflow-hidden transform transition-all duration-300 hover:scale-105"
                aria-label="התחל לקנות ספרים"
              >
                התחל לקנות
                <ArrowLeft 
                  className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" 
                  aria-hidden="true"
                />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="transform transition-all duration-300 hover:scale-105"
                aria-label="גלה קטגוריות ספרים"
              >
                גלה קטגוריות
              </Button>
            </div>
          </div>

          <div 
            className="flex-1 relative w-full max-w-md perspective-1000"
            role="complementary" 
            aria-label="תצוגת ספרים אקראית"
          >
            <div 
              className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-xl transform rotate-2 blur-[1px]"
              aria-hidden="true"
            />
            <div className="relative grid grid-cols-2 gap-8 p-4 bg-background/95 backdrop-blur-sm rounded-xl shadow-lg">
              {randomProducts.map((product) => (
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
          </div>
        </div>
      </div>
    </section>
  )
}