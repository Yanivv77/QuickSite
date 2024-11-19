import { getImageProps } from "next/image";

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