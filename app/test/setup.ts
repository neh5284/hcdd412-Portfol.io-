import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

Object.defineProperty(navigator, 'clipboard', {
    value: {
        writeText: vi.fn(),
    },
    configurable: true,
});

Object.defineProperty(window, 'confirm', {
    value: vi.fn(() => true),
    configurable: true,
});