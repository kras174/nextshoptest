export type Product = {
  id: number;
  image_url: string;
  title: string;
  description: string;
  price: number;
};

export type Review = {
  id: number;
  text: string;
};

export type CartItem = {
  id: string;
  title: string;
  price: number;
  qty: number;
};

export type ProductsContextType = {
  productsMap: Record<number, Product>;
  setProductsMap: React.Dispatch<React.SetStateAction<Record<number, Product>>>;
};

export type CartContextType = {
  cart: Record<number, number>;
  setCart: React.Dispatch<React.SetStateAction<Record<number, number>>>;
};