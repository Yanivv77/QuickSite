import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function HeroContent() {
  return (
    <div className="flex-1 space-y-6">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight">
        גלה את
        <span className="block text-primary mt-1">הספר הבא שלך</span>
      </h1>
      <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
        גלה את האוסף שלנו המונה 14,034 ספרים מוקפדים, מהקלאסיקות הנצחיות ועד לרבי המכר העכשוויים.
      </p>
      <div className="flex flex-wrap gap-4">
     
      </div>
    </div>
  )
}