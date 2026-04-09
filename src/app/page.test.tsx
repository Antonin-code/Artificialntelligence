import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from './page';

describe('Home Page Sanity Test', () => {
  it('renders the StudCall title', () => {
    render(<Home />);
    expect(screen.getByText('StudCall')).toBeDefined();
  });

  it('renders the call to action button', () => {
    render(<Home />);
    const link = screen.getByRole('link', { name: /accéder à la plateforme/i });
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('/login');
  });

  it('contains the key value propositions', () => {
    render(<Home />);
    expect(screen.getByText('Géolocalisé')).toBeDefined();
    expect(screen.getByText('Temps Réel')).toBeDefined();
    expect(screen.getByText('100% Autonome')).toBeDefined();
  });
});
