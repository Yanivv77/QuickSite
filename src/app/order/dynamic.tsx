import { cache } from "react"
import { detailedCart } from "@/lib/cart"
import { Link } from "@/components/ui/link"
import Image from "next/image";
import { removeFromCart } from "@/lib/actions"
import { Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"

const getCartItems = cache(() => detailedCart())
type CartItem = Awaited<ReturnType<typeof getCartItems>>[number]

export async function CartItems() {
  const cart = await getCartItems()
  return (
    <div className="space-y-6">
      {cart.length > 0 ? (
        cart.map((item) => <CartItem key={item.slug} product={item} />)
      ) : (
        <p className="text-center text-muted-foreground">אין פריטים בעגלה</p>
      )}
    </div>
  )
}

function CartItem({ product }: { product: CartItem }) {
  if (!product) return null
  const cost = (Number(product.price) * product.quantity).toFixed(2)
  return (
    <div className="flex items-center justify-between border-b border-border py-4">
      <div className="flex items-center space-x-4 space-x-reverse">
        <div className=" overflow-hidden rounded-md bg-secondary">
          <Image
            loading="eager"
            decoding="sync"
            src={product.image_url ?? "/placeholder.svg"}
            alt={product.name}
            width={150}
            height={200}
            className="h-full w-full object-cover"
            quality={65}
          />
        </div>
        <div>
          <Link
            prefetch={true}
            href={`/products/${product.subcategory.subcollection.category_slug}/${product.subcategory.slug}/${product.slug}`}
            className="font-semibold hover:underline"
          >
            {product.name}
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
          <p className="mt-1 text-sm">כמות: {product.quantity}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold">{cost} ₪</p>
        <p className="text-sm text-muted-foreground">{Number(product.price).toFixed(2)} ₪ ליחידה</p>
        <form action={removeFromCart} className="mt-2">
          <input type="hidden" name="productSlug" value={product.slug} />
          <Button type="submit" variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">הסר מהעגלה</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

export async function TotalCost() {
  const cart = await getCartItems()
  const totalCost = cart.reduce((acc, item) => acc + item.quantity * Number(item.price), 0)
  return <span className="font-semibold">{totalCost.toFixed(2)} ₪</span>
}