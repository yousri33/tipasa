interface AirtableProduct {
  id: string;
  fields: {
    'Product Name': string;
    Category: string;
    'Product Images'?: Array<{
      id: string;
      url: string;
      thumbnails: {
        large: {
          url: string;
          width: number;
          height: number;
        };
      };
    }>;
  };
}

interface CategoryImageMap {
  [key: string]: string;
}

// Cache for category images to avoid repeated API calls
let categoryImageCache: CategoryImageMap = {};
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getRandomCategoryImage(category: string): Promise<string> {
  // Check cache first
  const now = Date.now();
  if (categoryImageCache[category] && (now - cacheTimestamp) < CACHE_DURATION) {
    return categoryImageCache[category];
  }

  try {
    // Fetch products from Airtable
    const response = await fetch('/api/airtable-images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch category image');
    }

    const data = await response.json();
    
    if (data.imageUrl) {
      // Update cache
      categoryImageCache[category] = data.imageUrl;
      cacheTimestamp = now;
      return data.imageUrl;
    }
  } catch (error) {
    console.error('Error fetching category image:', error);
  }

  // Fallback to placeholder
  return '/api/placeholder/400/300';
}

export async function preloadCategoryImages(): Promise<CategoryImageMap> {
  const categories = ['Burkinis', 'Hijabs', 'Modest Wear'];
  const imageMap: CategoryImageMap = {};

  try {
    const response = await fetch('/api/airtable-images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ preloadAll: true }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.images || {};
    }
  } catch (error) {
    console.error('Error preloading category images:', error);
  }

  // Fallback to placeholders
  categories.forEach(category => {
    imageMap[category] = '/api/placeholder/400/300';
  });

  return imageMap;
}