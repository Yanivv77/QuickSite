import Link from "next/link";
import Image from "next/image";

const bookGenres = [
  {
    name: "Fiction",
    subcategories: [
      {
        name: "Science Fiction",
        description:
          "Dive into futuristic worlds, advanced technology, space exploration, and speculative concepts that challenge the imagination.",
        imageUrl: "/images/genres/science-fiction.svg?height=50&width=50",
      },
      {
        name: "Fantasy",
        description:
          "Immerse yourself in magical realms, mythical creatures, and epic quests that transcend the boundaries of reality.",
        imageUrl: "/images/genres/fantasy.svg?height=50&width=50",
      },
      {
        name: "Mystery & Thriller",
        description:
          "Engage with gripping plots, suspenseful narratives, and intricate puzzles that keep you on the edge of your seat.",
        imageUrl: "/images/genres/mystery-thriller.svg?height=50&width=50",
      },
      {
        name: "Romance",
        description:
          "Experience heartwarming and passionate love stories that explore the complexities of relationships and emotions.",
        imageUrl: "/images/genres/romance.svg?height=50&width=50",
      },
      {
        name: "Horror",
        description:
          "Encounter terrifying tales, supernatural elements, and psychological thrills that evoke fear and suspense.",
        imageUrl: "/images/genres/horror.svg?height=50&width=50",
      },
      {
        name: "Adventure",
        description:
          "Join exhilarating journeys and daring exploits that take characters to exciting and unknown destinations.",
        imageUrl: "/images/genres/adventure.svg?height=50&width=50",
      },
      {
        name: "Classic Literature",
        description:
          "Discover timeless masterpieces that have shaped literary history and continue to influence readers worldwide.",
        imageUrl: "/images/genres/classic-literature.svg?height=50&width=50",
      },
      {
        name: "Young Adult",
        description:
          "Engage with coming-of-age stories, relatable characters, and themes that resonate with teenage and young adult readers.",
        imageUrl: "/images/genres/young-adult.svg?height=50&width=50",
      },
      {
        name: "Drama",
        description:
          "Explore intense narratives that delve into human emotions, conflicts, and personal growth.",
        imageUrl: "/images/genres/drama.svg?height=50&width=50",
      },
      {
        name: "Short Stories",
        description:
          "Enjoy concise and impactful tales that deliver powerful messages and vivid storytelling in a brief format.",
        imageUrl: "/images/genres/short-stories.svg?height=50&width=50",
      },
    ],
  },
  {
    name: "Non-Fiction",
    subcategories: [
      {
        name: "Biography & Memoir",
        description:
          "Read about the lives, experiences, and personal journeys of remarkable individuals.",
        imageUrl: "/images/genres/biography-memoir.svg?height=50&width=50",
      },
      {
        name: "Self-Help",
        description:
          "Find guidance and strategies for personal development, mental well-being, and achieving your goals.",
        imageUrl: "/images/genres/self-help.svg?height=50&width=50",
      },
      {
        name: "Health & Wellness",
        description:
          "Explore topics related to physical health, mental well-being, nutrition, and holistic living.",
        imageUrl: "/images/genres/health-wellness.svg?height=50&width=50",
      },
      {
        name: "History",
        description:
          "Delve into past events, significant eras, and influential figures that have shaped the world.",
        imageUrl: "/images/genres/history.svg?height=50&width=50",
      },
      {
        name: "Science",
        description:
          "Discover insights into various scientific fields, research breakthroughs, and the natural world.",
        imageUrl: "/images/genres/science.svg?height=50&width=50",
      },
      {
        name: "Technology",
        description:
          "Stay updated with advancements in technology, digital innovations, and their impact on society.",
        imageUrl: "/images/genres/technology.svg?height=50&width=50",
      },
      {
        name: "Business & Economics",
        description:
          "Learn about market dynamics, entrepreneurial ventures, economic theories, and business strategies.",
        imageUrl: "/images/genres/business-economics.svg?height=50&width=50",
      },
      {
        name: "Travel",
        description:
          "Embark on journeys through travelogues, destination guides, and cultural explorations.",
        imageUrl: "/images/genres/travel.svg?height=50&width=50",
      },
      {
        name: "Cooking",
        description:
          "Enhance your culinary skills with recipes, cooking techniques, and gastronomic adventures.",
        imageUrl: "/images/genres/cooking.svg?height=50&width=50",
      },
      {
        name: "Art & Photography",
        description:
          "Appreciate visual arts, photography techniques, and the creative processes behind masterpieces.",
        imageUrl: "/images/genres/art-photography.svg?height=50&width=50",
      },
      {
        name: "Religion & Spirituality",
        description:
          "Explore diverse belief systems, spiritual practices, and philosophical inquiries.",
        imageUrl: "/images/genres/religion-spirituality.svg?height=50&width=50",
      },
      {
        name: "Poetry",
        description:
          "Immerse yourself in lyrical expressions, poetic forms, and the beauty of well-crafted verses.",
        imageUrl: "/images/genres/poetry.svg?height=50&width=50",
      },
      {
        name: "Comics & Graphic Novels",
        description:
          "Enjoy visually-driven storytelling with vibrant illustrations and engaging narratives.",
        imageUrl: "/images/genres/comics-graphic-novels.svg?height=50&width=50",
      },
      {
        name: "Educational",
        description:
          "Access resources for learning, academic subjects, and skill development across various disciplines.",
        imageUrl: "/images/genres/educational.svg?height=50&width=50",
      },
    ],
  },
  {
    name: "Children's Books",
    subcategories: [
      {
        name: "Picture Books",
        description:
          "Colorful and engaging stories designed to captivate young readers through illustrations and simple narratives.",
        imageUrl: "/images/genres/picture-books.svg?height=50&width=50",
      },
      {
        name: "Early Readers",
        description:
          "Books crafted to help children transition from picture books to more text-heavy stories with basic vocabulary.",
        imageUrl: "/images/genres/early-readers.svg?height=50&width=50",
      },
      {
        name: "Middle Grade",
        description:
          "Adventures and stories tailored for children aged 8-12, featuring relatable characters and exciting plots.",
        imageUrl: "/images/genres/middle-grade.svg?height=50&width=50",
      },
      {
        name: "Young Adult",
        description:
          "Engaging stories that resonate with teenagers, addressing themes of identity, growth, and relationships.",
        imageUrl: "/images/genres/young-adult.svg?height=50&width=50",
      },
      {
        name: "Educational",
        description:
          "Books focused on learning, covering subjects like math, science, history, and more in an engaging manner.",
        imageUrl: "/images/genres/educational-childrens.svg?height=50&width=50",
      },
      {
        name: "Activity Books",
        description:
          "Interactive books filled with puzzles, games, coloring pages, and activities to stimulate creativity and learning.",
        imageUrl: "/images/genres/activity-books.svg?height=50&width=50",
      },
    ],
  },
  // Add more main genres as needed
];


export default async function Page(props: {
  params: Promise<{
    subcategory: string;
    category: string;
  }>;
}) {
  const { subcategory, category } = await props.params;
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-2 border-b-2 text-sm font-bold">690 Products</h1>
      <div className="space-y-4">
        {bookGenres.map((collection, index) => (
          <div key={index}>
            <h2 className="mb-2 border-b-2 text-lg font-semibold">
              {collection.name}
            </h2>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
              {collection.subcategories.map((item, subcategoryIndex) => (
                <Link
                  key={subcategoryIndex}
                  className="group flex h-full flex-row border px-4 py-2 hover:bg-gray-100"
                  href={`/products/${category}/${subcategory}/${item.name}`}
                >
                  <div className="py-2">
                    <Image
                      src="/placeholder.svg?height=48&width=48"
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
                    <p className="overflow-hidden text-xs">
                      {item.description}
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
