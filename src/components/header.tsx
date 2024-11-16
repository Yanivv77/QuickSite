import Link from "next/link";
import { SearchDropdownComponent } from "@/components/search-dropdown";
import { MenuIcon, ShoppingCart, User } from "lucide-react";
import { Suspense } from "react";
import { Cart } from "@/components/cart";
import { AuthServer } from "../app/auth.server";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md" dir="rtl">
      <nav className="mx-auto flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl sm:text-2xl font-medium tracking-tight text-neutral-900 hover:text-neutral-600 pb-1"
        >
          קוויקבוקס
        </Link>

        {/* Search - Center */}
        <div className="flex-1 px-2 sm:px-8">
          <SearchDropdownComponent />
        </div>

        {/* Right Navigation */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Auth Button - smaller padding on mobile */}
          <Suspense
            fallback={
              <div className="h-8 sm:h-9 w-8 sm:w-9 animate-pulse rounded-full bg-neutral-100" />
            }
          >
            <AuthServer />
          </Suspense>

          {/* Cart - smaller padding and icon on mobile */}
          <div className="relative">
            <Link
              href="/order"
              className="inline-flex items-center gap-1 sm:gap-2 rounded-full p-1.5 sm:p-2 text-neutral-600 transition-colors hover:bg-neutral-100"
              aria-label="הזמנה"
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
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