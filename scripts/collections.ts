export const collectionsData = [
  { id: 1, name: 'General Literature', slug: 'general-literature' },
  { id: 2, name: 'Fiction', slug: 'fiction' },
  { id: 3, name: 'Non-Fiction', slug: 'non-fiction' },
  { id: 4, name: "Children's Books", slug: 'childrens-books' },
  { id: 5, name: 'Science', slug: 'science' },
  { id: 6, name: 'History', slug: 'history' },
  { id: 7, name: 'Biography & Memoir', slug: 'biography-memoir' },
  { id: 8, name: 'Fantasy', slug: 'fantasy' },
  { id: 9, name: 'Mystery & Thriller', slug: 'mystery-thriller' },
  { id: 10, name: 'Romance', slug: 'romance' },
  { id: 11, name: 'Self-Help', slug: 'self-help' },
  { id: 12, name: 'Health & Wellness', slug: 'health-wellness' },
  { id: 13, name: 'Travel', slug: 'travel' },
  { id: 14, name: 'Cooking', slug: 'cooking' },
  { id: 15, name: 'Art & Photography', slug: 'art-photography' },
  { id: 16, name: 'Business & Economics', slug: 'business-economics' },
  { id: 17, name: 'Technology', slug: 'technology' },
  { id: 18, name: 'Religion & Spirituality', slug: 'religion-spirituality' },
  { id: 19, name: 'Poetry', slug: 'poetry' },
  { id: 20, name: 'Comics & Graphic Novels', slug: 'comics-graphic-novels' },
];

import { db } from "../src/db";
import { collections } from '../src/db/schema';


(async () => {
  try {
    await db.insert(collections).values(collectionsData);
    console.log('Collections inserted successfully');
  } catch (error) {
    console.error('Error inserting collections:', error);
  }
})();