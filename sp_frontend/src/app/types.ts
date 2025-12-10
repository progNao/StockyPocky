// types.ts
export interface Task {
  id: string;
  title: string;
  done: boolean;
}

export interface DashboardData {
  userName: string;
  tasks: Task[];
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  user_id: string;
}

export interface Item {
  id: number;
  name: string;
  brand: string;
  unit: string;
  image_url: string;
  default_quantity: number;
  notes: string;
  is_favorite: boolean;
  user_id: string;
  category_id: number;
}

export interface Stock {
  id: number;
  quantity: number;
  threshold: number;
  location: string;
  user_id: string;
  item_id: number;
}

export interface ItemListDisplay {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  stockQuantity: number;
  isFavorite: boolean;
  threshold: number;
  imageUrl: string;
  location: string;
}

export interface StockHistory {
  id: number;
  change: number;
  reason: string;
  memo: string;
  user_id: string;
  item_id: number;
  created_at: string;
}

export interface ShoppingList {
  id: number;
  quantity: number;
  checked: boolean;
  user_id: string;
  item_id: number;
  added_at: string;
}

export interface ShoppingListDisplay {
  id: number;
  quantity: number;
  checked: boolean;
  user_id: string;
  item_id: number;
  name: string;
  image_url: string;
  notes: string;
  added_at: string;
}

export interface ShoppingRecord {
  id: number;
  item_id: number;
  quantity: number;
  price: number;
  store: string;
  bought_at: string;
  user_id: string;
}

export interface ShoppingRecordDisplay {
  id: number;
  name: string;
  quantity: number;
  price: number;
  store: string;
  image_url: string;
  bought_at: string;
}

export interface Memo {
  id: number;
  title: string;
  content: string;
  type: string;
  is_done: boolean;
  tags: [];
  user_id: string;
}