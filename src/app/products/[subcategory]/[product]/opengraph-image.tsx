import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "About Best-Selling Novel";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#f8f8f8",
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
          <img
            style={{
              width: "260px",
              height: "400px",
              borderRadius: "10px",
            }}
            src="https://yourcdn.com/placeholder-book-cover.png" // Use an actual book cover image URL here
            alt="Book Cover"
          />
        </div>
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "10px",
          }}
        >
          The Great Adventure
        </h1>
        <p
          style={{
            fontSize: "24px",
            color: "#555",
          }}
        >
          A Journey Beyond the Horizon
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
            marginTop: "20px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              style={{ fontSize: "36px", fontWeight: "bold", color: "#0066cc" }}
            >
              New York Times Bestseller
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p
              style={{ fontSize: "24px", color: "#666" }}
            >
              "An unforgettable saga"
            </p>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
