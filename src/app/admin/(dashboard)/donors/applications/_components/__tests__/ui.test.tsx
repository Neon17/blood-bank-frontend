import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../ui';
import React from 'react';

describe('StatusBadge', () => {
  it('renders with approved status', () => {
    render(<StatusBadge status="approved" />);
    const badge = screen.getByText(/Approved/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-50');
  });

  it('renders with pending status', () => {
    render(<StatusBadge status="pending" />);
    const badge = screen.getByText(/Pending/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-yellow-50');
  });

  it('renders with rejected status', () => {
    render(<StatusBadge status="rejected" />);
    const badge = screen.getByText(/Rejected/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-50');
  });

  it('renders with wrong status', () => {
    render(<StatusBadge status="wrong" />);
    const badge = screen.getByText(/Wrong/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-50');
  });

  it('defaults to pending for unknown status', () => {
    render(<StatusBadge status="unknown" />);
    const badge = screen.getByText(/Pending/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-yellow-50');
  });
});
