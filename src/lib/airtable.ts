import Airtable from 'airtable';

// Initialize Airtable function (server-side only)
function getAirtableBase() {
  if (typeof window !== 'undefined') {
    throw new Error('Airtable should only be used on the server side');
  }
  
  return new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY!
  }).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!);
}

// Table references function
function getTables() {
  const base = getAirtableBase();
  return {
    products: base(process.env.NEXT_PUBLIC_PRODUCTS_TABLE_ID!),
    customers: base(process.env.NEXT_PUBLIC_CUSTOMERS_TABLE_ID!),
    orders: base(process.env.NEXT_PUBLIC_ORDERS_TABLE_ID!)
  };
}

// Airtable-specific types
interface AirtableAttachment {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  thumbnails?: {
    small: { url: string; width: number; height: number };
    large: { url: string; width: number; height: number };
    full: { url: string; width: number; height: number };
  };
}

interface AirtableProductFields {
  'Product Name': string;
  Description: string;
  Price: number;
  Category: string;
  Size?: string;
  Color?: string | string[];
  'Stock Quantity': number;
  SKU?: string;
  'Product Images'?: AirtableAttachment[];
}



// Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  size?: string;
  color?: string;
  colors?: string[];
  stock: number;
  sku?: string;
  image?: string;
  images?: string[];
}

export interface Customer {
  id?: string;
  'Full Name': string;
  'Email': string;
  'Phone': string;
  'Address': string;
  'City': string;
  'Country': string;
  'Postal Code': string;
  'Date Joined': string;
  'Customer Notes'?: string;
}

export interface Order {
  id?: string;
  'Order ID': string;
  'Customer': string[];
  'Products': string[];
  'Order Date': string;
  'Order Status': string;
  'Total Amount': number;
  'Shipping Address': string;
  'Payment Method': string;
  'Order Notes'?: string;
}

// Product operations
export async function getProducts(): Promise<Product[]> {
  try {
    // Debug environment variables
    console.log('🔍 Debugging Airtable configuration:');
    console.log('API Key exists:', !!process.env.AIRTABLE_API_KEY);
    console.log('Base ID:', process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID);
    console.log('Products Table ID:', process.env.NEXT_PUBLIC_PRODUCTS_TABLE_ID);
    
    // Validate required environment variables
    if (!process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_API_KEY === 'your_api_key_here') {
      throw new Error('AIRTABLE_API_KEY is missing or invalid');
    }
    if (!process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID) {
      throw new Error('NEXT_PUBLIC_AIRTABLE_BASE_ID is missing');
    }
    if (!process.env.NEXT_PUBLIC_PRODUCTS_TABLE_ID) {
      throw new Error('NEXT_PUBLIC_PRODUCTS_TABLE_ID is missing');
    }
    
    console.log('✅ All environment variables are present, making API call...');
    const tables = getTables();
    const records = await tables.products.select().all();
    console.log('✅ API call successful, received', records.length, 'records');
    
    return records.map((record) => {
        const fields = record.fields as unknown as AirtableProductFields;
        const productImages = fields['Product Images'];
        const colors = fields['Color'];
        
        return {
          id: record.id,
          name: fields['Product Name'],
          description: fields.Description,
          price: fields.Price,
          category: fields.Category,
          size: fields.Size || undefined,
          color: Array.isArray(colors) ? colors[0] : colors || undefined,
          colors: Array.isArray(colors) ? colors : (colors ? [colors] : undefined),
          stock: fields['Stock Quantity'] || 0,
          sku: fields.SKU || undefined,
          image: productImages && productImages.length > 0 ? productImages[0]?.url : undefined,
          images: productImages ? productImages.map((img) => img.url) : undefined
        };
      });
  } catch (error) {
    console.error('❌ Detailed error fetching products from Airtable:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw new Error('Failed to fetch products. Please check your Airtable configuration.');
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    console.log(`🔍 Fetching product with ID: ${id}`);
    const { products } = getTables();
    
    const record = await products.find(id);
    
    const fields = record.fields as unknown as AirtableProductFields;
    const productImages = fields['Product Images'];
    const colors = fields['Color'];
    
    return {
      id: record.id,
      name: fields['Product Name'],
      description: fields.Description,
      price: fields.Price,
      category: fields.Category,
      size: fields.Size || undefined,
      color: Array.isArray(colors) ? colors[0] : colors || undefined,
      colors: Array.isArray(colors) ? colors : (colors ? [colors] : undefined),
      stock: fields['Stock Quantity'],
      sku: fields.SKU || undefined,
      image: productImages && productImages.length > 0 ? productImages[0].url : undefined,
      images: productImages ? productImages.map((img) => img.url) : undefined
    };
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const tables = getTables();
    const records = await tables.products.select({
      filterByFormula: `{Category} = '${category}'`
    }).all();
  
    return records.map((record) => {
      const fields = record.fields as unknown as AirtableProductFields;
      const productImages = fields['Product Images'];
      const colors = fields['Color'];
      
      return {
        id: record.id,
        name: fields['Product Name'],
        description: fields.Description,
        price: fields.Price,
        category: fields.Category,
        size: fields.Size || undefined,
        color: Array.isArray(colors) ? colors[0] : colors || undefined,
        colors: Array.isArray(colors) ? colors : (colors ? [colors] : undefined),
        stock: fields['Stock Quantity'] || 0,
        sku: fields.SKU || undefined,
        image: productImages && productImages.length > 0 ? productImages[0]?.url : undefined,
        images: productImages ? productImages.map((img) => img.url) : undefined
      };
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
}

export async function createProduct(productData: Omit<Product, 'id'>) {
  try {
    const tables = getTables();
    const record = await tables.products.create({
      'Product Name': productData.name,
      Description: productData.description,
      Price: productData.price,
      Category: productData.category,
      Size: productData.size,
      Color: productData.color,
      'Stock Quantity': productData.stock,
      SKU: productData.sku
    });
    
    return record.id;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function createCustomer(customerData: Omit<Customer, 'id' | 'Date Joined'>): Promise<Customer> {
  try {
    const tables = getTables();
    const record = await tables.customers.create({
      'Full Name': customerData['Full Name'],
      'Email': customerData['Email'],
      'Phone': customerData['Phone'],
      'Address': customerData['Address'],
      'City': customerData['City'],
      'Country': customerData['Country'],
      'Postal Code': customerData['Postal Code'],
      'Date Joined': new Date().toISOString(),
      'Customer Notes': customerData['Customer Notes']
    });
    
    return {
      id: record.id,
      ...record.fields
    } as Customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

export async function createOrder(orderData: Omit<Order, 'id' | 'Order Date'>): Promise<Order> {
  try {
    const tables = getTables();
    const record = await tables.orders.create({
      'Order ID': orderData['Order ID'],
      'Customer': orderData['Customer'],
      'Products': orderData['Products'],
      'Order Date': new Date().toISOString(),
      'Order Status': orderData['Order Status'],
      'Total Amount': orderData['Total Amount'],
      'Shipping Address': orderData['Shipping Address'],
      'Payment Method': orderData['Payment Method'],
      'Order Notes': orderData['Order Notes']
    });
    
    return {
      id: record.id,
      ...record.fields
    } as Order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// Customer operations
export const customerService = {
  async create(customer: Omit<Customer, 'id' | 'Date Joined'>): Promise<Customer> {
    const tables = getTables();
    const record = await tables.customers.create({
      ...customer,
      'Date Joined': new Date().toISOString()
    });
    
    return {
      id: record.id,
      ...record.fields
    } as Customer;
  },

  async getByEmail(email: string): Promise<Customer | null> {
    const tables = getTables();
    const records = await tables.customers.select({
      filterByFormula: `{Email} = '${email}'`,
      maxRecords: 1
    }).all();
    
    if (records.length === 0) return null;
    
    return {
      id: records[0].id,
      ...records[0].fields
    } as Customer;
  }
};

// Order operations
export const orderService = {
  async create(order: Omit<Order, 'id' | 'Order Date'>): Promise<Order> {
    const tables = getTables();
    const record = await tables.orders.create({
      ...order,
      'Order Date': new Date().toISOString()
    });
    
    return {
      id: record.id,
      ...record.fields
    } as Order;
  },

  async getAll(): Promise<Order[]> {
    const tables = getTables();
    const records = await tables.orders.select({
      view: 'Grid view',
      sort: [{ field: 'Order Date', direction: 'desc' }]
    }).all();
    
    return records.map(record => ({
      id: record.id,
      ...record.fields
    } as Order));
  },

  async updateStatus(id: string, status: string): Promise<void> {
    const tables = getTables();
    await tables.orders.update(id, {
      'Order Status': status
    });
  }
};