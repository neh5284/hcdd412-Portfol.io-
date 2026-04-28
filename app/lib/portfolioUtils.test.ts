import { describe, expect, it } from 'vitest';
import {
    buildPortfolioFromRecords,
    filterProjects,
    getPortfolioStats,
    mapProjectRecord,
    normalizeTags,
    sortProjectsByKey,
} from './portfolioUtils';
import { testPortfolio } from '../test/fixtures';

describe('portfolio utilities', () => {
    it('normalizes comma-separated tags', () => {
        expect(normalizeTags('React, Supabase,  TypeScript')).toEqual(['React', 'Supabase', 'TypeScript']);
    });

    it('maps Supabase project records into UI project objects', () => {
        const project = mapProjectRecord(
            {
                id: 'p1',
                title: 'Mapped Project',
                description: 'Short description',
                category: 'coding',
                tags: ['React'],
                source_url: 'https://example.com',
                github_url: 'https://github.com/example/repo',
                created_at: '2026-02-01',
                is_group_project: true,
                personal_contribution: 'Implemented the API layer.',
                status: 'verified',
            },
            {
                project_id: 'p1',
                content: 'Narrative',
                problem: 'Problem text',
                process: 'Process text',
                outcome: 'Outcome text',
                role: 'Role text',
                is_draft: false,
            },
        );

        expect(project).toMatchObject({
            id: 'p1',
            title: 'Mapped Project',
            category: 'coding',
            projectUrl: 'https://example.com',
            githubUrl: 'https://github.com/example/repo',
            isGroupProject: true,
            verified: true,
            problem: 'Problem text',
        });
    });

    it('builds a portfolio from user, portfolio, and project records', () => {
        const portfolio = buildPortfolioFromRecords(
            { id: 'u1', email: 'person@example.com', name: 'Person Example' },
            {
                id: 'pf1',
                user_id: 'u1',
                title: 'Person Portfolio',
                username: 'person',
                bio: 'Bio from database',
                tagline: 'Tagline from database',
            },
            [{ id: 'p1', title: 'API Project', description: 'Loaded from Supabase' }],
            { shareLink: { share_token: 'abc123' } },
        );

        expect(portfolio.username).toBe('person');
        expect(portfolio.displayName).toBe('Person Example');
        expect(portfolio.shareToken).toBe('abc123');
        expect(portfolio.projects).toHaveLength(1);
    });

    it('filters by search, category, source, tag, and verification state', () => {
        const filtered = filterProjects(testPortfolio.projects, {
            searchTerm: 'dashboard',
            selectedCategory: 'coding',
            selectedTag: 'React',
            selectedSource: 'github',
            verifiedOnly: true,
        });

        expect(filtered.map((project) => project.id)).toEqual(['project-1']);
    });

    it('sorts projects without mutating the original list', () => {
        const sorted = sortProjectsByKey(testPortfolio.projects, 'title', 'desc');

        expect(sorted.map((project) => project.title)).toEqual(['Beta Design', 'Alpha Project']);
        expect(testPortfolio.projects.map((project) => project.title)).toEqual(['Alpha Project', 'Beta Design']);
    });

    it('returns dashboard stats', () => {
        expect(getPortfolioStats(testPortfolio.projects)).toEqual({
            total: 2,
            verified: 1,
            groupProjects: 1,
            categories: 2,
        });
    });
});