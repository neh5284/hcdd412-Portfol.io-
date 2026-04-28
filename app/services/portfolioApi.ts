import { supabase } from '../supabaseClient';
import { Portfolio, Project } from '../data/mockData';
import {
    buildPortfolioFromRecords,
    MediaRecord,
    NarrativeRecord,
    PortfolioRecord,
    ProjectRecord,
    ShareLinkRecord,
    UserRecord,
    VerificationRecord,
} from '../lib/portfolioUtils';

const FALLBACK_USER_EMAIL = 'neh5284@psu.edu';

export interface ProfileUpdateInput {
    displayName: string;
    title: string;
    username: string;
    tagline: string;
    bio: string;
    visibility?: 'public' | 'unlisted' | 'private';
}

export interface ProjectSaveInput extends Partial<Project> {
    narrativeContent?: string;
    isDraft?: boolean;
}

export interface ImportJobInput {
    userId: string;
    providerName: string;
    connectorId?: string;
}

export interface ImportItemInput {
    importJobId: string;
    externalId: string;
    title: string;
    description?: string;
    sourceUrl?: string;
    sourceType?: string;
    fileType?: string;
    metadata?: Record<string, unknown>;
}

export interface SkillClaimInput {
    projectId: string;
    skillName: string;
    claimedLevel?: string;
}

export interface VerificationInput {
    projectId: string;
    skillClaimId?: string;
    status: 'verified' | 'unverified' | 'unavailable' | 'insufficient_data' | 'pending';
    score?: number;
    feedback?: string;
    evidenceSummary?: string;
    sourceProvider?: string;
    sourceUrl?: string;
}

export interface ContributionEvidenceInput {
    projectId: string;
    providerName: string;
    committerId?: string;
    commitCount?: number;
    contributionPercentage?: number;
    evidence?: Record<string, unknown>;
}

type QueryResult<T> = {
    data: T | null;
    error: { message: string } | null;
};

function assertNoError<T>(result: QueryResult<T>, fallbackMessage: string): T {
    if (result.error) {
        throw new Error(result.error.message || fallbackMessage);
    }
    if (!result.data) {
        throw new Error(fallbackMessage);
    }
    return result.data;
}

async function getCurrentUserRecord(): Promise<UserRecord> {
    const authResult = await supabase.auth.getUser();
    const authUser = authResult.data.user;

    if (authUser?.id) {
        const byId = await supabase.from('users').select('*').eq('id', authUser.id).single();

        if (!byId.error && byId.data) {
            return byId.data as UserRecord;
        }
    }

    const byEmail = await supabase.from('users').select('*').eq('email', FALLBACK_USER_EMAIL).single();

    return assertNoError<UserRecord>(
        byEmail as QueryResult<UserRecord>,
        `No user found for ${FALLBACK_USER_EMAIL}.`,
    );
}

async function getUserById(userId: string): Promise<UserRecord> {
    const result = await supabase.from('users').select('*').eq('id', userId).single();

    return assertNoError<UserRecord>(
        result as QueryResult<UserRecord>,
        'No owner found for this portfolio.',
    );
}

async function getPortfolioByUserId(userId: string): Promise<PortfolioRecord> {
    const result = await supabase.from('portfolios').select('*').eq('user_id', userId).single();

    return assertNoError<PortfolioRecord>(
        result as QueryResult<PortfolioRecord>,
        'No portfolio found for this user.',
    );
}

async function getProjectsByPortfolioId(portfolioId: string): Promise<ProjectRecord[]> {
    const result = await supabase
        .from('projects')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .order('created_at', { ascending: false });

    if (result.error) {
        throw new Error(result.error.message || 'Projects could not be loaded.');
    }

    return (result.data || []) as ProjectRecord[];
}

async function getNarrativesByProjectIds(projectIds: string[]): Promise<NarrativeRecord[]> {
    if (projectIds.length === 0) return [];

    const result = await supabase.from('narratives').select('*').in('project_id', projectIds);

    if (result.error) {
        throw new Error(result.error.message || 'Narratives could not be loaded.');
    }

    return (result.data || []) as NarrativeRecord[];
}

async function getVerificationsByProjectIds(projectIds: string[]): Promise<VerificationRecord[]> {
    if (projectIds.length === 0) return [];

    const result = await supabase.from('verification_results').select('*').in('project_id', projectIds);

    if (result.error) {
        return [];
    }

    return (result.data || []) as VerificationRecord[];
}

async function getMediaByProjectIds(projectIds: string[]): Promise<MediaRecord[]> {
    if (projectIds.length === 0) return [];

    const result = await supabase.from('project_media').select('*').in('project_id', projectIds);

    if (result.error) {
        return [];
    }

    return (result.data || []) as MediaRecord[];
}

async function getShareLinkByPortfolioId(portfolioId: string): Promise<ShareLinkRecord | null> {
    const result = await supabase
        .from('share_links')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .eq('is_active', true)
        .maybeSingle();

    if (result.error) {
        return null;
    }

    return (result.data || null) as ShareLinkRecord | null;
}

async function buildPortfolio(user: UserRecord, portfolio: PortfolioRecord): Promise<Portfolio> {
    const projects = await getProjectsByPortfolioId(String(portfolio.id));
    const projectIds = projects.map((project) => String(project.id));
    const [narratives, verifications, media, shareLink] = await Promise.all([
        getNarrativesByProjectIds(projectIds),
        getVerificationsByProjectIds(projectIds),
        getMediaByProjectIds(projectIds),
        getShareLinkByPortfolioId(String(portfolio.id)),
    ]);

    return buildPortfolioFromRecords(user, portfolio, projects, {
        narratives,
        verifications,
        media,
        shareLink,
    });
}

export async function getCurrentPortfolio(): Promise<Portfolio> {
    const user = await getCurrentUserRecord();
    const portfolio = await getPortfolioByUserId(String(user.id));

    return buildPortfolio(user, portfolio);
}

export async function getPortfolioByUsername(username: string): Promise<Portfolio> {
    const portfolioResult = await supabase
        .from('portfolios')
        .select('*')
        .eq('username', username)
        .in('visibility', ['public', 'unlisted'])
        .single();

    const portfolio = assertNoError<PortfolioRecord>(
        portfolioResult as QueryResult<PortfolioRecord>,
        `No public portfolio found for ${username}.`,
    );

    const user = await getUserById(String(portfolio.user_id));
    return buildPortfolio(user, portfolio);
}

export async function getPortfolioByShareToken(token: string): Promise<Portfolio> {
    const linkResult = await supabase
        .from('share_links')
        .select('*')
        .eq('share_token', token)
        .eq('is_active', true)
        .maybeSingle();

    const shareLink = assertNoError<ShareLinkRecord>(
        linkResult as QueryResult<ShareLinkRecord>,
        'This share link is invalid or inactive.',
    );

    const portfolioResult = await supabase
        .from('portfolios')
        .select('*')
        .eq('id', shareLink.portfolio_id)
        .single();

    const portfolio = assertNoError<PortfolioRecord>(
        portfolioResult as QueryResult<PortfolioRecord>,
        'No portfolio found for this share link.',
    );

    const user = await getUserById(String(portfolio.user_id));
    return buildPortfolio(user, portfolio);
}

export async function updateProfile(portfolio: Portfolio, input: ProfileUpdateInput): Promise<void> {
    const userUpdate = await supabase
        .from('users')
        .update({ name: input.displayName })
        .eq('id', portfolio.userId);

    if (userUpdate.error) {
        throw new Error(userUpdate.error.message || 'User profile could not be updated.');
    }

    const portfolioUpdate = await supabase
        .from('portfolios')
        .update({
            title: input.title,
            username: input.username,
            tagline: input.tagline,
            bio: input.bio,
            visibility: input.visibility || portfolio.visibility || 'public',
        })
        .eq('id', portfolio.id);

    if (portfolioUpdate.error) {
        throw new Error(portfolioUpdate.error.message || 'Portfolio could not be updated.');
    }
}

function toProjectPayload(portfolioId: string, project: ProjectSaveInput) {
    return {
        portfolio_id: portfolioId,
        title: project.title,
        description: project.description || '',
        source_type: project.githubUrl ? 'github' : project.projectUrl ? 'live' : 'manual',
        source_url: project.projectUrl || project.githubUrl || null,
        status: project.verified ? 'verified' : 'published',
        category: project.category || 'other',
        tags: project.tags || [],
        github_url: project.githubUrl || null,
        project_url: project.projectUrl || null,
        image_url: project.imageUrl || null,
        is_group_project: Boolean(project.isGroupProject),
        personal_contribution: project.personalContribution || null,
        is_public: project.isPublic ?? true,
    };
}

async function upsertNarrative(projectId: string, project: ProjectSaveInput): Promise<void> {
    const existing = await supabase
        .from('narratives')
        .select('*')
        .eq('project_id', projectId)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle();

    const payload = {
        project_id: projectId,
        content: project.narrativeContent || project.narrative || '',
        problem: project.problem || '',
        process: project.process || '',
        outcome: project.outcome || '',
        role: project.role || '',
        is_draft: Boolean(project.isDraft),
        version: existing.data?.version || 1,
    };

    const result = existing.data
        ? await supabase.from('narratives').update(payload).eq('id', existing.data.id)
        : await supabase.from('narratives').insert([payload]);

    if (result.error) {
        throw new Error(result.error.message || 'Narrative could not be saved.');
    }
}

export async function saveProject(
    portfolioId: string,
    project: ProjectSaveInput,
    editingProjectId?: string,
): Promise<void> {
    if (!project.title || !project.description) {
        throw new Error('Project title and description are required.');
    }

    const payload = toProjectPayload(portfolioId, project);

    const result = editingProjectId
        ? await supabase.from('projects').update(payload).eq('id', editingProjectId).select('*').single()
        : await supabase.from('projects').insert([payload]).select('*').single();

    const savedProject = assertNoError<ProjectRecord>(
        result as QueryResult<ProjectRecord>,
        'Project could not be saved.',
    );

    await upsertNarrative(String(savedProject.id), project);
}

export async function deleteProject(projectId: string): Promise<void> {
    const result = await supabase.from('projects').delete().eq('id', projectId);

    if (result.error) {
        throw new Error(result.error.message || 'Project could not be deleted.');
    }
}

export async function regenerateShareLink(portfolioId: string): Promise<ShareLinkRecord> {
    const rpcResult = await supabase.rpc('regenerate_share_link', {
        target_portfolio_id: portfolioId,
    });

    if (!rpcResult.error && rpcResult.data) {
        return rpcResult.data as ShareLinkRecord;
    }

    await supabase
        .from('share_links')
        .update({
            is_active: false,
            revoked_at: new Date().toISOString(),
        })
        .eq('portfolio_id', portfolioId)
        .eq('is_active', true);

    const token = crypto.randomUUID().replaceAll('-', '');

    const insertResult = await supabase
        .from('share_links')
        .insert([
            {
                portfolio_id: portfolioId,
                share_token: token,
                is_active: true,
                visibility: 'public',
            },
        ])
        .select('*')
        .single();

    return assertNoError<ShareLinkRecord>(
        insertResult as QueryResult<ShareLinkRecord>,
        'Share link could not be regenerated.',
    );
}

export async function startImportJob(input: ImportJobInput) {
    const result = await supabase
        .from('import_jobs')
        .insert([
            {
                user_id: input.userId,
                connector_id: input.connectorId || null,
                provider_name: input.providerName,
                status: 'pending',
            },
        ])
        .select('*')
        .single();

    return assertNoError(result as QueryResult<unknown>, 'Import job could not be created.');
}

export async function addImportItems(items: ImportItemInput[]) {
    const result = await supabase.from('import_items').insert(
        items.map((item) => ({
            import_job_id: item.importJobId,
            external_id: item.externalId,
            title: item.title,
            description: item.description || null,
            source_url: item.sourceUrl || null,
            source_type: item.sourceType || null,
            file_type: item.fileType || null,
            metadata: item.metadata || {},
        })),
    );

    if (result.error) {
        throw new Error(result.error.message || 'Import items could not be saved.');
    }
}

export async function createSkillClaim(input: SkillClaimInput) {
    const result = await supabase
        .from('skill_claims')
        .insert([
            {
                project_id: input.projectId,
                skill_name: input.skillName,
                claimed_level: input.claimedLevel || null,
            },
        ])
        .select('*')
        .single();

    return assertNoError(result as QueryResult<unknown>, 'Skill claim could not be created.');
}

export async function createVerificationResult(input: VerificationInput) {
    const result = await supabase
        .from('verification_results')
        .insert([
            {
                project_id: input.projectId,
                skill_claim_id: input.skillClaimId || null,
                status: input.status,
                score: input.score || null,
                feedback: input.feedback || null,
                evidence_summary: input.evidenceSummary || null,
                source_provider: input.sourceProvider || null,
                source_url: input.sourceUrl || null,
            },
        ])
        .select('*')
        .single();

    return assertNoError(result as QueryResult<unknown>, 'Verification result could not be created.');
}

export async function createContributionEvidence(input: ContributionEvidenceInput) {
    const result = await supabase
        .from('contribution_evidence')
        .insert([
            {
                project_id: input.projectId,
                provider_name: input.providerName,
                committer_id: input.committerId || null,
                commit_count: input.commitCount || 0,
                contribution_percentage: input.contributionPercentage || null,
                evidence: input.evidence || {},
            },
        ])
        .select('*')
        .single();

    return assertNoError(result as QueryResult<unknown>, 'Contribution evidence could not be created.');
}

export async function uploadProjectMedia(projectId: string, file: File, altText = '') {
    const filePath = `${projectId}/${crypto.randomUUID()}-${file.name}`;
    const upload = await supabase.storage.from('project-media').upload(filePath, file);

    if (upload.error) {
        throw new Error(upload.error.message || 'Project media could not be uploaded.');
    }

    const fileType = file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
            ? 'video'
            : file.type === 'application/pdf'
                ? 'pdf'
                : 'document';

    const insert = await supabase
        .from('project_media')
        .insert([
            {
                project_id: projectId,
                file_name: file.name,
                file_path: filePath,
                file_type: fileType,
                mime_type: file.type,
                alt_text: altText,
            },
        ])
        .select('*')
        .single();

    return assertNoError(insert as QueryResult<unknown>, 'Project media metadata could not be saved.');
}

export async function uploadProfileDocument(portfolioId: string, file: File, documentType = 'resume') {
    const filePath = `${portfolioId}/${crypto.randomUUID()}-${file.name}`;
    const upload = await supabase.storage.from('profile-documents').upload(filePath, file);

    if (upload.error) {
        throw new Error(upload.error.message || 'Profile document could not be uploaded.');
    }

    const insert = await supabase
        .from('profile_documents')
        .insert([
            {
                portfolio_id: portfolioId,
                document_type: documentType,
                file_name: file.name,
                file_path: filePath,
                mime_type: file.type,
            },
        ])
        .select('*')
        .single();

    return assertNoError(insert as QueryResult<unknown>, 'Profile document metadata could not be saved.');
}