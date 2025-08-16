import { NextRequest, NextResponse } from 'next/server';

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

// Simulated Airtable data based on the actual data we fetched
const AIRTABLE_PRODUCTS: AirtableProduct[] = [
  {
    id: "recOfz2vsWt0mEwyS",
    fields: {
      "Product Name": "Elegant Burkini Set - Navy",
      "Category": "Burkinis",
      "Product Images": [{
        id: "attCzt3maISa6Bn3U",
        url: "https://v5.airtableusercontent.com/v3/u/44/44/1755367200000/T1NtSrVBSIc4tiqEC8thSw/tbPX2N77d5B9yIJd7EvA1tVfqUoAUYxzlf5Xnj9Fu9qWtkJfeWu8mOrxkQCP_DMb0wqHXt949ZZwcwZ64aqsD6ofkh56E9rswaAEsphcTAnr6XAkeiL2Wn41Ec0xk8D0W1js-265OWyHHYp6y0RpLg/U1M-Qjrz0k2XEkx9Z1aDzS3CsFKVSCah9RMVhWVvmvM",
        thumbnails: {
          large: {
            url: "https://v5.airtableusercontent.com/v3/u/44/44/1755367200000/LjPxHGisihzV-J2MnG9X6Q/mcVz6v47tZjU4BDFR4Fk5ZS9QRUmsPFUPvR4e1jN7afdpKoQPul-PgWZAm20lKlzgJLC0KtfyNPM9wlFyNPjDwkiIll0Z3x8qjHblw0pqwx5uX8h_8sSKO-IL6TcyJh3dxMSc5wOcY2BnJA_AdfiGg/0RH5OQKySXbGGRQSf-Tkt9Vy7-hEI56v7R0m2RZ7F3k",
            width: 512,
            height: 678
          }
        }
      }]
    }
  },
  {
    id: "recaawKH3t1xg9wMF",
    fields: {
      "Product Name": "Premium Silk Hijab",
      "Category": "Hijabs",
      "Product Images": [{
        id: "attiJ1pipY7pBkVIv",
        url: "https://v5.airtableusercontent.com/v3/u/44/44/1755367200000/-DTQtUOuUj-h1J9bVrixwQ/2MjYru-TU5Xl8H9CpTcfc-XvWcNUzJLUX13m2eyEKC9sVgHGudXitE1PK1f0upgn_4lp1cCRYflZjVPrtcEQn560karI3kRZ6PnpSd6RFmL9ypFditpq_c2TCIoTYNifG3uOj4Yohtz61O4jbrfz4A/NesfAousqUYRT_69KqwV4I13XO1RINaBHtQTJD__kxY",
        thumbnails: {
          large: {
            url: "https://v5.airtableusercontent.com/v3/u/44/44/1755367200000/EiXRv-udEIuUpVai3JAK_w/0Q6lWK77ZGe-P0EWUjAR8YFIziEbrC1N8y3TMga9E_zDeumzaeKx5X88Iad3cjpkPwKsjE1B3EWutJIF4wRx9j6GMo52vs8vO0674fW4b6Dl4DdirKO3GRcHhCIthOOsBVtpXTfKmAE8z7o0zSOPBQ/G9J0LqNUkcUbFTghmHh1sF9IUNJk7f9iuikso6DZcBM",
            width: 512,
            height: 891
          }
        }
      }]
    }
  }
];

function getRandomImageForCategory(category: string): string {
  // Filter products by category
  const categoryProducts = AIRTABLE_PRODUCTS.filter(
    product => product.fields.Category === category
  );

  if (categoryProducts.length === 0) {
    return '/api/placeholder/400/300';
  }

  // Get a random product from the category
  const randomProduct = categoryProducts[Math.floor(Math.random() * categoryProducts.length)];
  
  // Get the first image from the product
  const images = randomProduct.fields['Product Images'];
  if (images && images.length > 0) {
    // Use the large thumbnail for better quality
    return images[0].thumbnails.large.url;
  }

  return '/api/placeholder/400/300';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.preloadAll) {
      // Return images for all categories
      const images: CategoryImageMap = {
        'Burkinis': getRandomImageForCategory('Burkinis'),
        'Hijabs': getRandomImageForCategory('Hijabs'),
        'Modest Wear': getRandomImageForCategory('Modest Wear')
      };
      
      return NextResponse.json({ images });
    }
    
    if (body.category) {
      const imageUrl = getRandomImageForCategory(body.category);
      return NextResponse.json({ imageUrl });
    }
    
    return NextResponse.json({ error: 'Category not specified' }, { status: 400 });
  } catch (error) {
    console.error('Error in airtable-images API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}