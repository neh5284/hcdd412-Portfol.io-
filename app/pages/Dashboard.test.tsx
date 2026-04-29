import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Dashboard } from './Dashboard';
import { testPortfolio } from '../test/fixtures';

vi.mock('../services/portfolioApi', () => ({
    getCurrentPortfolio: vi.fn(),
    saveProject: vi.fn(),
    deleteProject: vi.fn(),
    regenerateShareLink: vi.fn(),
}));

import {
    deleteProject,
    getCurrentPortfolio,
    regenerateShareLink,
    saveProject,
} from '../services/portfolioApi';

const mockedGetCurrentPortfolio = vi.mocked(getCurrentPortfolio);
const mockedSaveProject = vi.mocked(saveProject);
const mockedDeleteProject = vi.mocked(deleteProject);
const mockedRegenerateShareLink = vi.mocked(regenerateShareLink);

describe('Dashboard major features', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockedGetCurrentPortfolio.mockResolvedValue(testPortfolio);
        mockedSaveProject.mockResolvedValue(undefined);
        mockedDeleteProject.mockResolvedValue(undefined);
        mockedRegenerateShareLink.mockResolvedValue({ share_token: 'new-token' } as never);
        vi.spyOn(window, 'confirm').mockReturnValue(true);
    });

    it('loads fetched portfolio data, stats, and projects', async () => {
        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>,
        );

        expect(await screen.findByRole('heading', { name: testPortfolio.displayName })).toBeInTheDocument();

        expect(screen.getByText('Building the future, one project at a time.')).toBeInTheDocument();
        expect(screen.getByText(/Your Projects/i)).toBeInTheDocument();

        expect(screen.getByText('Alpha Project')).toBeInTheDocument();
        expect(screen.getByText('Beta Design')).toBeInTheDocument();
        expect(screen.getByText('Private Research Draft')).toBeInTheDocument();

        expect(screen.getByText(/Projects:/i)).toBeInTheDocument();
        expect(screen.getByText(/Verified:/i)).toBeInTheDocument();
    });

    it('opens the add project form', async () => {
        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>,
        );

        await screen.findByText('Alpha Project');
        await userEvent.click(screen.getByRole('button', { name: 'Add Project' }));

        expect(screen.getByRole('heading', { name: 'Add Project' })).toBeInTheDocument();
        expect(screen.getByLabelText('Project Title *')).toBeInTheDocument();
        expect(screen.getByLabelText('Short Description *')).toBeInTheDocument();
    });

    it('regenerates the share link', async () => {
        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>,
        );

        await screen.findByText('Alpha Project');
        await userEvent.click(screen.getByRole('button', { name: 'Regenerate' }));

        expect(mockedRegenerateShareLink).toHaveBeenCalledWith(testPortfolio.id);
    });

    it('deletes a project after confirmation', async () => {
        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>,
        );

        await screen.findByText('Private Research Draft');

        const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
        await userEvent.click(deleteButtons[0]);

        expect(window.confirm).toHaveBeenCalled();
        expect(mockedDeleteProject).toHaveBeenCalled();
    });

    it('shows an error state when fetched data cannot load', async () => {
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