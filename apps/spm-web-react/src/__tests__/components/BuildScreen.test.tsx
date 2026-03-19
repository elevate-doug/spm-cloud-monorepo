import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { mockBuildDetails } from '../mocks/handlers';
import { render } from '../test-utils';
import BuildScreen from '../../views/admin/build-screen';

// Mock useNavigate and useParams
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: 'build-1' }),
}));

// Mock setPageTitle prop
const mockSetPageTitle = jest.fn();

describe('BuildScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Build Details Loading', () => {
    it('should fetch and display build details', async () => {
      render(<BuildScreen setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByText('Scalpel #10')).toBeInTheDocument();
      });

      expect(screen.getByText('Forceps Curved')).toBeInTheDocument();
      expect(screen.getByText('Hemostatic Clamp')).toBeInTheDocument();
    });

    it('should show loading state while fetching build', async () => {
      server.use(
        http.get('/api/instrumentsetbuilds/:buildId', async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return HttpResponse.json(mockBuildDetails);
        })
      );

      render(<BuildScreen setPageTitle={mockSetPageTitle} />);

      expect(screen.getByText(/loading scan/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText(/loading scan/i)).not.toBeInTheDocument();
      });
    });

    it('should call resume endpoint for non-completed builds', async () => {
      let resumeCalled = false;

      server.use(
        http.post('/api/instrumentsetbuilds/:buildId/resume', () => {
          resumeCalled = true;
          return new HttpResponse(null, { status: 200 });
        })
      );

      render(<BuildScreen setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(resumeCalled).toBe(true);
      });
    });

    it('should group instruments by group name', async () => {
      render(<BuildScreen setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByText('Cutting')).toBeInTheDocument();
      });

      expect(screen.getByText('Grasping')).toBeInTheDocument();
      expect(screen.getByText('Clamping')).toBeInTheDocument();
    });
  });

  describe('Quantity Updates - Increment', () => {
    it('should increment included quantity when + button clicked', async () => {
      const user = userEvent.setup();
      let capturedRequest: number | null = null;

      server.use(
        http.put('/api/instrumentsetbuilds/:buildId/items/:instrumentId/included-quantity', async ({ request }) => {
          capturedRequest = await request.json() as number;
          return HttpResponse.json(mockBuildDetails);
        })
      );

      render(<BuildScreen setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByText('Scalpel #10')).toBeInTheDocument();
      });

      // Find and click the increment button for included quantity
      const incrementButtons = screen.getAllByLabelText(/increment included/i);
      await user.click(incrementButtons[0]);

      await waitFor(() => {
        expect(capturedRequest).toBe(1);
      });
    });

    it('should show success toast after increment', async () => {
      const user = userEvent.setup();

      render(<BuildScreen setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByText('Scalpel #10')).toBeInTheDocument();
      });

      const incrementButtons = screen.getAllByLabelText(/increment included/i);
      await user.click(incrementButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/set scalpel/i)).toBeInTheDocument();
      });
    });

    it('should increment missing quantity when + button clicked', async () => {
      const user = userEvent.setup();
      let capturedRequest: number | null = null;

      server.use(
        http.put('/api/instrumentsetbuilds/:buildId/items/:instrumentId/missing-quantity', async ({ request }) => {
          capturedRequest = await request.json() as number;
          return HttpResponse.json(mockBuildDetails);
        })
      );

      render(<BuildScreen setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByText('Scalpel #10')).toBeInTheDocument();
      });

      const incrementMissingButtons = screen.getAllByLabelText(/increment missing/i);
      await user.click(incrementMissingButtons[0]);

      await waitFor(() => {
        expect(capturedRequest).toBe(1);
      });
    });
  });

  describe('Barcode Scanning', () => {
    it('should increment included when valid instrument barcode scanned', async () => {
      const user = userEvent.setup();
      let capturedRequest: number | null = null;

      server.use(
        http.put('/api/instrumentsetbuilds/:buildId/items/:instrumentId/included-quantity', async ({ request }) => {
          capturedRequest = await request.json() as number;
          return HttpResponse.json(mockBuildDetails);
        })
      );

      render(<BuildScreen setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/scan or enter product number/i)).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/scan or enter product number/i);
      await user.type(input, 'SCAL-10{enter}');

      await waitFor(() => {
        expect(capturedRequest).toBe(1);
      });
    });

    it('should show error for unknown instrument barcode', async () => {
      const user = userEvent.setup();

      render(<BuildScreen setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/scan or enter product number/i)).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/scan or enter product number/i);
      await user.type(input, 'UNKNOWN-BARCODE{enter}');

      await waitFor(() => {
        expect(screen.getByText(/instrument not found/i)).toBeInTheDocument();
      });
    });
  });

  describe('Pause Build', () => {
    it('should call pause API and navigate to assembly', async () => {
      const user = userEvent.setup();
      let pauseCalled = false;

      server.use(
        http.post('/api/instrumentsetbuilds/:buildId/pause', () => {
          pauseCalled = true;
          return new HttpResponse(null, { status: 200 });
        })
      );

      render(<BuildScreen setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /pause/i }));

      await waitFor(() => {
        expect(pauseCalled).toBe(true);
        expect(mockNavigate).toHaveBeenCalledWith('/admin/assembly');
      });
    });
  });

  describe('Complete Build', () => {
    it('should disable Complete button when items are incomplete', async () => {
      render(<BuildScreen setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /complete/i })).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /complete/i })).toBeDisabled();
    });

    it('should enable Complete button when all items are accounted for', async () => {
      const completeBuildDetails = {
        ...mockBuildDetails,
        items: [
          {
            ...mockBuildDetails.items[0],
            includedQuantity: 2, // Matches expectedQuantity
          },
          {
            ...mockBuildDetails.items[1],
            includedQuantity: 4,
          },
          {
            ...mockBuildDetails.items[2],
            includedQuantity: 3,
          },
        ],
      };

      server.use(
        http.get('/api/instrumentsetbuilds/:buildId', () => {
          return HttpResponse.json(completeBuildDetails);
        })
      );

      render(<BuildScreen setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /complete/i })).not.toBeDisabled();
      });
    });

    it('should call complete API and navigate to assembly', async () => {
      const user = userEvent.setup();
      let completeCalled = false;

      const completeBuildDetails = {
        ...mockBuildDetails,
        items: [
          {
            ...mockBuildDetails.items[0],
            includedQuantity: 2,
          },
          {
            ...mockBuildDetails.items[1],
            includedQuantity: 4,
          },
          {
            ...mockBuildDetails.items[2],
            includedQuantity: 3,
          },
        ],
      };

      server.use(
        http.get('/api/instrumentsetbuilds/:buildId', () => {
          return HttpResponse.json(completeBuildDetails);
        }),
        http.post('/api/instrumentsetbuilds/:buildId/complete', () => {
          completeCalled = true;
          return new HttpResponse(null, { status: 200 });
        })
      );

      render(<BuildScreen setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /complete/i })).not.toBeDisabled();
      });

      await user.click(screen.getByRole('button', { name: /complete/i }));

      await waitFor(() => {
        expect(completeCalled).toBe(true);
        expect(mockNavigate).toHaveBeenCalledWith('/admin/assembly');
      });
    });
  });

  describe('Completed Build View', () => {
    it('should show Exit button for completed build', async () => {
      const completedBuild = {
        ...mockBuildDetails,
        status: 2, // Completed
      };

      server.use(
        http.get('/api/instrumentsetbuilds/:buildId', () => {
          return HttpResponse.json(completedBuild);
        })
      );

      render(<BuildScreen setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /exit/i })).toBeInTheDocument();
      });

      expect(screen.queryByRole('button', { name: /pause/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /complete/i })).not.toBeInTheDocument();
    });

    it('should hide increment/decrement buttons for completed build', async () => {
      const completedBuild = {
        ...mockBuildDetails,
        status: 2, // Completed
      };

      server.use(
        http.get('/api/instrumentsetbuilds/:buildId', () => {
          return HttpResponse.json(completedBuild);
        })
      );

      render(<BuildScreen setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /exit/i })).toBeInTheDocument();
      });

      expect(screen.queryByLabelText(/increment included/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/decrement included/i)).not.toBeInTheDocument();
    });
  });

  describe('Table Display', () => {
    it('should display correct column headers', async () => {
      render(<BuildScreen setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByText('Manufacturer')).toBeInTheDocument();
      });

      expect(screen.getByText('Product #1')).toBeInTheDocument();
      expect(screen.getByText('Instrument / comment')).toBeInTheDocument();
      expect(screen.getByText('Required')).toBeInTheDocument();
      expect(screen.getByText('Included')).toBeInTheDocument();
      expect(screen.getByText('Missing')).toBeInTheDocument();
    });

    it('should display instrument details correctly', async () => {
      render(<BuildScreen setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByText('Medline')).toBeInTheDocument();
      });

      expect(screen.getByText('SCAL-10')).toBeInTheDocument();
      expect(screen.getByText('Scalpel #10')).toBeInTheDocument();
    });
  });

  describe('Assembly Comments', () => {
    it('should render assembly comments textarea', async () => {
      render(<BuildScreen setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByLabelText(/assembly/i)).toBeInTheDocument();
      });
    });

    it('should allow entering comments', async () => {
      const user = userEvent.setup();

      render(<BuildScreen setPageTitle={mockSetPageTitle} />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/enter assembly comments/i)).toBeInTheDocument();
      });

      const textarea = screen.getByPlaceholderText(/enter assembly comments/i);
      await user.type(textarea, 'Test comment');

      expect(textarea).toHaveValue('Test comment');
    });
  });
});
