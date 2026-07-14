export type Language = 'en' | 'ka' | 'ru';

export interface Category {
  id: string;
  type: string;
  name: string;
  name_en: string;
  name_ru: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  name_en: string;
  name_ru: string;
  price: string;
  thumb: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}
