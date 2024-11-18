"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";

type PrefetchImage = {
  srcset: string;
  sizes: string;
  src: string;
  alt: string;
  loading: string;
};

async function prefetchImages(href: string): Promise<PrefetchImage[]> {
  if (!href.startsWith("/") || href.startsWith("/order") || href === "/") {
    return [];
  }

  const url = new URL(href, window.location.href);

  try {
    const imageResponse = await fetch(`/api/prefetch-images${url.pathname}`, {
      priority: "low",
    });

    if (!imageResponse.ok) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to prefetch images");
      }
      return [];
    }

    const { images } = await imageResponse.json();
    return images as PrefetchImage[];
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching images:", error);
    }
    return [];
  }
}

export const Link: typeof NextLink = (({ children, ...props }) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const router = useRouter();
  let hoverTimer: NodeJS.Timeout;

  const handleMouseEnter = async () => {
    // Prevent multiple prefetches
    if ((linkRef.current as any)?._prefetching) return;
    (linkRef.current as any)._prefetching = true;

    // Use requestIdleCallback if available, otherwise setTimeout
    const schedulePreload = window.requestIdleCallback || setTimeout;
    
    schedulePreload(async () => {
      // Prefetch the route
      await router.prefetch(String(props.href));

      // Prefetch images
      const images = await prefetchImages(String(props.href));
      images.forEach((image) => {
        insertPrefetchLink(image);
      });
    }, { timeout: 1000 });
  };

  const handleMouseLeave = () => {
    if (linkRef.current) {
      delete (linkRef.current as any)._prefetching;
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const url = new URL(String(props.href), window.location.href);
    if (
      url.origin === window.location.origin &&
      e.button === 0 &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.shiftKey
    ) {
      e.preventDefault();
      router.push(String(props.href));
    }
  };

  return (
    <NextLink
      ref={linkRef}
      prefetch={false}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      {...props}
    >
      {children}
    </NextLink>
  );
}) as typeof NextLink;

function insertPrefetchLink(image: PrefetchImage) {
  const existingLink = document.head.querySelector(`link[href="${image.src}"]`);
  if (existingLink) return;

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.as = "image";
  link.href = image.src;

  document.head.appendChild(link);

  setTimeout(() => {
    if (document.head.contains(link)) {
      document.head.removeChild(link);
    }
  }, 10000);
}
