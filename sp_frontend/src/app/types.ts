// types.ts
export interface Task {
  id: string;
  title: string;
  done: boolean;
}

export interface Item {
  id: string;
  name: string;
  remaining: number;
  imageUrl: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  itemCount: number;
}

export interface DashboardData {
  userName: string;
  tasks: Task[];
  lowStockItems: Item[];
  recentShoppingLists: ShoppingList[];
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  user_id: string;
}