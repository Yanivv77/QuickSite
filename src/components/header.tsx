import Link from "next/link";
import { SearchDropdownComponent } from "@/components/search-dropdown";
import { MenuIcon, ShoppingCart, User } from "lucide-react";
import { Suspense } from "react";
import { Cart } from "@/components/cart";
import { AuthServer } from "../app/auth.server";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md" dir="rtl">
      <nav className="mx-auto flex  items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-medium tracking-tight text-neutral-900 hover:text-neutral-600 pb-1"
        >
          קוויקבוקס
        </Link>

        {/* Search - Center */}
        <div className="hidden flex-1 px-8 lg:flex">
          <SearchDropdownComponent />
        </div>

        {/* Right Navigation */}
        <div className="flex items-center gap-2">
          {/* Auth Button */}
          <Suspense
            fallback={
              <div className="h-9 w-9 animate-pulse rounded-full bg-neutral-100" />
            }
          >
            <AuthServer />
          </Suspense>
          

          {/* Order History - Desktop */}
          <Link
            href="/order-history"
            className="hidden items-center gap-2 rounded-full p-2 text-neutral-600 transition-colors hover:bg-neutral-100 lg:inline-flex"
            aria-label="היסטוריית הזמנות"
          >
            
          </Link>
          {/* Cart */}
          <div className="relative">
            <Link
              href="/order"
              className="inline-flex items-center gap-2 rounded-full p-2 text-neutral-600 transition-colors hover:bg-neutral-100"
              aria-label="הזמנה"
            >
              <ShoppingCart className="h-5 w-5" />
              <Suspense>
                <Cart />
              </Suspense>
            </Link>
          </div>

          
        </div>
      </nav>

    
     
    </header>
  );
}