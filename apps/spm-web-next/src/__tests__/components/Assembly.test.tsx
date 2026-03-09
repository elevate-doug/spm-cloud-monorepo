import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, mockPush } from '../test-utils';
import AssemblyClient from '@/app/assembly/assembly-client';

// Mock the server actions
vi.mock('@/lib/actions/builds', () => ({
  getLatestBuildForBarcode: vi.fn(),
  getInstrumentSetByBarcode: vi.fn(),
  startNewBuild: vi.fn(),
}));

import {
  getLatestBuildForBarcode,
  getInstrumentSetByBarcode,
  startNewBuild,
} from '@/lib/actions/builds';

const mockGetLatestBuildForBarcode = vi.mocked(getLatestBuildForBarcode);
const mockGetInstrumentSetByBarcode = vi.mocked(getInstrumentSetByBarcode);
const mockStartNewBuild = vi.mocked(startNewBuild);

// Test data
const mockIncompleteBuilds = [
  {
    id: 'build-1',
    barcode: 'SET-001',
    name: 'Cardiac Surgery Set',
    buildDate: '2024-01-15T10:00:00Z',
    location: 'OR-1',
    user: 'jsmith',
    status: 0,
    currentStage: 0,
    items: [],
  },
];

const mockCompletedBuilds = [
  {
    id: 'build-2',
    barcode: 'SET-002',
    name: 'Orthopedic Set',
    buildDate: '2024-01-14T10:00:00Z',
    location: 'OR-2',
    user: 'mjones',
    status: 2,
    currentStage: 1,
    items: [],
  },
];

describe('Assembly Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Builds List Display', () => {
    it('should display provided builds', async () => {
      render(
        <AssemblyClient
          completedBuilds={mockCompletedBuilds}
          incompleteBuilds={mockIncompleteBuilds}
        />
      );

      expect(screen.getByText('SET-001')).toBeInTheDocument();
      expect(screen.getByText('SET-002')).toBeInTheDocument();
    });

    it('should separate builds by status correctly', async () => {
      render(
        <AssemblyClient
          completedBuilds={mockCompletedBuilds}
          incompleteBuilds={mockIncompleteBuilds}
        />
      );

      expect(screen.getByText('Currently Incomplete Builds')).toBeInTheDocument();
      expect(screen.getByText('Recent Builds')).toBeInTheDocument();
    });

    it('should show empty state when no builds exist', async () => {
      render(<AssemblyClient completedBuilds={[]} incompleteBuilds={[]} />);

      expect(screen.getByText(/no paused items found/i)).toBeInTheDocument();
      expect(screen.getByText(/no recent scans found/i)).toBeInTheDocument();
    });
  });

  describe('Barcode Input', () => {
    it('should render barcode input field', async () => {
      render(
        <AssemblyClient
          completedBuilds={mockCompletedBuilds}
          incompleteBuilds={mockIncompleteBuilds}
        />
      );

      expect(screen.getByPlaceholderText(/enter barcode or scan product/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('should allow entering barcode manually', async () => {
      const user = userEvent.setup();
      render(
        <AssemblyClient
          completedBuilds={mockCompletedBuilds}
          incompleteBuilds={mockIncompleteBuilds}
        />
      );

      const input = screen.getByPlaceholderText(/enter barcode or scan product/i);
      await user.type(input, 'TEST-BARCODE-123');

      expect(input).toHaveValue('TEST-BARCODE-123');
    });

    it('should show error toast for empty barcode submission', async () => {
      const user = userEvent.setup();
      render(
        <AssemblyClient
          completedBuilds={mockCompletedBuilds}
          incompleteBuilds={mockIncompleteBuilds}
        />
      );

      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/please enter a barcode/i)).toBeInTheDocument();
      });
    });
  });

  describe('Barcode Lookup - Existing Build', () => {
    it('should navigate to existing incomplete build when barcode submitted', async () => {
      const user = userEvent.setup();

      mockGetLatestBuildForBarcode.mockResolvedValueOnce({
        id: 'build-1',
        barcode: 'SET-001',
        status: 0,
        name: 'Test Set',
        buildDate: new Date(),
        location: 'OR-1',
        user: 'test',
        currentStage: 0,
        items: [],
      });

      render(
        <AssemblyClient
          completedBuilds={mockCompletedBuilds}
          incompleteBuilds={mockIncompleteBuilds}
        />
      );

      const input = screen.getByPlaceholderText(/enter barcode or scan product/i);
      await user.type(input, 'SET-001');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/build-screen/build-1');
      });
    });
  });

  describe('Barcode Lookup - Create New Build', () => {
    it('should create new build for completed barcode', async () => {
      const user = userEvent.setup();

      // First call returns completed build
      mockGetLatestBuildForBarcode.mockResolvedValueOnce({
        id: 'build-2',
        barcode: 'SET-002',
        status: 2, // Completed
        name: 'Test Set',
        buildDate: new Date(),
        location: 'OR-1',
        user: 'test',
        currentStage: 1,
        items: [],
      });

      mockGetInstrumentSetByBarcode.mockResolvedValueOnce({
        id: 'set-2',
        name: 'Orthopedic Set',
        barcode: 'SET-002',
      });

      mockStartNewBuild.mockResolvedValueOnce({
        id: 'build-new',
        barcode: 'SET-002',
        status: 0,
        name: 'Orthopedic Set',
        buildDate: new Date(),
        location: 'OR-1',
        user: 'test',
        currentStage: 0,
        items: [],
      });

      render(
        <AssemblyClient
          completedBuilds={mockCompletedBuilds}
          incompleteBuilds={mockIncompleteBuilds}
        />
      );

      const input = screen.getByPlaceholderText(/enter barcode or scan product/i);
      await user.type(input, 'SET-002');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/build-screen/build-new');
      });
    });

    it('should show warning for unknown barcode with no instrument set', async () => {
      const user = userEvent.setup();

      mockGetLatestBuildForBarcode.mockResolvedValueOnce(null);
      mockGetInstrumentSetByBarcode.mockResolvedValueOnce(null);

      render(
        <AssemblyClient
          completedBuilds={mockCompletedBuilds}
          incompleteBuilds={mockIncompleteBuilds}
        />
      );

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
      render(
        <AssemblyClient
          completedBuilds={mockCompletedBuilds}
          incompleteBuilds={mockIncompleteBuilds}
        />
      );

      expect(screen.getAllByText('BARCODE')[0]).toBeInTheDocument();
      expect(screen.getAllByText('DESCRIPTION')[0]).toBeInTheDocument();
      expect(screen.getAllByText('LOCATION')[0]).toBeInTheDocument();
    });

    it('should display build data correctly', async () => {
      render(
        <AssemblyClient
          completedBuilds={mockCompletedBuilds}
          incompleteBuilds={mockIncompleteBuilds}
        />
      );

      expect(screen.getByText('SET-001')).toBeInTheDocument();
      expect(screen.getByText('Cardiac Surgery Set')).toBeInTheDocument();
      expect(screen.getByText('OR-1')).toBeInTheDocument();
      expect(screen.getByText('jsmith')).toBeInTheDocument();
    });
  });

  describe('Row Click Navigation', () => {
    it('should navigate to build screen when row is clicked', async () => {
      const user = userEvent.setup();

      render(
        <AssemblyClient
          completedBuilds={mockCompletedBuilds}
          incompleteBuilds={mockIncompleteBuilds}
        />
      );

      // Click on the build row
      await user.click(screen.getByText('SET-001'));

      expect(mockPush).toHaveBeenCalledWith('/build-screen/build-1');
    });
  });
});
