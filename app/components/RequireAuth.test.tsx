import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RequireAuth } from './RequireAuth';
import { fakeAuthUser } from '../test/fixtures';

vi.mock('../services/authApi', () => ({
    getAuthUser: vi.fn(),
}));

import { getAuthUser } from '../services/authApi';

const mockedGetAuthUser = vi.mocked(getAuthUser);

describe('RequireAuth major features', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders protected content for an authenticated user', async () => {
        mockedGetAuthUser.mockResolvedValue(fakeAuthUser as never);

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route
                        path="/dashboard"
                        element={
                            <RequireAuth>
                                <div>Protected Dashboard</div>
                            </RequireAuth>
                        }
                    />
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>,
        );

        expect(await screen.findByText('Protected Dashboard')).toBeInTheDocument();
    });

    it('redirects unauthenticated users to login', async () => {
        mockedGetAuthUser.mockResolvedValue(null as never);

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route
                        path="/dashboard"
                        element={
                            <RequireAuth>
                                <div>Protected Dashboard</div>
                            </RequireAuth>
                        }
                    />
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>,
        );

        expect(await screen.findByText('Login Page')).toBeInTheDocument();
    });
});