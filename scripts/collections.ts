export const collectionsData = [
  { id: 1, name: 'בדיוני', slug: 'fiction' },
  { id: 2, name: 'לא בדיוני', slug: 'non-fiction' },
  { id: 3, name: "ספרי ילדים", slug: 'childrens-books' },
  { id: 4, name: 'ספרות כללית', slug: 'general-literature' },
  { id: 5, name: 'מדע', slug: 'science' },
  { id: 6, name: 'היסטוריה', slug: 'history' },
  { id: 7, name: 'ביוגרפיה וזיכרונות', slug: 'biography-memoir' },
  { id: 8, name: 'פנטזיה', slug: 'fantasy' },
  { id: 9, name: 'מתח ומיסתורין', slug: 'mystery-thriller' },
  { id: 10, name: 'רומנטיקה', slug: 'romance' },
  { id: 11, name: 'עצמאות', slug: 'self-help' },
  { id: 12, name: 'בריאות ורווחה', slug: 'health-wellness' },
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