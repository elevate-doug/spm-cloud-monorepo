import { http, HttpResponse } from 'msw';

// Mock data
export const mockTenants = [
  { id: 'tenant-1', name: 'hospital1', displayName: 'General Hospital' },
  { id: 'tenant-2', name: 'hospital2', displayName: 'City Medical Center' },
  { id: 'tenant-3', name: 'hospital3', displayName: 'Regional Health System' },
];

export const mockBuilds = [
  {
    id: 'build-1',
    instrumentSetJourneyId: null,
    items: [],
    name: 'Cardiac Surgery Set',
    buildDate: '2026-02-09T10:00:00Z',
    barcode: 'SET-001',
    user: 'jsmith',
    location: 'OR-1',
    status: 0,
    currentStage: 0,
  },
  {
    id: 'build-2',
    instrumentSetJourneyId: null,
    items: [],
    name: 'Orthopedic Set',
    buildDate: '2026-02-08T14:30:00Z',
    barcode: 'SET-002',
    user: 'mjones',
    location: 'OR-2',
    status: 2,
    currentStage: 1,
  },
  {
    id: 'build-3',
    instrumentSetJourneyId: null,
    items: [],
    name: 'Neurosurgery Set',
    buildDate: '2026-02-07T09:15:00Z',
    barcode: 'SET-003',
    user: 'asmith',
    location: 'OR-3',
    status: 1,
    currentStage: 0,
  },
];

export const mockBuildDetails = {
  id: 'build-1',
  instrumentSetJourneyId: null,
  name: 'Cardiac Surgery Set',
  buildDate: '2026-02-09T10:00:00Z',
  barcode: 'SET-001',
  user: 'jsmith',
  location: 'OR-1',
  status: 0,
  currentStage: 0,
  items: [
    {
      instrumentId: 'inst-1',
      instrumentName: 'Scalpel #10',
      manufacturer: 'Medline',
      barcode: 'SCAL-10',
      expectedQuantity: 2,
      includedQuantity: 0,
      missingQuantity: 0,
      groupName: 'Cutting',
    },
    {
      instrumentId: 'inst-2',
      instrumentName: 'Forceps Curved',
      manufacturer: 'Storz',
      barcode: 'FORC-C1',
      expectedQuantity: 4,
      includedQuantity: 0,
      missingQuantity: 0,
      groupName: 'Grasping',
    },
    {
      instrumentId: 'inst-3',
      instrumentName: 'Hemostatic Clamp',
      manufacturer: 'Aesculap',
      barcode: 'HEMO-01',
      expectedQuantity: 3,
      includedQuantity: 0,
      missingQuantity: 0,
      groupName: 'Clamping',
    },
  ],
};

export const mockLoginToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNyIsInVuaXF1ZV9uYW1lIjoidGVzdHVzZXIiLCJuYW1lIjoiVGVzdCBVc2VyIiwidGVuYW50SWQiOiJ0ZW5hbnQtMSIsInRlbmFudCI6IkdlbmVyYWwgSG9zcGl0YWwiLCJsb2NhdGlvbklkIjoiMSIsImxvY2F0aW9uIjoiT1ItMSIsInNoaWZ0SWQiOiIxIiwic2hpZnQiOiJEYXkiLCJhc3NpZ25tZW50SWQiOiIxIiwiYXNzaWdubWVudCI6IkFzc2VtYmx5IiwiZXhwIjo5OTk5OTk5OTk5fQ.mock-signature';

// Default handlers
export const handlers = [
  // Tenants
  http.get('/api/tenants', () => {
    return HttpResponse.json(mockTenants);
  }),

  // Login
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { userName: string; password: string };
    if (body.userName === 'testuser' && body.password === 'testpassword') {
      return HttpResponse.json({
        access_token: mockLoginToken,
        expires_in: 3600,
      });
    }
    return new HttpResponse(null, { status: 401 });
  }),

  // Get all builds
  http.get('/api/instrumentsetbuilds', ({ request }) => {
    const url = new URL(request.url);
    const barcode = url.searchParams.get('barcode');
    const count = url.searchParams.get('count');

    if (barcode) {
      const filtered = mockBuilds.filter((b) => b.barcode === barcode);
      if (count === '1') {
        return HttpResponse.json(filtered.slice(0, 1));
      }
      return HttpResponse.json(filtered);
    }

    return HttpResponse.json(mockBuilds);
  }),

  // Get single build
  http.get('/api/instrumentsetbuilds/:buildId', ({ params }) => {
    const { buildId } = params;
    if (buildId === 'build-1') {
      return HttpResponse.json(mockBuildDetails);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // Start new build
  http.post('/api/instrumentsetbuilds/start', () => {
    return HttpResponse.json({
      id: 'build-new',
      barcode: 'SET-NEW',
      name: 'New Surgery Set',
      status: 0,
    });
  }),

  // Get instrument sets
  http.get('/api/instrumentsets', ({ request }) => {
    const url = new URL(request.url);
    const barcode = url.searchParams.get('barcode');

    if (barcode === 'SET-001') {
      return HttpResponse.json([{ id: 'set-1', name: 'Cardiac Surgery Set', barcode: 'SET-001' }]);
    }
    if (barcode === 'UNKNOWN') {
      return HttpResponse.json([]);
    }
    return HttpResponse.json([{ id: 'set-1', name: 'Test Set', barcode }]);
  }),

  // Update included quantity
  http.put('/api/instrumentsetbuilds/:buildId/items/:instrumentId/included-quantity', () => {
    return HttpResponse.json(mockBuildDetails);
  }),

  // Update missing quantity
  http.put('/api/instrumentsetbuilds/:buildId/items/:instrumentId/missing-quantity', () => {
    return HttpResponse.json(mockBuildDetails);
  }),

  // Pause build
  http.post('/api/instrumentsetbuilds/:buildId/pause', () => {
    return new HttpResponse(null, { status: 200 });
  }),

  // Resume build
  http.post('/api/instrumentsetbuilds/:buildId/resume', () => {
    return new HttpResponse(null, { status: 200 });
  }),

  // Complete build
  http.post('/api/instrumentsetbuilds/:buildId/complete', () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
