import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getCategory } from "@/lib/queries";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "אודות הקטגוריה";
export const size = {
  width: 800,
  height: 8000,
};

export const contentType = "image/png";

// Image generation
export default async function Image(props: {
  params: Promise<{
    category: string;
  }>;
}) {
  const { category: categoryParam } = await props.params;
  const urlDecodedCategory = decodeURIComponent(categoryParam);

  const category = await getCategory(urlDecodedCategory);

  if (!category) {
    return notFound();
  }

  const examples = category.subcollections
    .slice(0, 2)
    .map((s) => s.name)
    .join(", ");

  const description = `בחר מתוך המבחר שלנו של ${category.name}, כולל ${examples + (category.subcollections.length > 1 ? "," : "")} ועוד. במלאי ומוכן למשלוח.`;


  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#fff",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "800px",
              height: "800px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              style={{
                width: "300px",
                marginBottom: "30px",
              }}
              src={category.image_url ?? "/placeholder.svg"}
              alt={category.name}
            />
          </div>
        </div>
        <h1
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "20px",
          }}
        >
          {category.name}
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <div
            style={{ textAlign: "center", display: "flex", fontSize: "24px" }}
          >
            {description}
          </div>
        </div>
      </div>
    ),
    {
      width: 800,
      height: 800,
    },
  );
}
