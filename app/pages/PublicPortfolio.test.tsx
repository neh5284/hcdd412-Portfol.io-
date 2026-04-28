import { render, screen } from '@testing-library/react';
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

describe('PublicPortfolio', () => {
    beforeEach(() => {
        mockedGetPortfolioByUsername.mockResolvedValue(testPortfolio);
        mockedGetPortfolioByShareToken.mockResolvedValue(testPortfolio);
    });

    it('loads the public portfolio by username', async () => {
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
    });

    it('loads the public portfolio by share token', async () => {
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
});