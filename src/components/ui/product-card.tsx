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
    width: 100,
    height: 150,
    quality: 65,
    src: imageUrl,
    alt: `A small picture of ${productName}`,
  });
}

export function ProductLink(props: {
  imageUrl?: string | null;
  category_slug: string;
  subcategory_slug: string;
  loading: "eager" | "lazy";
  product: Product;
}) {
  const { category_slug, subcategory_slug, product, imageUrl } = props;

  // Prefetch the main image for the product page
  const prefetchProps = getImageProps({
    height: 150,
    quality: 80,
    width: 100,
    src: imageUrl ?? "/placeholder.svg?height=64&width=64",
    alt: `A small picture of ${product.name}`,
  });

  useEffect(() => {
    try {
      const iprops = prefetchProps.props;
      const img = new Image();
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
            src={imageUrl ?? "/placeholder.svg?height=48&width=48"}
            alt={`A small picture of ${product.name}`}
            width={100}
            height={150}
            quality={65}
            className="w-full flex-shrink-0 object-cover"
          />
      </div>
      <div className="mt-2 space-y-1 text-right" dir="rtl">
        <h2 className="font-medium text-sm line-clamp-1 text-foreground group-hover:underline">
          {product.name}
        </h2>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {product.author}
        </p>
      </div>
    </Link>
  );
}