import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/test/utils/test-utils';
import { AuthModal } from '../AuthModal';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock Modal component
vi.mock('@/components/ui', () => ({
  Modal: ({ children, isOpen, title }: any) => 
    isOpen ? <div role="dialog" aria-label={title}>{children}</div> : null,
  Button: ({ children, onClick, ...props }: any) => 
    <button onClick={onClick} {...props}>{children}</button>,
  Input: ({ placeholder, value, onChange, type, ...props }: any) => 
    <input 
      placeholder={placeholder} 
      value={value} 
      onChange={onChange} 
      type={type}
      {...props}
    />,
}));

describe('AuthModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('common:auth.login_title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('common:auth.login_email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('common:auth.login_password')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<AuthModal isOpen={false} onClose={mockOnClose} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('switches to register mode when register tab is clicked', async () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} />);
    
    const registerTab = screen.getByText('common:auth.register_title');
    fireEvent.click(registerTab);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('common:auth.register_first_name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('common:auth.register_last_name')).toBeInTheDocument();
    });
  });

  it('handles form input changes', () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} />);
    
    const emailInput = screen.getByPlaceholderText('common:auth.login_email');
    const passwordInput = screen.getByPlaceholderText('common:auth.login_password');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('submits login form', async () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} />);
    
    const emailInput = screen.getByPlaceholderText('common:auth.login_email');
    const passwordInput = screen.getByPlaceholderText('common:auth.login_password');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    const form = emailInput.closest('form');
    if (form) {
      fireEvent.submit(form);
    }
    
    // Should show loading state and then close modal
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it('clears form when switching modes', () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} />);
    
    const emailInput = screen.getByPlaceholderText('common:auth.login_email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const registerTab = screen.getByText('common:auth.register_title');
    fireEvent.click(registerTab);
    
    const loginTab = screen.getByText('common:auth.login_title');
    fireEvent.click(loginTab);
    
    const clearedEmailInput = screen.getByPlaceholderText('common:auth.login_email');
    expect(clearedEmailInput).toHaveValue('');
  });

  it('handles RTL layout for Arabic language', () => {
    // Mock Arabic language
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'ar' },
      }),
    }));

    render(<AuthModal isOpen={true} onClose={mockOnClose} />);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('dir', 'rtl');
  });

  it('has proper accessibility attributes', () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} />);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-label', 'common:auth.login_title');
    
    const emailInput = screen.getByPlaceholderText('common:auth.login_email');
    expect(emailInput).toHaveAttribute('required');
    
    const passwordInput = screen.getByPlaceholderText('common:auth.login_password');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('required');
  });
});