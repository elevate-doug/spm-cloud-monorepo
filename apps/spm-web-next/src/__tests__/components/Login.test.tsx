import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, mockPush, mockRefresh } from '../test-utils';
import LoginForm from '@/app/login/login-form';

// Mock the login server action
vi.mock('@/lib/actions/auth', () => ({
  login: vi.fn(),
}));

import { login } from '@/lib/actions/auth';
const mockLogin = vi.mocked(login);

// Test data - tenants are passed as props in Next.js
const mockTenants = [
  { id: 'tenant-1', name: 'hospital1', displayName: 'General Hospital' },
  { id: 'tenant-2', name: 'hospital2', displayName: 'City Medical Center' },
];

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Tenant List Display', () => {
    it('should display tenants in select dropdown', async () => {
      render(<LoginForm tenants={mockTenants} />);

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('should render with provided tenants', async () => {
      render(<LoginForm tenants={mockTenants} />);

      // Select should be enabled when tenants are provided
      const select = screen.getByRole('combobox');
      expect(select).not.toBeDisabled();
    });

    it('should render with empty tenants list', async () => {
      render(<LoginForm tenants={[]} />);

      // Component should still render
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });
  });

  describe('Login Form Interaction', () => {
    it('should allow entering username and password', async () => {
      const user = userEvent.setup();
      render(<LoginForm tenants={mockTenants} />);

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'testpassword');

      expect(usernameInput).toHaveValue('testuser');
      expect(passwordInput).toHaveValue('testpassword');
    });
  });

  describe('Successful Login', () => {
    it('should call login action with correct credentials', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValueOnce({ success: true });

      render(<LoginForm tenants={mockTenants} />);

      // Select tenant
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'tenant-1');

      // Fill in credentials
      await user.type(screen.getByLabelText(/username/i), 'testuser');
      await user.type(screen.getByLabelText(/password/i), 'testpassword');

      // Submit
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('tenant-1', 'testuser', 'testpassword');
      });
    });

    it('should navigate to assembly page on successful login', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValueOnce({ success: true });

      render(<LoginForm tenants={mockTenants} />);

      await user.selectOptions(screen.getByRole('combobox'), 'tenant-1');
      await user.type(screen.getByLabelText(/username/i), 'testuser');
      await user.type(screen.getByLabelText(/password/i), 'testpassword');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/assembly');
      });
    });

    it('should refresh router on successful login', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValueOnce({ success: true });

      render(<LoginForm tenants={mockTenants} />);

      await user.selectOptions(screen.getByRole('combobox'), 'tenant-1');
      await user.type(screen.getByLabelText(/username/i), 'testuser');
      await user.type(screen.getByLabelText(/password/i), 'testpassword');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled();
      });
    });
  });

  describe('Failed Login', () => {
    it('should show error toast on login failure', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValueOnce({ success: false, error: 'Invalid credentials' });

      render(<LoginForm tenants={mockTenants} />);

      await user.selectOptions(screen.getByRole('combobox'), 'tenant-1');
      await user.type(screen.getByLabelText(/username/i), 'wronguser');
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });

    it('should clear password field on failed login', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValueOnce({ success: false, error: 'Failed' });

      render(<LoginForm tenants={mockTenants} />);

      const passwordInput = screen.getByLabelText(/password/i);

      await user.selectOptions(screen.getByRole('combobox'), 'tenant-1');
      await user.type(screen.getByLabelText(/username/i), 'testuser');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(passwordInput).toHaveValue('');
      });
    });
  });

  describe('Validation', () => {
    it('should show error when submitting without filling fields', async () => {
      const user = userEvent.setup();
      render(<LoginForm tenants={mockTenants} />);

      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should disable submit button while login is pending', async () => {
      const user = userEvent.setup();
      mockLogin.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 200))
      );

      render(<LoginForm tenants={mockTenants} />);

      await user.selectOptions(screen.getByRole('combobox'), 'tenant-1');
      await user.type(screen.getByLabelText(/username/i), 'testuser');
      await user.type(screen.getByLabelText(/password/i), 'testpassword');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      // Button should be disabled during loading
      expect(submitButton).toBeDisabled();

      // Wait for loading to complete
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalled();
      });
    });
  });

  describe('UI Elements', () => {
    it('should render all form elements', async () => {
      render(<LoginForm tenants={mockTenants} />);

      expect(screen.getByAltText(/spm/i)).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should have password field with type password', async () => {
      render(<LoginForm tenants={mockTenants} />);

      expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password');
    });
  });
});
