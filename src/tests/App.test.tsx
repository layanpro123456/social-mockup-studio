import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { App } from '../app/App';

describe('Social Mockup Studio App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders application header, fictional watermark, and ethical boundary reminder', () => {
    render(<App />);
    expect(screen.getByText('Social Mockup Studio')).toBeInTheDocument();
    expect(screen.getByText('Fictional Mode Enforced')).toBeInTheDocument();
    expect(screen.getByText(/Ethical Boundary Reminder/i)).toBeInTheDocument();

    const watermarks = screen.getAllByTestId('fictional-mockup-watermark');
    expect(watermarks.length).toBeGreaterThan(0);
    expect(watermarks[0]).toHaveTextContent('FICTIONAL MOCKUP');
  });

  it('switches to Feed Post template in the gallery', () => {
    render(<App />);

    const feedPostButton = screen.getByRole('button', { name: /Feed Post/i });
    fireEvent.click(feedPostButton);

    expect(screen.getByText(/Fictional Author Name/i)).toBeInTheDocument();
  });

  it('switches to Story Frame template and renders story caption sticker', () => {
    render(<App />);

    const storyButton = screen.getByRole('button', { name: /Story Frame/i });
    fireEvent.click(storyButton);

    expect(screen.getByText(/Story Sticker Caption/i)).toBeInTheDocument();
    const captionElements = screen.getAllByText(/Behind the scenes in the prototyping studio/i);
    expect(captionElements.length).toBeGreaterThanOrEqual(2);
  });

  it('switches to Short Video template and renders Timeline controls', () => {
    render(<App />);

    const videoButton = screen.getByRole('button', { name: /Short Video Frame/i });
    fireEvent.click(videoButton);

    expect(screen.getByText(/Reel Caption/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Play/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Frame/i })).toBeInTheDocument();
    expect(screen.getByText(/Total:/i)).toBeInTheDocument();
  });

  it('allows duplicating a project', () => {
    render(<App />);

    const duplicateButton = screen.getByRole('button', { name: /Duplicate/i });
    fireEvent.click(duplicateButton);

    expect(screen.getByDisplayValue(/Copy of Sample Generic Chat/i)).toBeInTheDocument();
  });

  it('allows editing project title', () => {
    render(<App />);

    const titleInput = screen.getByDisplayValue(/Sample Generic Chat/i);
    fireEvent.change(titleInput, { target: { value: 'My Awesome Storyboard' } });

    expect(screen.getByDisplayValue('My Awesome Storyboard')).toBeInTheDocument();
  });

  it('opens styled alert dialog when Start Fresh is clicked', () => {
    render(<App />);

    const startFreshButton = screen.getByTitle('Reset to Template Defaults');
    fireEvent.click(startFreshButton);

    expect(screen.getByText('Reset Mockup to Defaults?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Yes, Reset Template/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('opens styled alert dialog when Delete Project is clicked', () => {
    render(<App />);

    const deleteButton = screen.getByTitle(/Delete Project & Start Fresh/i);
    fireEvent.click(deleteButton);

    expect(screen.getByText('Delete Project & Start Fresh?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Yes, Delete & Start Fresh/i })).toBeInTheDocument();
  });
});
