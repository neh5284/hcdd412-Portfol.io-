import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Login } from './Login';

vi.mock('../services/authApi', () => ({
    signInWithEmail: vi.fn(),
}));

import { signInWithEmail } from '../services/authApi';

const mockedSignInWithEmail = vi.mocked(signInWithEmail);

describe('Login major features', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the login form', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>,
        );

        expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
    });

    it('submits login credentials and navigates to dashboard', async () => {
        mockedSignInWithEmail.mockResolvedValue({ user: { id: 'user-1' } } as never);

        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<div>Dashboard Page</div>} />
                </Routes>
            </MemoryRouter>,
        );

        await userEvent.clear(screen.getByLabelText('Email'));
        await userEvent.type(screen.getByLabelText('Email'), 'neh5284@psu.edu');
        await userEvent.type(screen.getByLabelText('Password'), 'password123');
        await userEvent.click(screen.getByRole('button', { name: 'Log In' }));

        expect(mockedSignInWithEmail).toHaveBeenCalledWith({
            email: 'neh5284@psu.edu',
            password: 'password123',
        });

        expect(await screen.findByText('Dashboard Page')).toBeInTheDocument();
    });

    it('shows a basic error result when login fails', async () => {
        mockedSignInWithEmail.mockRejectedValue(new Error('Invalid login credentials'));

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>,
        );

        await userEvent.type(screen.getByLabelText('Password'), 'wrongpass');
        await userEvent.click(screen.getByRole('button', { name: 'Log In' }));

        expect(await screen.findByText('Login failed')).toBeInTheDocument();
        expect(screen.getByText('Invalid login credentials')).toBeInTheDocument();
    });
});