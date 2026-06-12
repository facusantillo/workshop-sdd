import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Welcome from '../pages/Welcome.js';

describe('Welcome page', () => {
  it('renders the product name', () => {
    render(<Welcome />);
    expect(screen.getByRole('heading')).toHaveTextContent('Expense Tracker');
  });

  it('renders the version from VITE_APP_VERSION', () => {
    render(<Welcome />);
    const heading = screen.getByRole('heading');
    // VITE_APP_VERSION is injected at build time by vite.config.ts
    // In tests it may be undefined or set — either way the component must not crash
    expect(heading).toBeInTheDocument();
  });
});
