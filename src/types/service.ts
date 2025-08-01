
export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  created_at?: string;
}

export interface SelectedService extends Service {
  quantity: number;
  calculatedPrice: number;
  printingOptions?: {
    pages?: number;
    copies?: number;
    doubleSided?: boolean;
  };
}
