export const MOCK_AUTHOR = 'demo@expense-tracker.dev';

export enum Category {
  TRAVEL = 'TRAVEL',
  FOOD = 'FOOD',
  SOFTWARE = 'SOFTWARE',
  OFFICE = 'OFFICE',
  OTHER = 'OTHER',
}

export enum ExpenseStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
}

export interface Expense {
  id: string;
  date: Date;
  amount: number;
  currency: Currency;
  category: Category;
  description: string;
  author: string;
  status: ExpenseStatus;
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date | null;
  rejectedAt?: Date | null;
  rejectionReason?: string | null;
}

export interface CreateExpenseInput {
  date: Date;
  amount: number;
  currency?: Currency;
  category: Category;
  description: string;
}
