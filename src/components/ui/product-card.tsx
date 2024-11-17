"use client";
import NextImage from "next/image";
import { getImageProps } from "next/image";
import { Product } from "@/db/schema";
import { useEffect } from "react";
import Link from "next/link";

export function getProductLinkImageProps(
  imageUrl: string,
  productName: string,
) {
  return getImageProps({
    width: 150,
    height: 200,
    quality: 65,
    src: imageUrl,
    alt: `תמונת הספר ${productName}`,
  });
}

export function ProductLink(props: {
  imageUrl?: string | null;
  category_slug: string;
  subcategory_slug: string;
  loading: "eager" | "lazy";
  priority?: boolean;
  isHero?: boolean;
  product: Product;
}) {
  const { category_slug, subcategory_slug, product, imageUrl } = props;

  // Prefetch the main image for the product page
  const prefetchProps = getImageProps({
    height: 200,
    quality: 65,
    width: 150,
    src: imageUrl ?? "/placeholder.svg?height=400&width=300",
    alt: `תמונת הספר ${product.name}`,
  });

  useEffect(() => {
    try {
      const iprops = prefetchProps.props;
      const img = new Image();
      img.fetchPriority = "low";
      img.decoding = "async";
      if (iprops.sizes) img.sizes = iprops.sizes;
      if (iprops.srcSet) img.srcset = iprops.srcSet;
      if (iprops.src) img.src = iprops.src;
    } catch (e) {
      console.error("failed to preload", prefetchProps.props.src, e);
    }
  }, [prefetchProps]);

  return (
    <Link
      prefetch={true}
      className="group relative flex flex-col"
      href={`/products/${category_slug}/${subcategory_slug}/${product.slug}`}
    >
      <div 
        className="aspect-[3/4] overflow-hidden rounded-lg shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md"
        role="img"
        aria-label={`תמונת הספר ${product.name}`}
      >
  <NextImage
          loading={props.loading}
          decoding="sync"
          fetchPriority={props.isHero ? "high" : "auto"}
          priority={props.isHero ? true : props.priority}
          src={imageUrl ?? "/placeholder.svg?height=400&width=300"}
          alt={`תמונת הספר ${product.name}`}
          width={150}
          height={200}
          quality={65}
          className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="mt-2 space-y-1 text-right" dir="rtl">
        <h3 className="font-medium text-sm line-clamp-1 text-foreground group-hover:underline">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {product.author}
        </p>
      </div>
    </Link>
  );
}