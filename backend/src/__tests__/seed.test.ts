import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '../infrastructure/prisma.js';
import { Category, ExpenseStatus } from '../domain/expense.js';
import { main as runSeed } from '../../prisma/seed.js';

describe('Seed distribution contract', () => {
  beforeAll(async () => {
    await runSeed();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('has at least 15 expenses', async () => {
    const count = await prisma.expense.count();
    expect(count).toBeGreaterThanOrEqual(15);
  });

  it('has at least one expense per category', async () => {
    const categories = Object.values(Category);
    for (const category of categories) {
      const count = await prisma.expense.count({ where: { category } });
      expect(count, `Category ${category} should have at least 1 expense`).toBeGreaterThanOrEqual(1);
    }
  });

  it('has at least 3 expenses per status', async () => {
    const statuses = Object.values(ExpenseStatus);
    for (const status of statuses) {
      const count = await prisma.expense.count({ where: { status } });
      expect(count, `Status ${status} should have at least 3 expenses`).toBeGreaterThanOrEqual(3);
    }
  });

  it('has at least 5 approved expenses', async () => {
    const count = await prisma.expense.count({ where: { status: ExpenseStatus.APPROVED } });
    expect(count).toBeGreaterThanOrEqual(5);
  });

  it('has varied amounts (not all the same)', async () => {
    const expenses = await prisma.expense.findMany({ select: { amount: true } });
    const amounts = expenses.map((e) => e.amount);
    const unique = new Set(amounts);
    expect(unique.size).toBeGreaterThan(1);
  });
});
