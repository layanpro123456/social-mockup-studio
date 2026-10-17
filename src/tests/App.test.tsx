import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { App } from '../app/App';

describe('Social Mockup Studio App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders application header and fictional watermark', () => {
    render(<App />);
    expect(screen.getByText('Social Mockup Studio')).toBeInTheDocument();
    expect(screen.getByText('Fictional Mode Enforced')).toBeInTheDocument();

    const watermarks = screen.getAllByTestId('fictional-mockup-watermark');
    expect(watermarks.length).toBeGreaterThan(0);
    expect(watermarks[0]).toHaveTextContent('FICTIONAL MOCKUP');
  });

  it('switches between templates in the gallery', () => {
    render(<App />);

    const feedPostButton = screen.getByRole('button', { name: /Feed Post/i });
    fireEvent.click(feedPostButton);

    expect(screen.getByText(/Fictional Author Name/i)).toBeInTheDocument();
  });

  it('allows editing project title', () => {
    render(<App />);

    const titleInput = screen.getByDisplayValue(/Sample Generic Chat/i);
    fireEvent.change(titleInput, { target: { value: 'My Awesome Storyboard' } });

    expect(screen.getByDisplayValue('My Awesome Storyboard')).toBeInTheDocument();
  });
});
