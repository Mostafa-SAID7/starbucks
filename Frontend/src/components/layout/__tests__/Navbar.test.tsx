import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/test/utils/test-utils';
import { Navbar } from '../Navbar';
import { useParams, useLocation } from 'react-router-dom';

// Mock the navigation hook
vi.mock('@/hooks/queries', () => ({
  useNavigation: () => ({
    data: {
      navbar: {
        links: [
          { id: 'menu', href: '/menu', slug: null },
          { id: 'locations', href: '/locations', slug: null },
          { id: 'about', href: '/about-us', slug: 'about-us' },
        ],
      },
    },
    isLoading: false,
    error: null,
  }),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    useParams: vi.fn(() => ({ lang: 'en' })),
    useLocation: vi.fn(() => ({ pathname: '/en' })),
    useNavigate: vi.fn(() => vi.fn()),
  };
});

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({ lang: 'en' });
    vi.mocked(useLocation).mockReturnValue({ pathname: '/en' } as any);
  });

  it('renders the logo and navigation links', () => {
    render(<Navbar />);
    
    expect(screen.getByLabelText('Starbucks Home')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('displays language toggle button', () => {
    render(<Navbar />);
    
    const languageButton = screen.getByText('AR');
    expect(languageButton).toBeInTheDocument();
  });

  it('displays theme toggle button', () => {
    render(<Navbar />);
    
    const themeButton = screen.getByLabelText(/dark mode|light mode/i);
    expect(themeButton).toBeInTheDocument();
  });

  it('opens mobile menu when hamburger is clicked', async () => {
    render(<Navbar />);
    
    const hamburgerButton = screen.getByLabelText(/open menu/i);
    fireEvent.click(hamburgerButton);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/close menu/i)).toBeInTheDocument();
    });
  });

  it('opens search modal when search button is clicked', async () => {
    render(<Navbar />);
    
    const searchButton = screen.getByLabelText(/search/i);
    fireEvent.click(searchButton);
    
    expect(searchButton).toBeInTheDocument();
  });

  it('opens auth modal when account button is clicked', async () => {
    render(<Navbar />);
    
    const accountButton = screen.getByLabelText(/account/i);
    fireEvent.click(accountButton);
    
    expect(accountButton).toBeInTheDocument();
  });

  it('applies correct RTL styling for Arabic language', () => {
    vi.mocked(useParams).mockReturnValue({ lang: 'ar' });
    vi.mocked(useLocation).mockReturnValue({ pathname: '/ar' } as any);

    render(<Navbar />);
    
    const languageButton = screen.getByText('EN');
    expect(languageButton).toBeInTheDocument();
  });

  it('handles keyboard navigation correctly', () => {
    render(<Navbar />);
    
    const navigation = screen.getByRole('navigation');
    expect(navigation).toHaveAttribute('aria-label', 'Main navigation');
  });

  it('displays correct accessibility attributes', () => {
    render(<Navbar />);
    
    const logo = screen.getByLabelText('Starbucks Home');
    expect(logo).toHaveAttribute('aria-label', 'Starbucks Home');
    
    const navigation = screen.getByRole('navigation');
    expect(navigation).toHaveAttribute('aria-label', 'Main navigation');
  });
});