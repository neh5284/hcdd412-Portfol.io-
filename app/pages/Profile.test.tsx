import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Profile } from './Profile';
import { testPortfolio } from '../test/fixtures';

vi.mock('../services/portfolioApi', () => ({
    getCurrentPortfolio: vi.fn(),
    updateProfile: vi.fn(),
    regenerateShareLink: vi.fn(),
}));

import { getCurrentPortfolio, regenerateShareLink, updateProfile } from '../services/portfolioApi';

const mockedGetCurrentPortfolio = vi.mocked(getCurrentPortfolio);
const mockedUpdateProfile = vi.mocked(updateProfile);
const mockedRegenerateShareLink = vi.mocked(regenerateShareLink);

describe('Profile major features', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockedGetCurrentPortfolio.mockResolvedValue(testPortfolio);
        mockedUpdateProfile.mockResolvedValue(undefined);
        mockedRegenerateShareLink.mockResolvedValue({ share_token: 'new-token' } as never);
    });

    it('renders fetched profile fields', async () => {
        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>,
        );

        expect(await screen.findByDisplayValue(testPortfolio.displayName)).toBeInTheDocument();
        expect(screen.getByDisplayValue(testPortfolio.title)).toBeInTheDocument();
        expect(screen.getByDisplayValue(testPortfolio.username)).toBeInTheDocument();
        expect(screen.getByDisplayValue(testPortfolio.tagline)).toBeInTheDocument();
        expect(screen.getByText('Public link')).toBeInTheDocument();
    });

    it('saves profile changes', async () => {
        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>,
        );

        const displayNameInput = await screen.findByDisplayValue(testPortfolio.displayName);

        await userEvent.clear(displayNameInput);
        await userEvent.type(displayNameInput, 'Nathan Updated');
        await userEvent.click(screen.getByRole('button', { name: 'Save Profile' }));

        expect(mockedUpdateProfile).toHaveBeenCalledWith(
            testPortfolio,
            expect.objectContaining({
                displayName: 'Nathan Updated',
            }),
        );

        expect(await screen.findByText('Profile updated.')).toBeInTheDocument();
    });

    it('regenerates the public share link', async () => {
        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>,
        );

        await screen.findByText('Public link');
        await userEvent.click(screen.getByRole('button', { name: 'Regenerate Link' }));

        expect(mockedRegenerateShareLink).toHaveBeenCalledWith(testPortfolio.id);
        expect(await screen.findByText('Share link regenerated.')).toBeInTheDocument();
    });
});