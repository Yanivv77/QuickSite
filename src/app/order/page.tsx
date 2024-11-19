import { Metadata } from "next"
import { Suspense } from "react"
import { CartItems, TotalCost } from "./dynamic"
import { PlaceOrderAuth } from "../auth.server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentComponent } from "./playment"


export const metadata: Metadata = {
  title: "הזמנה",
}

export default async function Page() {
  return (
    <main className="min-h-screen bg-background p-8 md:p-16" dir="rtl">
      <div className="container mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">הזמנה</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Suspense fallback={<div className="text-center">טוען פריטים...</div>}>
                  <CartItems />
                </Suspense>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-xl font-semibold">סיכום הזמנה</h2>
                    <div className="flex justify-between">
                      <p className="font-medium">סה"כ ספרים:</p>
                      <Suspense fallback={<div>טוען...</div>}>
                        <TotalCost />
                      </Suspense>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      המחיר הסופי כולל משלוח ומיסים
                    </p>
                  </CardContent>
                </Card>
                
                <PaymentComponent />
                
                <Suspense fallback={<div className="text-center">טוען...</div>}>
                  <PlaceOrderAuth />
                </Suspense>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}