import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PublicPortfolio } from './PublicPortfolio';
import { testPortfolio } from '../test/fixtures';

vi.mock('../services/portfolioApi', () => ({
    getPortfolioByUsername: vi.fn(),
    getPortfolioByShareToken: vi.fn(),
}));

import { getPortfolioByShareToken, getPortfolioByUsername } from '../services/portfolioApi';

const mockedGetPortfolioByUsername = vi.mocked(getPortfolioByUsername);
const mockedGetPortfolioByShareToken = vi.mocked(getPortfolioByShareToken);

describe('PublicPortfolio major features', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockedGetPortfolioByUsername.mockResolvedValue(testPortfolio);
        mockedGetPortfolioByShareToken.mockResolvedValue(testPortfolio);
    });

    it('loads public portfolio by username and hides private projects', async () => {
        render(
            <MemoryRouter initialEntries={[`/portfolio/${testPortfolio.username}`]}>
                <Routes>
                    <Route path="/portfolio/:username" element={<PublicPortfolio />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(await screen.findByRole('heading', { name: testPortfolio.displayName })).toBeInTheDocument();
        expect(mockedGetPortfolioByUsername).toHaveBeenCalledWith(testPortfolio.username);
        expect(screen.getByText('Projects')).toBeInTheDocument();
        expect(screen.getByText('Alpha Project')).toBeInTheDocument();
        expect(screen.getByText('Beta Design')).toBeInTheDocument();
        expect(screen.queryByText('Private Research Draft')).not.toBeInTheDocument();
    });

    it('loads public portfolio by share token', async () => {
        render(
            <MemoryRouter initialEntries={['/share/share-token-1']}>
                <Routes>
                    <Route path="/share/:token" element={<PublicPortfolio />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(await screen.findByRole('heading', { name: testPortfolio.displayName })).toBeInTheDocument();
        expect(mockedGetPortfolioByShareToken).toHaveBeenCalledWith('share-token-1');
    });

    it('filters public projects by search text', async () => {
        render(
            <MemoryRouter initialEntries={[`/portfolio/${testPortfolio.username}`]}>
                <Routes>
                    <Route path="/portfolio/:username" element={<PublicPortfolio />} />
                </Routes>
            </MemoryRouter>,
        );

        await screen.findByText('Alpha Project');

        await userEvent.type(screen.getByPlaceholderText('Search projects, tags, or narratives'), 'Beta');

        expect(screen.getByText('Beta Design')).toBeInTheDocument();
        expect(screen.queryByText('Alpha Project')).not.toBeInTheDocument();
    });

    it('filters public projects by verified-only checkbox', async () => {
        render(
            <MemoryRouter initialEntries={[`/portfolio/${testPortfolio.username}`]}>
                <Routes>
                    <Route path="/portfolio/:username" element={<PublicPortfolio />} />
                </Routes>
            </MemoryRouter>,
        );

        await screen.findByText('Alpha Project');

        await userEvent.click(screen.getByLabelText('Verified projects only'));

        expect(screen.getByText('Alpha Project')).toBeInTheDocument();
        expect(screen.queryByText('Beta Design')).not.toBeInTheDocument();
    });
});