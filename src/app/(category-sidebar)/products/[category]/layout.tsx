import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategory } from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categoryParam } = await params;
  const urlDecoded = decodeURIComponent(categoryParam);
  const category = await getCategory(urlDecoded);

  if (!category) {
    return notFound();
  }

  const examples = category.subcollections
    .slice(0, 2)
    .map((s) => s.name)
    .join(", ")
    .toLowerCase();

  return {
    title: `${category.name}`,
    openGraph: {
      title: `${category.name}`,
      description: `בחר מתוך המבחר שלנו של ${category.name}, כולל ${examples + (category.subcollections.length > 1 ? "," : "")} ועוד. במלאי ומוכן למשלוח.`,
    },
  };
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
