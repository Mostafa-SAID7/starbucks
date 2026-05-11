import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/test/utils/test-utils';
import { AuthModal } from '../AuthModal';
import { useAuth } from '@/hooks/auth/useAuth';
import { useLanguage } from '@/hooks';

// Mock auth and language hooks
vi.mock('@/hooks/auth/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/hooks', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    useLanguage: vi.fn(),
  };
});

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock Modal component
vi.mock('@/components/ui', () => ({
  Modal: ({ children, isOpen, title, className }: any) => 
    isOpen ? <div role="dialog" aria-label={title} className={className}>{children}</div> : null,
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
  const mockLogin = vi.fn();
  const mockRegister = vi.fn();
  const mockClearError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementation for useAuth
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin.mockResolvedValue({}),
      register: mockRegister.mockResolvedValue({}),
      isLoading: false,
      error: null,
      clearError: mockClearError,
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    } as any);

    // Default mock implementation for useLanguage
    vi.mocked(useLanguage).mockReturnValue({
      lang: 'en',
      isRTL: false,
      i18n: { language: 'en' } as any,
      changeLanguage: vi.fn(),
      toggleLanguage: vi.fn(),
    });
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
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
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
    vi.mocked(useLanguage).mockReturnValue({
      lang: 'ar',
      isRTL: true,
      i18n: { language: 'ar' } as any,
      changeLanguage: vi.fn(),
      toggleLanguage: vi.fn(),
    });

    render(<AuthModal isOpen={true} onClose={mockOnClose} />);
    
    const container = screen.getByRole('dialog').firstChild;
    expect(container).toHaveAttribute('dir', 'rtl');
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