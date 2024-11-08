import Image from "next/image";
import Link from "next/link";

const bookCategories = [
  {
    title: "Fiction",
    products: [
      {
        name: "Science Fiction",
        description:
          "Explore futuristic concepts, advanced technology, space exploration, time travel, and extraterrestrial life in imaginative settings.",
      },
      {
        name: "Fantasy",
        description:
          "Dive into magical worlds, mythical creatures, and epic quests that transcend the boundaries of reality.",
      },
      {
        name: "Mystery & Thriller",
        description:
          "Engage with gripping plots, suspenseful narratives, and intricate puzzles that keep you on the edge of your seat.",
      },
      {
        name: "Romance",
        description:
          "Experience heartwarming and passionate love stories that explore the complexities of relationships and emotions.",
      },
      {
        name: "Horror",
        description:
          "Encounter terrifying tales, supernatural elements, and psychological thrills that evoke fear and suspense.",
      },
      {
        name: "Adventure",
        description:
          "Join exhilarating journeys and daring exploits that take characters to exciting and unknown destinations.",
      },
      {
        name: "Classic Literature",
        description:
          "Discover timeless masterpieces that have shaped literary history and continue to influence readers worldwide.",
      },
      {
        name: "Young Adult",
        description:
          "Engage with coming-of-age stories, relatable characters, and themes that resonate with teenage and young adult readers.",
      },
      {
        name: "Drama",
        description:
          "Explore intense narratives that delve into human emotions, conflicts, and personal growth.",
      },
      {
        name: "Short Stories",
        description:
          "Enjoy concise and impactful tales that deliver powerful messages and vivid storytelling in a brief format.",
      },
    ],
  },
  {
    title: "Non-Fiction",
    products: [
      {
        name: "Biography & Memoir",
        description:
          "Read about the lives, experiences, and personal journeys of remarkable individuals.",
      },
      {
        name: "Self-Help",
        description:
          "Find guidance and strategies for personal development, mental well-being, and achieving your goals.",
      },
      {
        name: "Health & Wellness",
        description:
          "Explore topics related to physical health, mental well-being, nutrition, and holistic living.",
      },
      {
        name: "History",
        description:
          "Delve into past events, significant eras, and influential figures that have shaped the world.",
      },
      {
        name: "Science",
        description:
          "Discover insights into various scientific fields, research breakthroughs, and the natural world.",
      },
      {
        name: "Technology",
        description:
          "Stay updated with advancements in technology, digital innovations, and their impact on society.",
      },
      {
        name: "Business & Economics",
        description:
          "Learn about market dynamics, entrepreneurial ventures, economic theories, and business strategies.",
      },
      {
        name: "Travel",
        description:
          "Embark on journeys through travelogues, destination guides, and cultural explorations.",
      },
      {
        name: "Cooking",
        description:
          "Enhance your culinary skills with recipes, cooking techniques, and gastronomic adventures.",
      },
      {
        name: "Art & Photography",
        description:
          "Appreciate visual arts, photography techniques, and the creative processes behind masterpieces.",
      },
      {
        name: "Religion & Spirituality",
        description:
          "Explore diverse belief systems, spiritual practices, and philosophical inquiries.",
      },
      {
        name: "Poetry",
        description:
          "Immerse yourself in lyrical expressions, poetic forms, and the beauty of well-crafted verses.",
      },
      {
        name: "Comics & Graphic Novels",
        description:
          "Enjoy visually-driven storytelling with vibrant illustrations and engaging narratives.",
      },
      {
        name: "Educational",
        description:
          "Access resources for learning, academic subjects, and skill development across various disciplines.",
      },
    ],
  },
  {
    title: "Children's Books",
    products: [
      {
        name: "Picture Books",
        description:
          "Colorful and engaging stories designed to captivate young readers through illustrations and simple narratives.",
      },
      {
        name: "Early Readers",
        description:
          "Books crafted to help children transition from picture books to more text-heavy stories with basic vocabulary.",
      },
      {
        name: "Middle Grade",
        description:
          "Adventures and stories tailored for children aged 8-12, featuring relatable characters and exciting plots.",
      },
      {
        name: "Young Adult",
        description:
          "Engaging stories that resonate with teenagers, addressing themes of identity, growth, and relationships.",
      },
      {
        name: "Educational",
        description:
          "Books focused on learning, covering subjects like math, science, history, and more in an engaging manner.",
      },
      {
        name: "Activity Books",
        description:
          "Interactive books filled with puzzles, games, coloring pages, and activities to stimulate creativity and learning.",
      },
    ],
  },
  // Add more main genres as needed
];


export default async function Page(props: {
  params: Promise<{
    category: string;
  }>;
}) {
  const { category } = await props.params;
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-2 border-b-2 text-sm font-bold">690 Products</h1>
      <div className="space-y-4">
        {bookCategories.map((collection, index) => (
          <div key={index}>
            <h2 className="mb-2 border-b-2 text-lg font-semibold">
              {collection.title}
            </h2>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
              {collection.products.map((subcategory, subcategoryIndex) => (
                <Link
                  key={subcategoryIndex}
                  className="group flex h-full flex-row border px-4 py-2 hover:bg-gray-100"
                  href={`/products/${category}/${subcategory.name}`}
                >
                  <div className="py-2">
                    <Image
                      src="/placeholder.svg?height=48&width=48"
                      alt={subcategory.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 flex-shrink-0 object-cover"
                    />
                  </div>
                  <div className="flex h-24 flex-grow flex-col items-start py-2">
                    <div className="text-sm font-medium text-gray-700 group-hover:underline">
                      {subcategory.name}
                    </div>
                    <p className="overflow-hidden text-xs">
                      {subcategory.description}
                    </p>
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
