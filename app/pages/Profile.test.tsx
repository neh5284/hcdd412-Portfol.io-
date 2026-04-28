import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Profile } from './Profile';
import { testPortfolio } from '../test/fixtures';

vi.mock('../services/portfolioApi', () => ({
    getCurrentPortfolio: vi.fn(),
    updateProfile: vi.fn(),
    regenerateShareLink: vi.fn(),
}));

import { getCurrentPortfolio } from '../services/portfolioApi';

const mockedGetCurrentPortfolio = vi.mocked(getCurrentPortfolio);

describe('Profile', () => {
    beforeEach(() => {
        mockedGetCurrentPortfolio.mockResolvedValue(testPortfolio);
    });

    it('renders editable profile fields from the API layer', async () => {
        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>,
        );

        expect(await screen.findByDisplayValue(testPortfolio.displayName)).toBeInTheDocument();
        expect(screen.getByDisplayValue(testPortfolio.username)).toBeInTheDocument();
        expect(screen.getByDisplayValue(testPortfolio.tagline)).toBeInTheDocument();
        expect(screen.getByText('Public link')).toBeInTheDocument();
    });
});