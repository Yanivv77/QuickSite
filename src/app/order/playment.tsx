'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { CreditCard, Banknote } from 'lucide-react'

export function PaymentComponent() {
  const [paymentMethod, setPaymentMethod] = useState('credit-card')

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">פרטי תשלום</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <RadioGroup
            defaultValue="credit-card"
            onValueChange={setPaymentMethod}
            className="flex flex-col space-y-4"
          >
            <div className="flex items-center space-x-4 space-x-reverse">
              <RadioGroupItem value="credit-card" id="credit-card" />
              <Label htmlFor="credit-card" className="flex items-center">
                <CreditCard className="ml-2 h-5 w-5" />
                כרטיס אשראי
              </Label>
            </div>
          </RadioGroup>

          {paymentMethod === 'credit-card' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">מספר כרטיס</Label>
                  <Input id="card-number" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-name">שם בעל הכרטיס</Label>
                  <Input id="card-name" placeholder="ישראל ישראלי" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry-date">תאריך תפוגה</Label>
                  <Input id="expiry-date" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full">
            אישור תשלום
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}