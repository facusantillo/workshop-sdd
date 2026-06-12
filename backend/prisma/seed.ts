import { fileURLToPath } from 'url';
import prisma from '../src/infrastructure/prisma.js';
import { MOCK_AUTHOR } from '../src/domain/expense.js';

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function main(): Promise<void> {
  // Clear table before seeding to allow re-running
  await prisma.expense.deleteMany();

  const expenses = [
    // ── TRAVEL ──────────────────────────────────────────────────────────────
    {
      date: daysAgo(2),
      amount: 34500,           // 345.00 EUR
      currency: 'EUR' as const,
      category: 'TRAVEL' as const,
      description: 'Flight Barcelona → Madrid (return)',
      author: MOCK_AUTHOR,
      status: 'APPROVED' as const,
      approvedAt: daysAgo(1),
    },
    {
      date: daysAgo(10),
      amount: 12800,           // 128.00 USD
      currency: 'USD' as const,
      category: 'TRAVEL' as const,
      description: 'Taxi to airport (JFK)',
      author: MOCK_AUTHOR,
      status: 'APPROVED' as const,
      approvedAt: daysAgo(8),
    },
    {
      date: daysAgo(32),
      amount: 9900,            // 99.00 EUR
      currency: 'EUR' as const,
      category: 'TRAVEL' as const,
      description: 'Train ticket Madrid → Valencia',
      author: MOCK_AUTHOR,
      status: 'PENDING' as const,
    },

    // ── FOOD ─────────────────────────────────────────────────────────────────
    {
      date: daysAgo(1),
      amount: 4750,            // 47.50 EUR
      currency: 'EUR' as const,
      category: 'FOOD' as const,
      description: 'Team lunch after sprint review',
      author: MOCK_AUTHOR,
      status: 'APPROVED' as const,
      approvedAt: daysAgo(1),
    },
    {
      date: daysAgo(14),
      amount: 2300,            // 23.00 EUR
      currency: 'EUR' as const,
      category: 'FOOD' as const,
      description: 'Coffee & snacks — working session',
      author: MOCK_AUTHOR,
      status: 'PENDING' as const,
    },
    {
      date: daysAgo(37),
      amount: 8900,            // 89.00 USD
      currency: 'USD' as const,
      category: 'FOOD' as const,
      description: 'Client dinner (New York)',
      author: MOCK_AUTHOR,
      status: 'REJECTED' as const,
      rejectedAt: daysAgo(35),
      rejectionReason: 'Exceeds per-diem limit without prior approval',
    },

    // ── SOFTWARE ──────────────────────────────────────────────────────────────
    {
      date: daysAgo(5),
      amount: 1900,            // 19.00 EUR
      currency: 'EUR' as const,
      category: 'SOFTWARE' as const,
      description: 'GitHub Copilot monthly subscription',
      author: MOCK_AUTHOR,
      status: 'APPROVED' as const,
      approvedAt: daysAgo(4),
    },
    {
      date: daysAgo(20),
      amount: 59900,           // 599.00 USD
      currency: 'USD' as const,
      category: 'SOFTWARE' as const,
      description: 'JetBrains All Products Pack (annual)',
      author: MOCK_AUTHOR,
      status: 'APPROVED' as const,
      approvedAt: daysAgo(18),
    },
    {
      date: daysAgo(30),
      amount: 4900,            // 49.00 EUR
      currency: 'EUR' as const,
      category: 'SOFTWARE' as const,
      description: 'Figma Professional — 1 month',
      author: MOCK_AUTHOR,
      status: 'PENDING' as const,
    },
    {
      date: daysAgo(38),
      amount: 29900,           // 299.00 USD
      currency: 'USD' as const,
      category: 'SOFTWARE' as const,
      description: 'AWS account overage — load testing',
      author: MOCK_AUTHOR,
      status: 'REJECTED' as const,
      rejectedAt: daysAgo(36),
      rejectionReason: 'Costs should have been tracked in cloud cost centre',
    },

    // ── OFFICE ────────────────────────────────────────────────────────────────
    {
      date: daysAgo(3),
      amount: 6500,            // 65.00 EUR
      currency: 'EUR' as const,
      category: 'OFFICE' as const,
      description: 'Ergonomic keyboard',
      author: MOCK_AUTHOR,
      status: 'APPROVED' as const,
      approvedAt: daysAgo(2),
    },
    {
      date: daysAgo(22),
      amount: 2990,            // 29.90 EUR
      currency: 'EUR' as const,
      category: 'OFFICE' as const,
      description: 'Notebooks and pens for workshop',
      author: MOCK_AUTHOR,
      status: 'PENDING' as const,
    },
    {
      date: daysAgo(40),
      amount: 14900,           // 149.00 EUR
      currency: 'EUR' as const,
      category: 'OFFICE' as const,
      description: 'Monitor stand (home office)',
      author: MOCK_AUTHOR,
      status: 'REJECTED' as const,
      rejectedAt: daysAgo(39),
      rejectionReason: 'Home office equipment budget exhausted for this quarter',
    },

    // ── OTHER ─────────────────────────────────────────────────────────────────
    {
      date: daysAgo(7),
      amount: 5000,            // 50.00 EUR
      currency: 'EUR' as const,
      category: 'OTHER' as const,
      description: 'Conference registration fee',
      author: MOCK_AUTHOR,
      status: 'PENDING' as const,
    },
    {
      date: daysAgo(25),
      amount: 7500,            // 75.00 USD
      currency: 'USD' as const,
      category: 'OTHER' as const,
      description: 'Technical book — "Designing Data-Intensive Applications"',
      author: MOCK_AUTHOR,
      status: 'APPROVED' as const,
      approvedAt: daysAgo(24),
    },
    {
      date: daysAgo(35),
      amount: 3200,            // 32.00 EUR
      currency: 'EUR' as const,
      category: 'OTHER' as const,
      description: 'Parking fees (on-site client visit)',
      author: MOCK_AUTHOR,
      status: 'PENDING' as const,
    },
  ];

  const result = await prisma.expense.createMany({
    data: expenses,
    skipDuplicates: true,
  });

  console.log(`[seed] Created ${result.count} expense records.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
    .catch((err) => {
      console.error('[seed] Error:', err);
      process.exit(1);
    })
    .finally(() => {
      void prisma.$disconnect();
    });
}
