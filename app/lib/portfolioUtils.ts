import { Portfolio, Project } from '../data/mockData';

export type ProjectCategory = Project['category'];
export type SortDirection = 'asc' | 'desc';

export interface UserRecord {
    id?: string;
    email?: string | null;
    name?: string | null;
    created_at?: string | null;
}

export interface PortfolioRecord {
    id?: string;
    user_id?: string | null;
    title?: string | null;
    username?: string | null;
    bio?: string | null;
    tagline?: string | null;
    visibility?: 'public' | 'unlisted' | 'private' | null;
    created_at?: string | null;
    updated_at?: string | null;
}

export interface ProjectRecord {
    id?: string;
    portfolio_id?: string | null;
    title?: string | null;
    description?: string | null;
    source_type?: string | null;
    source_url?: string | null;
    status?: string | null;
    created_at?: string | null;
    category?: string | null;
    tags?: string[] | string | null;
    github_url?: string | null;
    project_url?: string | null;
    image_url?: string | null;
    is_group_project?: boolean | null;
    personal_contribution?: string | null;
    is_public?: boolean | null;
    updated_at?: string | null;
    last_synced_at?: string | null;
}

export interface NarrativeRecord {
    id?: string;
    project_id?: string | null;
    content?: string | null;
    is_draft?: boolean | null;
    problem?: string | null;
    process?: string | null;
    outcome?: string | null;
    role?: string | null;
    version?: number | null;
    updated_at?: string | null;
    created_at?: string | null;
}

export interface ShareLinkRecord {
    id?: string;
    portfolio_id?: string | null;
    share_token?: string | null;
    is_active?: boolean | null;
    visibility?: string | null;
    created_at?: string | null;
    revoked_at?: string | null;
    expires_at?: string | null;
}

export interface VerificationRecord {
    id?: string;
    project_id?: string | null;
    status?: string | null;
    score?: number | null;
    feedback?: string | null;
    evidence_summary?: string | null;
    source_provider?: string | null;
    source_url?: string | null;
    created_at?: string | null;
}

export interface MediaRecord {
    id?: string;
    project_id?: string | null;
    file_name?: string | null;
    file_path?: string | null;
    file_type?: string | null;
    mime_type?: string | null;
    alt_text?: string | null;
    sort_order?: number | null;
    created_at?: string | null;
}

const VALID_CATEGORIES: ProjectCategory[] = ['coding', 'visual', 'design', 'research', 'other'];

export function normalizeCategory(value: unknown): ProjectCategory {
    return VALID_CATEGORIES.includes(value as ProjectCategory) ? (value as ProjectCategory) : 'other';
}

export function normalizeTags(value: ProjectRecord['tags']): string[] {
    if (Array.isArray(value)) {
        return value.map((tag) => String(tag).trim()).filter(Boolean);
    }

    if (typeof value === 'string') {
        return value
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);
    }

    return [];
}

export function normalizeUsername(user: UserRecord | null | undefined, portfolio: PortfolioRecord | null | undefined): string {
    if (portfolio?.username) return portfolio.username;

    const email = user?.email;
    if (email && email.includes('@')) return email.split('@')[0];

    return 'portfolio';
}

export function mapProjectRecord(
    record: ProjectRecord,
    narrative?: NarrativeRecord,
    verification?: VerificationRecord,
    media: MediaRecord[] = [],
): Project {
    const description = record.description || '';

    return {
        id: record.id || crypto.randomUUID(),
        title: record.title || 'Untitled Project',
        description,
        narrative: narrative?.content || description,
        problem: narrative?.problem || '',
        process: narrative?.process || '',
        outcome: narrative?.outcome || '',
        role: narrative?.role || '',
        narrativeIsDraft: Boolean(narrative?.is_draft),
        category: normalizeCategory(record.category),
        tags: normalizeTags(record.tags),
        imageUrl: record.image_url || undefined,
        projectUrl: record.project_url || record.source_url || undefined,
        githubUrl: record.github_url || undefined,
        createdAt: record.created_at || new Date().toISOString(),
        isGroupProject: Boolean(record.is_group_project),
        personalContribution: record.personal_contribution || '',
        verified: record.status === 'verified' || verification?.status === 'verified',
        isPublic: record.is_public ?? true,
        verificationStatus: verification?.status || record.status || 'published',
        verificationScore: verification?.score ?? undefined,
        verificationFeedback: verification?.feedback || undefined,
        media: media.map((item) => ({
            id: item.id || '',
            fileName: item.file_name || '',
            filePath: item.file_path || '',
            fileType: item.file_type || 'other',
            mimeType: item.mime_type || '',
            altText: item.alt_text || '',
        })),
    };
}

export function buildPortfolioFromRecords(
    user: UserRecord,
    portfolio: PortfolioRecord,
    projects: ProjectRecord[] = [],
    related: {
        narratives?: NarrativeRecord[];
        verifications?: VerificationRecord[];
        media?: MediaRecord[];
        shareLink?: ShareLinkRecord | null;
    } = {},
): Portfolio {
    const narratives = related.narratives || [];
    const verifications = related.verifications || [];
    const media = related.media || [];

    return {
        id: portfolio.id || '',
        userId: String(portfolio.user_id || user.id || ''),
        username: normalizeUsername(user, portfolio),
        displayName: user.name || portfolio.title || 'Portfolio Owner',
        title: portfolio.title || `${user.name || 'Portfolio Owner'} Portfolio`,
        bio: portfolio.bio || '',
        tagline: portfolio.tagline || 'Building the future, one project at a time.',
        email: user.email || '',
        visibility: portfolio.visibility || 'public',
        shareToken: related.shareLink?.share_token || undefined,
        shareUrl: related.shareLink?.share_token ? `/share/${related.shareLink.share_token}` : undefined,
        projects: projects.map((project) =>
            mapProjectRecord(
                project,
                narratives.find((narrative) => narrative.project_id === project.id),
                verifications.find((verification) => verification.project_id === project.id),
                media.filter((item) => item.project_id === project.id),
            ),
        ),
    };
}

export function filterProjects(
    projects: Project[],
    options: {
        searchTerm?: string;
        selectedCategory?: string;
        selectedTag?: string;
        selectedSource?: string;
        verifiedOnly?: boolean;
    },
): Project[] {
    const normalizedSearch = (options.searchTerm || '').trim().toLowerCase();
    const selectedCategory = options.selectedCategory || 'all';
    const selectedTag = options.selectedTag || 'all';
    const selectedSource = options.selectedSource || 'all';
    const verifiedOnly = Boolean(options.verifiedOnly);

    return projects.filter((project) => {
        const matchesSearch =
            normalizedSearch.length === 0 ||
            project.title.toLowerCase().includes(normalizedSearch) ||
            project.description.toLowerCase().includes(normalizedSearch) ||
            project.narrative.toLowerCase().includes(normalizedSearch) ||
            project.problem?.toLowerCase().includes(normalizedSearch) ||
            project.process?.toLowerCase().includes(normalizedSearch) ||
            project.outcome?.toLowerCase().includes(normalizedSearch) ||
            project.role?.toLowerCase().includes(normalizedSearch) ||
            project.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch));

        const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
        const matchesTag = selectedTag === 'all' || project.tags.includes(selectedTag);
        const matchesVerified = !verifiedOnly || Boolean(project.verified);
        const matchesSource =
            selectedSource === 'all' ||
            (selectedSource === 'github' && Boolean(project.githubUrl)) ||
            (selectedSource === 'live' && Boolean(project.projectUrl)) ||
            (selectedSource === 'manual' && !project.githubUrl && !project.projectUrl);

        return matchesSearch && matchesCategory && matchesTag && matchesSource && matchesVerified;
    });
}

export function sortProjectsByKey(projects: Project[], key: keyof Project, direction: SortDirection = 'asc'): Project[] {
    const multiplier = direction === 'asc' ? 1 : -1;

    return [...projects].sort((a, b) => {
        const first = a[key];
        const second = b[key];

        if (typeof first === 'string' && typeof second === 'string') {
            return first.localeCompare(second) * multiplier;
        }

        if (Number(first) < Number(second)) return -1 * multiplier;
        if (Number(first) > Number(second)) return 1 * multiplier;
        return 0;
    });
}

export function getPortfolioStats(projects: Project[]) {
    return {
        total: projects.length,
        verified: projects.filter((project) => project.verified).length,
        groupProjects: projects.filter((project) => project.isGroupProject).length,
        categories: new Set(projects.map((project) => project.category)).size,
    };
}