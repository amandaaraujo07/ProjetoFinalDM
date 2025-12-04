export interface Product {
  id: number;
  title: string;
  price: number;
  description?: string;
  image?: string;
  category?: string;
}

export type Products = Product[];