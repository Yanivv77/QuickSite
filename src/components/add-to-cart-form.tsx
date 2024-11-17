"use client";
import { addToCart } from "@/lib/actions";
import { useActionState } from "react";


export function AddToCartForm({ productSlug }: { productSlug: string }) {
  const [message, formAction, isPending] = useActionState(addToCart, null);
  return (
    <form className="flex flex-col gap-2" action={formAction}>
      <input type="hidden" name="productSlug" value={productSlug} />
      <button
        type="submit"
        className="max-w-[150px] rounded-[2px] bg-green-800 px-5 py-1 text-sm font-semibold text-white"
        aria-label="Add item to cart"
      >
        הוספה לסל
      </button>
      {isPending && <p>הוספה לסל...</p>}
      {!isPending && message && <p>{message}</p>}
    </form>
  );
}
