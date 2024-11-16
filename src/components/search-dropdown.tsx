'use client'

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, X } from 'lucide-react'
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Product } from "../db/schema"
import { searchProducts } from "../lib/actions"
import Link from "next/link"

type SearchResult = Product & { href: string }

export function SearchDropdownComponent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredItems, setFilteredItems] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const search = async () => {
      const results = await searchProducts(searchTerm)
      setFilteredItems(results)
    }

    if (searchTerm) {
      search()
    } else {
      setFilteredItems([])
    }
  }, [searchTerm])

  return (
    <div className="font-sans" dir="rtl">
      <div className="relative w-full">
        <div className="relative">
          <Input
            type="text"
            placeholder="חיפוש..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setIsOpen(e.target.value.length > 0)
            }}
            className="w-full max-w-[375px] pr-10 text-right"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          {isOpen && (
            <button
              onClick={() => {
                setSearchTerm("")
                setIsOpen(false)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">נקה חיפוש</span>
            </button>
          )}
        </div>
        {isOpen && filteredItems.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-md bg-background shadow-lg ring-1 ring-border">
            <ScrollArea className="max-h-[300px]">
              {filteredItems.map((item) => (
                <Link
                  href={item.href}
                  key={item.slug}
                  className="flex items-center gap-3 p-3 transition-colors hover:bg-muted"
                >
                  <Image
                    src={item.image_url ?? "/placeholder.svg"}
                    alt=""
                    className="h-10 w-10 rounded-sm object-cover"
                    height={40}
                    width={40}
                  />
                  <span className="text-sm">{item.name}</span>
                </Link>
              ))}
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  )
}