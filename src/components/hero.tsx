import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Hero() {
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
              {[
                "/placeholder.svg?height=400&width=300",
                "/placeholder.svg?height=400&width=300",
              ].map((src, index) => (
                <div key={index} className="aspect-[3/4] overflow-hidden rounded-md shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-md">
                  <Image
                    src={src}
                    alt={`ספר מומלץ ${index + 1}`}
                    width={300}
                    height={400}
                    className="object-cover w-full h-full"
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