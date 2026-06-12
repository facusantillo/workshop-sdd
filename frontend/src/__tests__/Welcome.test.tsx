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
    expect(heading).toHaveTextContent('Expense Tracker v0.1.0');
  });
});
