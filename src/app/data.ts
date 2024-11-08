export const categories = [
  "Fiction",
  "Non-Fiction",
  "Children's Books",
  "Educational",
  "Science",
  "History",
  "Biography & Memoir",
  "Fantasy",
  "Mystery & Thriller",
  "Romance",
  "Self-Help",
  "Health & Wellness",
  "Travel",
  "Cooking",
  "Art & Photography",
  "Business & Economics",
  "Technology",
  "Religion & Spirituality",
  "Poetry",
  "Comics & Graphic Novels",
  "Young Adult",
  "Horror",
  "Classic Literature",
  "Short Stories",
  "Drama",
  "Adventure",
];

export const productCategories = [
  {
    name: "Fiction",
    subcategories: [
      { name: "Science Fiction", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Fantasy", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Mystery & Thriller", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Romance", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Horror", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Adventure", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Classic Literature", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Young Adult", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Drama", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Short Stories", icon: "/placeholder.svg?height=50&width=50" },
    ],
  },
  {
    name: "Non-Fiction",
    subcategories: [
      { name: "Biography & Memoir", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Self-Help", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Health & Wellness", icon: "/placeholder.svg?height=50&width=50" },
      { name: "History", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Science", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Technology", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Business & Economics", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Travel", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Cooking", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Art & Photography", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Religion & Spirituality", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Poetry", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Comics & Graphic Novels", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Educational", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Other Non-Fiction", icon: "/placeholder.svg?height=50&width=50" },
    ],
  },
  {
    name: "Children's Books",
    subcategories: [
      { name: "Picture Books", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Early Readers", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Middle Grade", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Young Adult", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Educational", icon: "/placeholder.svg?height=50&width=50" },
      { name: "Activity Books", icon: "/placeholder.svg?height=50&width=50" },
    ],
  },
  // Add more main categories as needed
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const bookGenresForArm = [
  {
    name: "Fiction",
    categories: [
      "Science Fiction",
      "Fantasy",
      "Mystery & Thriller",
      "Romance",
      "Horror",
      "Adventure",
      "Classic Literature",
      "Young Adult",
      "Drama",
      "Short Stories",
    ],
  },
  {
    name: "Non-Fiction",
    categories: [
      "Biography & Memoir",
      "Self-Help",
      "Health & Wellness",
      "History",
      "Science",
      "Technology",
      "Business & Economics",
      "Travel",
      "Cooking",
      "Art & Photography",
      "Religion & Spirituality",
      "Poetry",
      "Comics & Graphic Novels",
      "Educational",
    ],
  },
  {
    name: "Children's Books",
    categories: [
      "Picture Books",
      "Early Readers",
      "Middle Grade",
      "Young Adult",
      "Educational",
      "Activity Books",
    ],
  },
  // Add more genre groups as needed
];

export const books = [
  {
    collectionName: "Bestsellers",
    categories: [
      {
        categoryName: "Fiction",
        categoryItems: [
          {
            subCollectionName: "Recent Bestsellers",
            subcategories: [
              {
                name: "The Midnight Library",
                products: [
                  {
                    name: "The Midnight Library",
                    author: "Matt Haig",
                    description:
                      "A novel about a library beyond the edge of the universe that contains books with different versions of your life.",
                    price: 14.99,
                    highlights: [
                      "Award-winning bestseller.",
                      "Explores themes of regret and possibility.",
                      "Engaging and thought-provoking narrative.",
                    ],
                  },
                  {
                    name: "Where the Crawdads Sing",
                    author: "Delia Owens",
                    description:
                      "A mystery and coming-of-age story set in the marshes of North Carolina.",
                    price: 12.99,
                    highlights: [
                      "Bestseller with a compelling storyline.",
                      "Beautifully descriptive setting.",
                      "Explores themes of isolation and resilience.",
                    ],
                  },
                  // Add more books as needed
                ],
              },
              // Add more subcollections if necessary
            ],
          },
        ],
      },
      {
        categoryName: "Non-Fiction",
        categoryItems: [
          {
            subCollectionName: "Top Biographies",
            subcategories: [
              {
                name: "Becoming",
                products: [
                  {
                    name: "Becoming",
                    author: "Michelle Obama",
                    description:
                      "An intimate, powerful, and inspiring memoir by the former First Lady of the United States.",
                    price: 19.99,
                    highlights: [
                      "Inspiring personal journey.",
                      "Insights into life in the White House.",
                      "Engaging and heartfelt storytelling.",
                    ],
                  },
                  {
                    name: "Educated",
                    author: "Tara Westover",
                    description:
                      "A memoir about a woman who grows up in a strict and abusive household in rural Idaho but eventually escapes to learn about the wider world through education.",
                    price: 16.99,
                    highlights: [
                      "Powerful story of self-education.",
                      "Themes of family and resilience.",
                      "Critically acclaimed bestseller.",
                    ],
                  },
                  // Add more books as needed
                ],
              },
              // Add more subcollections if necessary
            ],
          },
        ],
      },
      // Add more main categories and their collections as needed
    ],
  },
  {
    collectionName: "New Releases",
    categories: [
      {
        categoryName: "Fiction",
        categoryItems: [
          {
            subCollectionName: "Latest Thrillers",
            subcategories: [
              {
                name: "The Silent Patient",
                products: [
                  {
                    name: "The Silent Patient",
                    author: "Alex Michaelides",
                    description:
                      "A psychological thriller about a woman's act of violence against her husband—and the therapist obsessed with uncovering her motive.",
                    price: 13.99,
                    highlights: [
                      "Gripping psychological thriller.",
                      "Unexpected twists and turns.",
                      "Engaging and suspenseful narrative.",
                    ],
                  },
                  // Add more books as needed
                ],
              },
            ],
          },
        ],
      },
      // Add more categories and subcollections as needed
    ],
  },
  // Add more collections like "Staff Picks", "Genre Highlights", etc.
];
