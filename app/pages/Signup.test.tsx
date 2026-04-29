import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Signup } from './Signup';

vi.mock('../services/authApi', () => ({
    signUpWithEmail: vi.fn(),
}));

import { signUpWithEmail } from '../services/authApi';

const mockedSignUpWithEmail = vi.mocked(signUpWithEmail);

describe('Signup major features', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the signup form', () => {
        render(
            <MemoryRouter>
                <Signup />
            </MemoryRouter>,
        );

        expect(screen.getByRole('heading', { name: 'Start your portfolio.' })).toBeInTheDocument();
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    });

    it('validates mismatched passwords before calling the API', async () => {
        render(
            <MemoryRouter>
                <Signup />
            </MemoryRouter>,
        );

        await userEvent.type(screen.getByLabelText('Name'), 'Nathan Hinkle');
        await userEvent.clear(screen.getByLabelText('Email'));
        await userEvent.type(screen.getByLabelText('Email'), 'neh5284@psu.edu');
        await userEvent.type(screen.getByLabelText('Password'), 'password123');
        await userEvent.type(screen.getByLabelText('Confirm Password'), 'different123');
        await userEvent.click(screen.getByRole('button', { name: 'Create Account' }));

        expect(await screen.findByText('Passwords do not match.')).toBeInTheDocument();
        expect(mockedSignUpWithEmail).not.toHaveBeenCalled();
    });

    it('creates an account and shows a confirmation notice when email confirmation is required', async () => {
        mockedSignUpWithEmail.mockResolvedValue({ session: null } as never);

        render(
            <MemoryRouter>
                <Signup />
            </MemoryRouter>,
        );

        await userEvent.type(screen.getByLabelText('Name'), 'Nathan Hinkle');
        await userEvent.clear(screen.getByLabelText('Email'));
        await userEvent.type(screen.getByLabelText('Email'), 'neh5284@psu.edu');
        await userEvent.type(screen.getByLabelText('Password'), 'password123');
        await userEvent.type(screen.getByLabelText('Confirm Password'), 'password123');
        await userEvent.click(screen.getByRole('button', { name: 'Create Account' }));

        expect(mockedSignUpWithEmail).toHaveBeenCalledWith({
            name: 'Nathan Hinkle',
            email: 'neh5284@psu.edu',
            password: 'password123',
        });

        expect(await screen.findByText(/Account created/i)).toBeInTheDocument();
    });

    it('navigates to dashboard when signup returns a session', async () => {
        mockedSignUpWithEmail.mockResolvedValue({
            session: { user: { id: 'user-1' } },
        } as never);

        render(
            <MemoryRouter initialEntries={['/signup']}>
                <Routes>
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<div>Dashboard Page</div>} />
                </Routes>
            </MemoryRouter>,
        );

        await userEvent.type(screen.getByLabelText('Name'), 'Nathan Hinkle');
        await userEvent.clear(screen.getByLabelText('Email'));
        await userEvent.type(screen.getByLabelText('Email'), 'neh5284@psu.edu');
        await userEvent.type(screen.getByLabelText('Password'), 'password123');
        await userEvent.type(screen.getByLabelText('Confirm Password'), 'password123');
        await userEvent.click(screen.getByRole('button', { name: 'Create Account' }));

        expect(await screen.findByText('Dashboard Page')).toBeInTheDocument();
    });
});