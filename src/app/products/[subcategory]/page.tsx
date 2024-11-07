import Image from "next/image";
import Link from "next/link";

const productCategories = [
  {
    title: "Fiction",
    items: [
      {
        name: "Literary Fiction",
        description: "Explore complex characters and narratives in diverse settings."
      },
      {
        name: "Mystery & Thriller",
        description: "Delve into suspenseful plots and whodunit stories."
      },
      {
        name: "Science Fiction",
        description: "Journey through speculative tales of science and future technology."
      },
      {
        name: "Fantasy",
        description: "Dive into worlds of magic and mythical creatures."
      },
      {
        name: "Romance",
        description: "Experience tales of love and relationships."
      },
      {
        name: "Historical Fiction",
        description: "Get transported to different times and re-live history through stories."
      },
    ],
  },
  {
    title: "Non-Fiction",
    items: [
      {
        name: "History",
        description: "Understand the events that shaped our world."
      },
      {
        name: "Biographies",
        description: "Read about the lives of notable individuals and their impacts."
      },
      {
        name: "Self-help",
        description: "Find guidance on personal development and self-improvement."
      },
      {
        name: "Science",
        description: "Learn about the wonders of the natural and physical world."
      },
      {
        name: "Business & Economics",
        description: "Discover insights on commerce, industry, and market trends."
      },
    ],
  },
  {
    title: "Children's Books",
    items: [
      {
        name: "Picture Books",
        description: "Colorful stories for the youngest readers."
      },
      {
        name: "Young Readers",
        description: "Engaging narratives for developing readers."
      },
      {
        name: "Education",
        description: "Books that entertain and teach with fun, engaging activities."
      },
    ],
  },
];

export default async function Page(props: {
  params: Promise<{
    subcategory: string;
  }>;
}) {
  const { subcategory } = await props.params;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-sm font-bold mb-2 border-b-2">Browse Our Book Collection</h1>
      <div className="space-y-4">
        {productCategories.map((category, index) => (
          <div key={index}>
            <h2 className="text-lg font-semibold mb-2 border-b-2">
              {category.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {category.items.map((item, itemIndex) => (
                <Link
                  key={itemIndex}
                  href={`/products/${subcategory}/${item.name}`}
                  className="flex flex-col border p-4 group hover:bg-gray-100"
                >
                  <div className="py-2">
                  <Image
                    src="/book-placeholder.svg?height=48&width=48"
                    alt={item.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 flex-shrink-0 object-cover"
                  />
                  </div>
                  <div className="flex h-24 flex-grow flex-col items-start py-2">
                  <div className="text-sm font-medium text-gray-700 group-hover:underline">
                      {item.name}
                    </div>
                    <p className="overflow-hidden text-xs">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
