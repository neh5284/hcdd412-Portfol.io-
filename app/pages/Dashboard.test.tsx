import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Dashboard } from './Dashboard';
import { testPortfolio } from '../test/fixtures';

vi.mock('../services/authApi', () => ({
    getSession: vi.fn().mockResolvedValue({ user: { id: 'user-1' } }),
}));

vi.mock('../services/portfolioApi', () => ({
    getCurrentPortfolio: vi.fn(),
    saveProject: vi.fn(),
    deleteProject: vi.fn(),
    regenerateShareLink: vi.fn(),
}));

import { getCurrentPortfolio } from '../services/portfolioApi';

const mockedGetCurrentPortfolio = vi.mocked(getCurrentPortfolio);

describe('Dashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockedGetCurrentPortfolio.mockResolvedValue(testPortfolio);
    });

    it('loads profile and project data from the API layer', async () => {
        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>,
        );

        expect(screen.getByText(/Loading dashboard/i)).toBeInTheDocument();
        expect(await screen.findByRole('heading', { name: testPortfolio.displayName })).toBeInTheDocument();
        expect(screen.getByText('Your Projects (2)')).toBeInTheDocument();
        expect(screen.getByText('Alpha Project')).toBeInTheDocument();
        expect(screen.getByText('Beta Design')).toBeInTheDocument();
    });

    it('shows an error state when API data cannot be loaded', async () => {
        mockedGetCurrentPortfolio.mockRejectedValueOnce(new Error('Supabase unavailable'));

        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>,
        );

        await waitFor(() => {
            expect(screen.getByText('Dashboard unavailable')).toBeInTheDocument();
        });

        expect(screen.getByText('Supabase unavailable')).toBeInTheDocument();
    });
});