"use client";
import NextImage from "next/image";
import { getImageProps } from "next/image";
import { Product } from "@/db/schema";
import { useEffect } from "react";
import { Link } from "@/components/ui/link";


export function getProductLinkImageProps(
  imageUrl: string,
  productName: string,
  isHero?: boolean
) {
  return getImageProps({
    width: isHero ? 300 : 200,
    height: isHero ? 450 : 300,
    quality: isHero ? 75 : 60,
    src: imageUrl,
    alt: `תמונת הספר ${productName}`,
    sizes: isHero 
      ? "(max-width: 640px) 80vw, (max-width: 768px) 45vw, 300px"
      : "(max-width: 640px) 45vw, (max-width: 768px) 30vw, 200px",
    loading: "eager",
    priority: true,
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
    width: 200,
    height: 300,
    quality: 60,
    src: imageUrl ?? "/placeholder.svg",
    alt: `תמונת הספר ${product.name}`,
    sizes: "(max-width: 768px) 50vw, 200px",
  });

  useEffect(() => {
    try {
      const iprops = prefetchProps.props;
      const img = new Image();
      img.fetchPriority = "high";
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
        className="aspect-[2/3] overflow-hidden rounded-lg shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md"
        role="img"
        aria-label={`תמונת הספר ${product.name}`}
      >
        <NextImage
          {...getProductLinkImageProps(
            imageUrl ?? "/placeholder.svg",
            product.name,
            props.isHero
          )}
          loading={props.loading}
          decoding="sync"
          fetchPriority={"high"}
          priority={props.isHero ? true : props.priority}
          src={imageUrl ?? "/placeholder.svg"}
          alt={`תמונת הספר ${product.name}`}
          width={150}
          height={200}
          quality={60}
          className="h-full w-full flex-shrink-0 object-cover transition-transform duration-300 group-hover:scale-105"
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