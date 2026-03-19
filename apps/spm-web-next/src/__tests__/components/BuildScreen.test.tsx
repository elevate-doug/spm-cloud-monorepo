import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, mockPush } from '../test-utils';
import BuildScreenClient from '@/app/build-screen/[id]/build-screen-client';

// Mock the server actions
jest.mock('@/lib/actions/builds', () => ({
  updateIncludedQuantity: jest.fn(),
  updateMissingQuantity: jest.fn(),
  pauseBuild: jest.fn(),
  completeBuild: jest.fn(),
}));

import {
  updateIncludedQuantity,
  updateMissingQuantity,
  pauseBuild,
  completeBuild,
} from '@/lib/actions/builds';

const mockUpdateIncludedQuantity = jest.mocked(updateIncludedQuantity);
const mockUpdateMissingQuantity = jest.mocked(updateMissingQuantity);
const mockPauseBuild = jest.mocked(pauseBuild);
const mockCompleteBuild = jest.mocked(completeBuild);

// Test data
const mockBuildDetails = {
  id: 'build-1',
  barcode: 'SET-001',
  name: 'Cardiac Surgery Set',
  status: 0, // In progress
  currentStage: 0,
  buildDate: new Date(),
  location: 'OR-1',
  user: 'jsmith',
  items: [
    {
      instrumentId: 'inst-1',
      instrumentName: 'Scalpel #10',
      barcode: 'SCAL-10',
      manufacturer: 'Medline',
      groupName: 'Cutting',
      expectedQuantity: 2,
      includedQuantity: 0,
      missingQuantity: 0,
    },
    {
      instrumentId: 'inst-2',
      instrumentName: 'Forceps Curved',
      barcode: 'FORC-C',
      manufacturer: 'Cardinal',
      groupName: 'Grasping',
      expectedQuantity: 4,
      includedQuantity: 0,
      missingQuantity: 0,
    },
    {
      instrumentId: 'inst-3',
      instrumentName: 'Hemostatic Clamp',
      barcode: 'HEMO-1',
      manufacturer: 'B. Braun',
      groupName: 'Clamping',
      expectedQuantity: 3,
      includedQuantity: 0,
      missingQuantity: 0,
    },
  ],
};

describe('BuildScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Build Details Display', () => {
    it('should display build details', async () => {
      render(<BuildScreenClient build={mockBuildDetails} />);

      expect(screen.getByText('Scalpel #10')).toBeInTheDocument();
      expect(screen.getByText('Forceps Curved')).toBeInTheDocument();
      expect(screen.getByText('Hemostatic Clamp')).toBeInTheDocument();
    });

    it('should group instruments by group name', async () => {
      render(<BuildScreenClient build={mockBuildDetails} />);

      expect(screen.getByText('Cutting')).toBeInTheDocument();
      expect(screen.getByText('Grasping')).toBeInTheDocument();
      expect(screen.getByText('Clamping')).toBeInTheDocument();
    });
  });

  describe('Quantity Updates - Increment', () => {
    it('should increment included quantity when + button clicked', async () => {
      const user = userEvent.setup();

      const updatedBuild = {
        ...mockBuildDetails,
        items: [
          { ...mockBuildDetails.items[0], includedQuantity: 1 },
          ...mockBuildDetails.items.slice(1),
        ],
      };
      mockUpdateIncludedQuantity.mockResolvedValueOnce(updatedBuild);

      render(<BuildScreenClient build={mockBuildDetails} />);

      // Find and click the increment button for included quantity
      const incrementButtons = screen.getAllByLabelText(/increment included/i);
      await user.click(incrementButtons[0]);

      await waitFor(() => {
        expect(mockUpdateIncludedQuantity).toHaveBeenCalledWith('build-1', 'inst-1', 1);
      });
    });

    it('should show success toast after increment', async () => {
      const user = userEvent.setup();

      const updatedBuild = {
        ...mockBuildDetails,
        items: [
          { ...mockBuildDetails.items[0], includedQuantity: 1 },
          ...mockBuildDetails.items.slice(1),
        ],
      };
      mockUpdateIncludedQuantity.mockResolvedValueOnce(updatedBuild);

      render(<BuildScreenClient build={mockBuildDetails} />);

      const incrementButtons = screen.getAllByLabelText(/increment included/i);
      await user.click(incrementButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/set scalpel/i)).toBeInTheDocument();
      });
    });

    it('should increment missing quantity when + button clicked', async () => {
      const user = userEvent.setup();

      const updatedBuild = {
        ...mockBuildDetails,
        items: [
          { ...mockBuildDetails.items[0], missingQuantity: 1 },
          ...mockBuildDetails.items.slice(1),
        ],
      };
      mockUpdateMissingQuantity.mockResolvedValueOnce(updatedBuild);

      render(<BuildScreenClient build={mockBuildDetails} />);

      const incrementMissingButtons = screen.getAllByLabelText(/increment missing/i);
      await user.click(incrementMissingButtons[0]);

      await waitFor(() => {
        expect(mockUpdateMissingQuantity).toHaveBeenCalledWith('build-1', 'inst-1', 1);
      });
    });
  });

  describe('Barcode Scanning', () => {
    it('should increment included when valid instrument barcode entered', async () => {
      const user = userEvent.setup();

      const updatedBuild = {
        ...mockBuildDetails,
        items: [
          { ...mockBuildDetails.items[0], includedQuantity: 1 },
          ...mockBuildDetails.items.slice(1),
        ],
      };
      mockUpdateIncludedQuantity.mockResolvedValueOnce(updatedBuild);

      render(<BuildScreenClient build={mockBuildDetails} />);

      const input = screen.getByPlaceholderText(/scan or enter product number/i);
      await user.type(input, 'SCAL-10');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(mockUpdateIncludedQuantity).toHaveBeenCalledWith('build-1', 'inst-1', 1);
      });
    });

    it('should show error for unknown instrument barcode', async () => {
      const user = userEvent.setup();

      render(<BuildScreenClient build={mockBuildDetails} />);

      const input = screen.getByPlaceholderText(/scan or enter product number/i);
      await user.type(input, 'UNKNOWN-BARCODE');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/instrument not found/i)).toBeInTheDocument();
      });
    });
  });

  describe('Pause Build', () => {
    it('should call pause API and navigate to assembly', async () => {
      const user = userEvent.setup();
      mockPauseBuild.mockResolvedValueOnce(undefined);

      render(<BuildScreenClient build={mockBuildDetails} />);

      await user.click(screen.getByRole('button', { name: /pause/i }));

      await waitFor(() => {
        expect(mockPauseBuild).toHaveBeenCalledWith('build-1');
        expect(mockPush).toHaveBeenCalledWith('/assembly');
      });
    });
  });

  describe('Complete Build', () => {
    it('should disable Complete button when items are incomplete', async () => {
      render(<BuildScreenClient build={mockBuildDetails} />);

      expect(screen.getByRole('button', { name: /complete/i })).toBeDisabled();
    });

    it('should enable Complete button when all items are accounted for', async () => {
      const completeBuildDetails = {
        ...mockBuildDetails,
        items: [
          { ...mockBuildDetails.items[0], includedQuantity: 2 },
          { ...mockBuildDetails.items[1], includedQuantity: 4 },
          { ...mockBuildDetails.items[2], includedQuantity: 3 },
        ],
      };

      render(<BuildScreenClient build={completeBuildDetails} />);

      expect(screen.getByRole('button', { name: /complete/i })).not.toBeDisabled();
    });

    it('should call complete API and navigate to assembly', async () => {
      const user = userEvent.setup();
      mockCompleteBuild.mockResolvedValueOnce(undefined);

      const completeBuildDetails = {
        ...mockBuildDetails,
        items: [
          { ...mockBuildDetails.items[0], includedQuantity: 2 },
          { ...mockBuildDetails.items[1], includedQuantity: 4 },
          { ...mockBuildDetails.items[2], includedQuantity: 3 },
        ],
      };

      render(<BuildScreenClient build={completeBuildDetails} />);

      await user.click(screen.getByRole('button', { name: /complete/i }));

      await waitFor(() => {
        expect(mockCompleteBuild).toHaveBeenCalledWith('build-1');
        expect(mockPush).toHaveBeenCalledWith('/assembly');
      });
    });
  });

  describe('Completed Build View', () => {
    it('should show Exit button for completed build', async () => {
      const completedBuild = {
        ...mockBuildDetails,
        status: 2, // Completed
      };

      render(<BuildScreenClient build={completedBuild} />);

      expect(screen.getByRole('button', { name: /exit/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /pause/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /complete/i })).not.toBeInTheDocument();
    });

    it('should hide increment/decrement buttons for completed build', async () => {
      const completedBuild = {
        ...mockBuildDetails,
        status: 2, // Completed
      };

      render(<BuildScreenClient build={completedBuild} />);

      expect(screen.queryByLabelText(/increment included/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/decrement included/i)).not.toBeInTheDocument();
    });

    it('should navigate to assembly when Exit is clicked', async () => {
      const user = userEvent.setup();
      const completedBuild = {
        ...mockBuildDetails,
        status: 2,
      };

      render(<BuildScreenClient build={completedBuild} />);

      await user.click(screen.getByRole('button', { name: /exit/i }));

      expect(mockPush).toHaveBeenCalledWith('/assembly');
    });
  });

  describe('Table Display', () => {
    it('should display correct column headers', async () => {
      render(<BuildScreenClient build={mockBuildDetails} />);

      expect(screen.getByText('MANUFACTURER')).toBeInTheDocument();
      expect(screen.getByText('PRODUCT #')).toBeInTheDocument();
      expect(screen.getByText('INSTRUMENT')).toBeInTheDocument();
      expect(screen.getByText('REQUIRED')).toBeInTheDocument();
      expect(screen.getByText('INCLUDED')).toBeInTheDocument();
      expect(screen.getByText('MISSING')).toBeInTheDocument();
    });

    it('should display instrument details correctly', async () => {
      render(<BuildScreenClient build={mockBuildDetails} />);

      expect(screen.getByText('Medline')).toBeInTheDocument();
      expect(screen.getByText('SCAL-10')).toBeInTheDocument();
      expect(screen.getByText('Scalpel #10')).toBeInTheDocument();
    });
  });

  describe('Assembly Comments', () => {
    it('should render assembly comments textarea', async () => {
      render(<BuildScreenClient build={mockBuildDetails} />);

      expect(screen.getByLabelText(/assembly/i)).toBeInTheDocument();
    });

    it('should allow entering comments', async () => {
      const user = userEvent.setup();

      render(<BuildScreenClient build={mockBuildDetails} />);

      const textarea = screen.getByPlaceholderText(/enter assembly comments/i);
      await user.type(textarea, 'Test comment');

      expect(textarea).toHaveValue('Test comment');
    });
  });
});
