import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { mockBuilds } from '../mocks/handlers';
import { render } from '../test-utils';
import Assembly from '../../views/admin/assembly';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock setPageTitle prop
const mockSetPageTitle = vi.fn();

describe('Assembly Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Builds List Loading', () => {
    it('should fetch and display builds on mount', async () => {
      render(<Assembly setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByText('SET-001')).toBeInTheDocument();
      });

      // Completed build should be visible
      expect(screen.getByText('SET-002')).toBeInTheDocument();
    });

    it('should separate builds by status correctly', async () => {
      render(<Assembly setPageTitle={mockSetPageTitle} />);

      // Wait for data to load - SET-001 is in incomplete section, SET-002 is in completed section
      await waitFor(() => {
        expect(screen.getByText('SET-001')).toBeInTheDocument();
      });

      // Verify headers are present
      expect(screen.getByText('Currently Incomplete Builds')).toBeInTheDocument();
      expect(screen.getByText('Recent Builds')).toBeInTheDocument();
      expect(screen.getByText('SET-002')).toBeInTheDocument();
    });

    it('should show loading state while fetching builds', async () => {
      server.use(
        http.get('/api/instrumentsetbuilds', async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return HttpResponse.json(mockBuilds);
        })
      );

      render(<Assembly setPageTitle={mockSetPageTitle} />);

      expect(screen.getByText(/loading recent scans/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText(/loading recent scans/i)).not.toBeInTheDocument();
      });
    });

    it('should handle builds fetch error', async () => {
      server.use(
        http.get('/api/instrumentsetbuilds', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      render(<Assembly setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByText(/try again/i)).toBeInTheDocument();
      });
    });

    it('should show empty state when no builds exist', async () => {
      server.use(
        http.get('/api/instrumentsetbuilds', () => {
          return HttpResponse.json([]);
        })
      );

      render(<Assembly setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByText(/no paused items found/i)).toBeInTheDocument();
        expect(screen.getByText(/no recent scans found/i)).toBeInTheDocument();
      });
    });
  });

  describe('Barcode Input', () => {
    it('should render barcode input field', async () => {
      render(<Assembly setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/enter barcode or scan product/i)).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('should allow entering barcode manually', async () => {
      const user = userEvent.setup();
      render(<Assembly setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/enter barcode or scan product/i)).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/enter barcode or scan product/i);
      await user.type(input, 'TEST-BARCODE-123');

      expect(input).toHaveValue('TEST-BARCODE-123');
    });

    it('should show error toast for empty barcode submission', async () => {
      const user = userEvent.setup();
      render(<Assembly setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/please enter a barcode/i)).toBeInTheDocument();
      });
    });
  });

  describe('Barcode Lookup - Existing Build', () => {
    it('should navigate to existing incomplete build when barcode submitted', async () => {
      const user = userEvent.setup();

      server.use(
        http.get('/api/instrumentsetbuilds', ({ request }) => {
          const url = new URL(request.url);
          const barcode = url.searchParams.get('barcode');

          if (barcode === 'SET-001') {
            return HttpResponse.json([
              { id: 'build-1', barcode: 'SET-001', status: 0 },
            ]);
          }
          return HttpResponse.json(mockBuilds);
        })
      );

      render(<Assembly setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/enter barcode or scan product/i)).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/enter barcode or scan product/i);
      await user.type(input, 'SET-001');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/admin/build-screen/build-1');
      });
    });
  });

  describe('Barcode Lookup - Create New Build', () => {
    it('should create new build for completed barcode', async () => {
      const user = userEvent.setup();

      server.use(
        http.get('/api/instrumentsetbuilds', ({ request }) => {
          const url = new URL(request.url);
          const barcode = url.searchParams.get('barcode');

          if (barcode === 'SET-002') {
            return HttpResponse.json([
              { id: 'build-2', barcode: 'SET-002', status: 2 }, // Completed
            ]);
          }
          return HttpResponse.json(mockBuilds);
        }),
        http.get('/api/instrumentsets', ({ request }) => {
          const url = new URL(request.url);
          const barcode = url.searchParams.get('barcode');

          if (barcode === 'SET-002') {
            return HttpResponse.json([
              { id: 'set-2', name: 'Orthopedic Set', barcode: 'SET-002' },
            ]);
          }
          return HttpResponse.json([]);
        }),
        http.post('/api/instrumentsetbuilds/start', () => {
          return HttpResponse.json({
            id: 'build-new',
            barcode: 'SET-002',
            status: 0,
          });
        })
      );

      render(<Assembly setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/enter barcode or scan product/i)).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/enter barcode or scan product/i);
      await user.type(input, 'SET-002');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/admin/build-screen/build-new');
      });
    });

    it('should show warning for unknown barcode with no instrument set', async () => {
      const user = userEvent.setup();

      server.use(
        http.get('/api/instrumentsetbuilds', ({ request }) => {
          const url = new URL(request.url);
          const barcode = url.searchParams.get('barcode');

          if (barcode === 'UNKNOWN') {
            return HttpResponse.json([]);
          }
          return HttpResponse.json(mockBuilds);
        }),
        http.get('/api/instrumentsets', ({ request }) => {
          const url = new URL(request.url);
          const barcode = url.searchParams.get('barcode');

          if (barcode === 'UNKNOWN') {
            return HttpResponse.json([]);
          }
          return HttpResponse.json([]);
        })
      );

      render(<Assembly setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/enter barcode or scan product/i)).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/enter barcode or scan product/i);
      await user.type(input, 'UNKNOWN');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/no instrument set found/i)).toBeInTheDocument();
      });
    });
  });

  describe('Table Display', () => {
    it('should display correct column headers', async () => {
      render(<Assembly setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByText('SET-001')).toBeInTheDocument();
      });

      expect(screen.getAllByText('BARCODE')[0]).toBeInTheDocument();
      expect(screen.getAllByText('DESCRIPTION')[0]).toBeInTheDocument();
      expect(screen.getAllByText('LOCATION')[0]).toBeInTheDocument();
    });

    it('should display build data correctly', async () => {
      render(<Assembly setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByText('SET-001')).toBeInTheDocument();
      });

      expect(screen.getByText('Cardiac Surgery Set')).toBeInTheDocument();
      expect(screen.getByText('OR-1')).toBeInTheDocument();
      expect(screen.getByText('jsmith')).toBeInTheDocument();
    });
  });

  describe('Page Title', () => {
    it('should set page title on mount', async () => {
      render(<Assembly setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(mockSetPageTitle).toHaveBeenCalledWith('Assembly');
      });
    });
  });
});
