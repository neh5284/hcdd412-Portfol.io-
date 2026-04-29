import { describe, expect, it } from 'vitest';
import {
    buildPortfolioFromRecords,
    filterProjects,
    getPortfolioStats,
    mapProjectRecord,
    normalizeCategory,
    normalizeTags,
    sortProjectsByKey,
} from './portfolioUtils';
import {
    fetchedBasicNarratives,
    fetchedBasicPortfolio,
    fetchedBasicProjects,
    fetchedBasicShareLink,
    fetchedBasicUser,
    fetchedBasicVerificationResults,
    testPortfolio,
} from '../test/fixtures';

describe('portfolio data utilities', () => {
    it('normalizes categories and tags from fetched records', () => {
        expect(normalizeCategory('coding')).toBe('coding');
        expect(normalizeCategory('wrong-value')).toBe('other');

        expect(normalizeTags('React, Supabase, TypeScript')).toEqual([
            'React',
            'Supabase',
            'TypeScript',
        ]);

        expect(normalizeTags(['React', 'Supabase'])).toEqual(['React', 'Supabase']);
        expect(normalizeTags(null)).toEqual([]);
    });

    it('maps a fetched project row into a UI project object', () => {
        const project = mapProjectRecord(
            fetchedBasicProjects[0],
            fetchedBasicNarratives[0],
            fetchedBasicVerificationResults[0],
        );

        expect(project.id).toBe('project-1');
        expect(project.title).toBe('Alpha Project');
        expect(project.description).toBe('React dashboard project');
        expect(project.category).toBe('coding');
        expect(project.tags).toEqual(['React', 'Supabase']);
        expect(project.projectUrl).toBe('https://example.com/alpha');
        expect(project.githubUrl).toBe('https://github.com/neh5284/alpha');
        expect(project.isGroupProject).toBe(true);
        expect(project.personalContribution).toBe('Owned the frontend dashboard.');
        expect(project.verified).toBe(true);
        expect(project.verificationScore).toBe(0.95);
        expect(project.problem).toBe('Portfolio work is scattered.');
        expect(project.process).toBe('Built a dashboard and API service layer.');
        expect(project.outcome).toBe('Portfolio content is easier to manage.');
        expect(project.role).toBe('Owned the frontend dashboard.');
    });

    it('builds a complete portfolio from fetched user, portfolio, projects, narratives, verification, and share-link data', () => {
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
        expect(portfolio.title).toBe('Nathan Portfolio');
        expect(portfolio.email).toBe('neh5284@psu.edu');
        expect(portfolio.shareToken).toBe('share-token-1');
        expect(portfolio.shareUrl).toBe('/share/share-token-1');
        expect(portfolio.projects).toHaveLength(3);
        expect(portfolio.projects[0].title).toBe('Alpha Project');
    });

    it('filters fetched projects by search, category, tag, source, and verification', () => {
        const filtered = filterProjects(testPortfolio.projects, {
            searchTerm: 'dashboard',
            selectedCategory: 'coding',
            selectedTag: 'React',
            selectedSource: 'github',
            verifiedOnly: true,
        });

        expect(filtered).toHaveLength(1);
        expect(filtered[0].id).toBe('project-1');
    });

    it('sorts projects by title and date', () => {
        const byTitle = sortProjectsByKey(testPortfolio.projects, 'title', 'asc');
        expect(byTitle.map((project) => project.title)).toEqual([
            'Alpha Project',
            'Beta Design',
            'Private Research Draft',
        ]);

        const byDateDesc = sortProjectsByKey(testPortfolio.projects, 'createdAt', 'desc');
        expect(byDateDesc[0].title).toBe('Private Research Draft');
    });

    it('calculates dashboard statistics', () => {
        expect(getPortfolioStats(testPortfolio.projects)).toEqual({
            total: 3,
            verified: 1,
            groupProjects: 1,
            categories: 3,
        });
    });
});