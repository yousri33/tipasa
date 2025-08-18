// Product Types
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

// Customer Types removed as Customers table doesn't exist in Airtable

// Order Types
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

// Order Modal Types
export interface OrderData {
  customerName: string;
  phoneNumber: string;
  wilaya: string;
  commune: string;
  deliveryType: 'home' | 'bureau';
  productName: string;
  productPrice: number;
  size: string;
}

// Filter Types
export type SortOption = 'name' | 'price-low' | 'price-high';
export type CategoryOption = 'all' | 'Burkinis' | 'Hijabs' | 'Modest Wear' | 'Accessories';

export interface FilterState {
  searchTerm: string;
  selectedCategory: CategoryOption;
  sortBy: SortOption;
}

// Airtable Types
export interface AirtableAttachment {
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

export interface AirtableProductFields {
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