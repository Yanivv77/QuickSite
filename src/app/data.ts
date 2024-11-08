// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CategoriesForArm = [
  {
    name: "Fiction",
    categories: [
      "Historical Fiction",
      "Science Fiction",
      "Fantasy",
      "Mystery",
      "Romance",
      "Thriller",
      "Classics",
      "Contemporary Fiction",
      "Short Stories",
      "Young Adult",
    ],
  },
  {
    name: "Non-Fiction",
    categories: [
      "Biographies",
      "Memoirs",
      "Self-Help",
      "History",
      "Science",
      "Philosophy",
      "Psychology",
      "Travel",
      "Cookbooks",
      "True Crime",
    ],
  },
  {
    name: "Children's Books",
    categories: [
      "Picture Books",
      "Early Readers",
      "Chapter Books",
      "Middle Grade",
      "Young Adult",
      "Fairy Tales and Folklore",
      "Educational Books",
      "Activity Books",
    ],
  },
  {
    name: "Academic and Reference",
    categories: [
      "Textbooks",
      "Dictionaries",
      "Encyclopedias",
      "Atlases",
      "Thesauruses",
      "Research Journals",
      "Manuals and Guides",
    ],
  },
  {
    name: "Arts and Crafts",
    categories: [
      "Drawing and Painting",
      "Photography",
      "Crafting",
      "Fashion",
      "Architecture",
      "Interior Design",
      "Music and Performing Arts",
    ],
  },
  {
    name: "Special Collections",
    categories: [
      "Rare Books",
      "Signed Editions",
      "First Editions",
      "Limited Editions",
      "Collector's Editions",
      "Antique Books",
      "Folio Society Books",
    ],
  },
  {
    name: "Miscellaneous",
    categories: [
      "Stationery",
      "Bookmarks",
      "Gift Cards",
      "Book Lights",
      "Reading Glasses",
      "Notebooks and Journals",
      "Book Stands",
      "Book Storage Solutions",
    ],
  },
];

export const ShopInventory = [
  {
    collectionName: "Fiction",
    categories: [
      {
        categoryName: "Science Fiction",
        icon: "/images/science-fiction-icon.png",
        categoryItems: [
          {
            subCollectionName: "Dystopian",
            subcategories: [
              {
                subcategoryName: "Classic Dystopian",
                products: [
                  {
                    name: "1984 by George Orwell",
                    description:
                      "A timeless dystopian novel depicting a totalitarian regime and loss of individual freedom.",
                    price: 9.99,
                    highlights: [
                      "Considered one of the greatest dystopian novels.",
                      "Features iconic concepts like 'Big Brother' and 'thoughtcrime.'",
                      "Compelling narrative with deep social commentary.",
                    ],
                  },
                  {
                    name: "Brave New World by Aldous Huxley",
                    description:
                      "A thought-provoking novel about a futuristic society focused on technology and control.",
                    price: 8.49,
                    highlights: [
                      "Explores themes of technology, control, and human identity.",
                      "Set in a utopian society with dark undertones.",
                      "Timeless critique on societal norms and values.",
                    ],
                  },
                  {
                    name: "The Handmaid's Tale by Margaret Atwood",
                    description:
                      "A dystopian novel about a world where women's rights are restricted.",
                    price: 10.99,
                    highlights: [
                      "Popular for its powerful, thought-provoking storyline.",
                      "Explores themes of freedom and repression.",
                      "Adapted into a successful TV series.",
                    ],
                  },
                  {
                    name: "Fahrenheit 451 by Ray Bradbury",
                    description:
                      "A chilling story about a future where books are banned and 'firemen' burn them.",
                    price: 7.99,
                    highlights: [
                      "Explores the dangers of censorship and loss of knowledge.",
                      "Fast-paced and impactful with a powerful message.",
                      "Features a hero questioning societal norms.",
                    ],
                  },
                  {
                    name: "The Road by Cormac McCarthy",
                    description:
                      "A haunting novel about survival in a post-apocalyptic world.",
                    price: 12.5,
                    highlights: [
                      "Poignant portrayal of survival and humanity.",
                      "Pulitzer Prize-winning story.",
                      "Features strong themes of resilience and hope.",
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
