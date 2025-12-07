// types.ts
export interface Task {
  id: string;
  title: string;
  done: boolean;
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
}

export interface DashboardData {
  userName: string;
  tasks: Task[];
  lowStockItems: Item[];
  recentShoppingLists: ShoppingList[];
}
