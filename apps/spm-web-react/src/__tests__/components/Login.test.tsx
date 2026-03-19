import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { render } from '../test-utils';
import Login from '../../views/admin/login';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Tenant List Loading', () => {
    it('should fetch and display tenants on mount', async () => {
      render(<Login />);

      // Wait for tenants to load
      await waitFor(() => {
        expect(screen.getByRole('combobox')).not.toBeDisabled();
      });

      // Check that tenants are available in the select
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('should disable organization select while loading', async () => {
      // Delay the response
      server.use(
        http.get('/api/tenants', async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return HttpResponse.json([
            { id: 'tenant-1', name: 'hospital1', displayName: 'General Hospital' },
          ]);
        })
      );

      render(<Login />);

      // Select should initially be disabled
      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();

      // Wait for loading to complete
      await waitFor(() => {
        expect(select).not.toBeDisabled();
      });
    });

    it('should handle tenant fetch error gracefully', async () => {
      server.use(
        http.get('/api/tenants', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      render(<Login />);

      // Component should still render without crashing
      await waitFor(() => {
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      });
    });
  });

  describe('Login Form Interaction', () => {
    it('should allow entering username and password', async () => {
      const user = userEvent.setup();
      render(<Login />);

      await waitFor(() => {
        expect(screen.getByRole('combobox')).not.toBeDisabled();
      });

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'testpassword');

      expect(usernameInput).toHaveValue('testuser');
      expect(passwordInput).toHaveValue('testpassword');
    });
  });

  describe('Successful Login', () => {
    it('should call login API with correct credentials', async () => {
      const user = userEvent.setup();
      let capturedBody: unknown;

      server.use(
        http.post('/api/auth/login', async ({ request }) => {
          capturedBody = await request.json();
          return HttpResponse.json({
            access_token: 'mock-token',
            expires_in: 3600,
          });
        })
      );

      render(<Login />);

      await waitFor(() => {
        expect(screen.getByRole('combobox')).not.toBeDisabled();
      });

      // Select tenant
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'tenant-1');

      // Fill in credentials
      await user.type(screen.getByLabelText(/username/i), 'testuser');
      await user.type(screen.getByLabelText(/password/i), 'testpassword');

      // Submit
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(capturedBody).toEqual({
          tenant: 'tenant-1',
          userName: 'testuser',
          password: 'testpassword',
        });
      });
    });

    it('should navigate to assembly page on successful login', async () => {
      const user = userEvent.setup();

      render(<Login />);

      await waitFor(() => {
        expect(screen.getByRole('combobox')).not.toBeDisabled();
      });

      await user.selectOptions(screen.getByRole('combobox'), 'tenant-1');
      await user.type(screen.getByLabelText(/username/i), 'testuser');
      await user.type(screen.getByLabelText(/password/i), 'testpassword');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/admin/assembly');
      });
    });

    it('should store JWT token in localStorage on successful login', async () => {
      const user = userEvent.setup();
      const mockToken = 'test-jwt-token';

      server.use(
        http.post('/api/auth/login', () => {
          return HttpResponse.json({
            access_token: mockToken,
            expires_in: 3600,
          });
        })
      );

      render(<Login />);

      await waitFor(() => {
        expect(screen.getByRole('combobox')).not.toBeDisabled();
      });

      await user.selectOptions(screen.getByRole('combobox'), 'tenant-1');
      await user.type(screen.getByLabelText(/username/i), 'testuser');
      await user.type(screen.getByLabelText(/password/i), 'testpassword');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('spm_selected_user', mockToken);
      });
    });
  });

  describe('Failed Login', () => {
    it('should show error toast on login failure (401)', async () => {
      const user = userEvent.setup();

      server.use(
        http.post('/api/auth/login', () => {
          return new HttpResponse(null, { status: 401 });
        })
      );

      render(<Login />);

      await waitFor(() => {
        expect(screen.getByRole('combobox')).not.toBeDisabled();
      });

      await user.selectOptions(screen.getByRole('combobox'), 'tenant-1');
      await user.type(screen.getByLabelText(/username/i), 'wronguser');
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/failed to login/i)).toBeInTheDocument();
      });
    });

    it('should clear password field on failed login', async () => {
      const user = userEvent.setup();

      server.use(
        http.post('/api/auth/login', () => {
          return new HttpResponse(null, { status: 401 });
        })
      );

      render(<Login />);

      await waitFor(() => {
        expect(screen.getByRole('combobox')).not.toBeDisabled();
      });

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

  describe('Loading States', () => {
    it('should disable submit button while login is pending', async () => {
      const user = userEvent.setup();

      server.use(
        http.post('/api/auth/login', async () => {
          await new Promise((resolve) => setTimeout(resolve, 200));
          return HttpResponse.json({
            access_token: 'mock-token',
            expires_in: 3600,
          });
        })
      );

      render(<Login />);

      await waitFor(() => {
        expect(screen.getByRole('combobox')).not.toBeDisabled();
      });

      await user.selectOptions(screen.getByRole('combobox'), 'tenant-1');
      await user.type(screen.getByLabelText(/username/i), 'testuser');
      await user.type(screen.getByLabelText(/password/i), 'testpassword');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      // Button should be disabled during loading
      expect(submitButton).toBeDisabled();

      // Wait for loading to complete
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled();
      });
    });
  });

  describe('UI Elements', () => {
    it('should render all form elements', async () => {
      render(<Login />);

      await waitFor(() => {
        expect(screen.getByRole('combobox')).not.toBeDisabled();
      });

      expect(screen.getByAltText(/spm/i)).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should have password field with type password', async () => {
      render(<Login />);

      await waitFor(() => {
        expect(screen.getByRole('combobox')).not.toBeDisabled();
      });

      expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password');
    });
  });
});
