"use client";

import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Product } from "../db/schema";
import { Link } from "@/components/ui/link";
import { useParams, useRouter } from "next/navigation";
import { ProductSearchResult } from "@/app/api/search/route";

type SearchResult = Product & { href: string };

// Safe JSON parse wrapper
const safeJsonParse = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error('JSON Parse error:', e);
    return null; // or return a default value
  }
}

export function SearchDropdownComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // we don't need react query, we have react query at home
  // react query at home:
  useEffect(() => {
    if (searchTerm.length === 0) {
      setFilteredItems([]);
    } else {
      setIsLoading(true);

      const searchedFor = searchTerm;
      fetch(`/api/search?q=${searchTerm}`).then(async (results) => {
        const currentSearchTerm = inputRef.current?.value;
        if (currentSearchTerm !== searchedFor) {
          return;
        }
        const json = await results.json();
        setIsLoading(false);
        setFilteredItems(json as ProductSearchResult);
      });
    }
  }, [searchTerm, inputRef]);



  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) =>
        prevIndex < filteredItems.length - 1 ? prevIndex + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : filteredItems.length - 1,
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      router.push(filteredItems[highlightedIndex].href);
      setSearchTerm(filteredItems[highlightedIndex].name);
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // close dropdown when clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="font-sans" ref={dropdownRef} dir="rtl">
      <div className="relative w-full">
        <div className="relative">
          <Input
            ref={inputRef}
            autoCapitalize="none"
            autoCorrect="off"
            type="text"
            placeholder="חיפוש..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(e.target.value.length > 0);
              setHighlightedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
              className="w-full max-w-[500px] rounded-full border-neutral-200 bg-neutral-100 pr-10 text-right focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <X
            className={cn(
              "absolute right-3 top-2 h-5 w-5 text-muted-foreground",
              {
                hidden: !isOpen,
              },
            )}
            onClick={() => {
              setSearchTerm("");
              setIsOpen(false);
            }}
            aria-label="Clear search"
          />
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full max-w-[500px] border border-gray-200 bg-white shadow-lg">
            <ScrollArea className="h-[300px]">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <Link href={item.href} key={item.slug} prefetch={true}>
                    <div
                      className={cn("flex cursor-pointer items-center p-2", {
                        "bg-gray-100": index === highlightedIndex,
                      })}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onClick={() => {
                        setSearchTerm(item.name);
                        setIsOpen(false);
                        inputRef.current?.blur();
                      }}
                    >
                      <Image
                        loading="eager"
                        decoding="sync"
                        src={item.image_url ?? "/placeholder.svg"}
                        alt={`${item.slug}`}
                        className="h-10 w-10 pr-2"
                        height={40}
                        width={40}
                        quality={40}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                  </Link>
                ))
              ) : isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-gray-500">טוען...</p>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-gray-500">לא נמצאו תוצאות</p>
                </div>
              )}
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
