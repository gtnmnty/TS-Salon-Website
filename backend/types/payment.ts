export interface PaymentMethod {
  type: 'card' | 'gcash' | 'maya';
  label: string;                         
  isDefault: boolean;
}