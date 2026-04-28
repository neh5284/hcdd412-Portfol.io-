import { supabase } from '../supabaseClient';

export interface AuthCredentials {
    email: string;
    password: string;
}

export interface SignupInput extends AuthCredentials {
    name: string;
}

export async function getSession() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
        throw new Error(error.message || 'Session could not be loaded.');
    }

    return data.session;
}

export async function getAuthUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        throw new Error(error.message || 'User could not be loaded.');
    }

    return data.user;
}

export async function signInWithEmail({ email, password }: AuthCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw new Error(error.message || 'Login failed.');
    }

    return data;
}

export async function signUpWithEmail({ name, email, password }: SignupInput) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
            },
        },
    });

    if (error) {
        throw new Error(error.message || 'Signup failed.');
    }

    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw new Error(error.message || 'Logout failed.');
    }
}