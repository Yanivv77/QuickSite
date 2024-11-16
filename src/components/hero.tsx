import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { getRandomProducts } from "@/db/products"
import { cache } from 'react'

// Cache the random products fetch
const getRandomProductsCached = cache(async () => {
  return await getRandomProducts(2)
})

export default async function Hero() {
  const randomProducts = await getRandomProductsCached()

  return (
    <div className=" from-primary/5 to-secondary/5 text-right" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              גלה את
              <span className="block text-primary mt-1">הספר הבא שלך</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
            גלה את האוסף שלנו המונה 14,034 ספרים מוקפדים, מהקלאסיקות הנצחיות ועד לרבי המכר העכשוויים.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="group">
                התחל לקנות
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </Button>
              <Button size="lg" variant="outline">
                גלה קטגוריות
              </Button>
            </div>
          </div>
          <div className="flex-1 relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-xl transform rotate-2"></div>
            <div className="relative grid grid-cols-2 gap-3 p-3 bg-background rounded-xl shadow-lg">
              {randomProducts.map((product) => (
                <div key={product.slug} className="aspect-[3/4] overflow-hidden rounded-md shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-md">
                  <Image
                    src={product.image_url ?? "/placeholder.svg?height=400&width=300"}
                    alt={product.name}
                    width={300}
                    height={400}
                    priority={true}
                    loading="eager"
                    className="object-cover w-full h-full"
                    quality={80}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-between items-center text-sm text-muted-foreground">
          <p>ספריים דיגיטאלים</p>
          <p>משלוח מיידי</p>
          <p>תשלום מאובטח</p>
        </div>
      </div>
      
    </div>
  )
}