import { describe, expect, it } from 'vitest';
import { buildPortfolioFromRecords } from '../lib/portfolioUtils';
import {
    fetchedBasicNarratives,
    fetchedBasicPortfolio,
    fetchedBasicProjects,
    fetchedBasicShareLink,
    fetchedBasicUser,
    fetchedBasicVerificationResults,
} from '../test/fixtures';

describe('portfolio fetched basic data flow', () => {
    it('builds the current portfolio from fetched Supabase-style records', () => {
        const portfolio = buildPortfolioFromRecords(
            fetchedBasicUser,
            fetchedBasicPortfolio,
            fetchedBasicProjects,
            {
                narratives: fetchedBasicNarratives,
                verifications: fetchedBasicVerificationResults,
                shareLink: fetchedBasicShareLink,
            },
        );

        expect(portfolio.id).toBe('portfolio-1');
        expect(portfolio.userId).toBe('user-1');
        expect(portfolio.username).toBe('neh5284');
        expect(portfolio.displayName).toBe('Nathan Hinkle');
        expect(portfolio.email).toBe('neh5284@psu.edu');
        expect(portfolio.shareToken).toBe('share-token-1');

        expect(portfolio.projects).toHaveLength(3);

        expect(portfolio.projects[0]).toMatchObject({
            id: 'project-1',
            title: 'Alpha Project',
            category: 'coding',
            tags: ['React', 'Supabase'],
            githubUrl: 'https://github.com/neh5284/alpha',
            projectUrl: 'https://example.com/alpha',
            isGroupProject: true,
            personalContribution: 'Owned the frontend dashboard.',
            verified: true,
            verificationScore: 0.95,
            problem: 'Portfolio work is scattered.',
            process: 'Built a dashboard and API service layer.',
            outcome: 'Portfolio content is easier to manage.',
            role: 'Owned the frontend dashboard.',
        });
    });

    it('marks private fetched projects as not public', () => {
        const portfolio = buildPortfolioFromRecords(
            fetchedBasicUser,
            fetchedBasicPortfolio,
            fetchedBasicProjects,
            {
                narratives: fetchedBasicNarratives,
                verifications: fetchedBasicVerificationResults,
                shareLink: fetchedBasicShareLink,
            },
        );

        const privateProject = portfolio.projects.find((project) => project.id === 'project-3');

        expect(privateProject?.title).toBe('Private Research Draft');
        expect(privateProject?.isPublic).toBe(false);
        expect(privateProject?.narrativeIsDraft).toBe(true);
    });

    it('includes share-link data from fetched records', () => {
        const portfolio = buildPortfolioFromRecords(
            fetchedBasicUser,
            fetchedBasicPortfolio,
            fetchedBasicProjects,
            {
                narratives: fetchedBasicNarratives,
                verifications: fetchedBasicVerificationResults,
                shareLink: fetchedBasicShareLink,
            },
        );

        expect(portfolio.shareToken).toBe('share-token-1');
        expect(portfolio.shareUrl).toBe('/share/share-token-1');
    });
});