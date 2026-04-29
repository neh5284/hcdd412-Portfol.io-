package testharness;

import portfolio.identity.authService;
import portfolio.integration.syncService;
import portfolio.core.projectService;
import portfolio.verification.skillVerifyService;
import portfolio.notifications.notification;
import portfolio.notifications.notificationFactory;

import java.util.List;
import java.util.Map;

public class testHarness {

    private enum TestStatus {
        PASS,
        FAIL,
        FAIL_DESCOPED
    }

    private static int passed = 0;
    private static int failed = 0;
    private static int descopedFailed = 0;

    private static void runTest(
            int number,
            String name,
            TestStatus status,
            String data,
            String whyItFailed
    ) {
        if (status == TestStatus.PASS) {
            passed++;
        } else if (status == TestStatus.FAIL_DESCOPED) {
            failed++;
            descopedFailed++;
        } else {
            failed++;
        }

        System.out.println("Test " + number + ": " + name);
        System.out.println("Data: " + safeText(data));
        System.out.println("Result: " + formatStatus(status));

        if (status == TestStatus.FAIL || status == TestStatus.FAIL_DESCOPED) {
            System.out.println("Why it failed: " + safeText(whyItFailed));
        } else {
            System.out.println("Why it failed: N/A");
        }

        System.out.println("--------------------------------------------------");
    }

    private static String formatStatus(TestStatus status) {
        switch (status) {
            case PASS:
                return "PASS";
            case FAIL_DESCOPED:
                return "FAIL - DESCOPED";
            case FAIL:
            default:
                return "FAIL";
        }
    }

    private static String safeText(String value) {
        if (value == null || value.trim().isEmpty()) {
            return "N/A";
        }

        return value;
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" Portfol.io Basic Test Harness");
        System.out.println(" Simple Feature Tests");
        System.out.println(" Results show only PASS, FAIL, or FAIL - DESCOPED");
        System.out.println("==================================================");
        System.out.println();

        authService auth = new authService();
        syncService sync = new syncService();
        projectService projectDb = new projectService();
        skillVerifyService verifier = new skillVerifyService();
        notificationFactory notificationFactory = new notificationFactory();

        String testEmail = "neh5284@psu.edu";
        String testPassword = "pass123";
        String testUser = "neh5284";
        String testRepo = "hcdd412-Portfol.io-";

        String session = auth.login(testEmail, testPassword);
        boolean loginWorks = session != null && session.contains("JWT");

        runTest(
                1,
                "Email login returns a session",
                loginWorks ? TestStatus.PASS : TestStatus.FAIL,
                "email=" + testEmail + ", session=" + session,
                loginWorks ? "" : "authService.login() did not return the expected session token."
        );

        boolean sessionHasExpectedFormat =
                session != null
                        && session.startsWith("JWT")
                        && session.length() > 5;

        runTest(
                2,
                "Session token has expected format",
                sessionHasExpectedFormat ? TestStatus.PASS : TestStatus.FAIL,
                "session=" + session,
                sessionHasExpectedFormat ? "" : "The session token was missing or had an unexpected format."
        );

        List<String> previewProjects = sync.preview(testUser, "GitHub");
        boolean previewWorks = previewProjects != null && !previewProjects.isEmpty();

        runTest(
                3,
                "Project preview returns repositories",
                previewWorks ? TestStatus.PASS : TestStatus.FAIL,
                "previewProjects=" + previewProjects,
                previewWorks ? "" : "syncService.preview() did not return project names."
        );

        boolean previewContainsPortfolio =
                previewProjects != null
                        && previewProjects.toString().toLowerCase().contains("portfol");

        runTest(
                4,
                "Project preview includes portfolio item",
                previewContainsPortfolio ? TestStatus.PASS : TestStatus.FAIL,
                "previewProjects=" + previewProjects,
                previewContainsPortfolio ? "" : "The preview list did not include a portfolio-related project."
        );

        boolean importResult = sync.importProjects(testUser, "GitHub");

        runTest(
                5,
                "Project import method completes",
                importResult ? TestStatus.PASS : TestStatus.FAIL,
                "user=" + testUser + ", provider=GitHub, importResult=" + importResult,
                importResult ? "" : "syncService.importProjects() returned false."
        );

        runTest(
                6,
                "Real GitHub OAuth connection",
                TestStatus.FAIL_DESCOPED,
                "provider=GitHub, user=" + testUser,
                "Descoped. The harness does not perform real OAuth login, token storage, or authenticated GitHub account linking."
        );

        Map<String, String> repoDetails = sync.fetchRepoDetails(testUser, testRepo);

        boolean repoDetailsWork =
                repoDetails != null
                        && repoDetails.get("name") != null
                        && repoDetails.get("owner") != null
                        && repoDetails.get("language") != null
                        && repoDetails.get("stars") != null
                        && repoDetails.get("forks") != null;

        runTest(
                7,
                "Repository metadata is available",
                repoDetailsWork ? TestStatus.PASS : TestStatus.FAIL,
                "repoDetails=" + repoDetails,
                repoDetailsWork ? "" : "Repository metadata was missing required fields."
        );

        boolean repoOwnerMatches =
                repoDetails != null
                        && testUser.equals(repoDetails.get("owner"));

        runTest(
                8,
                "Repository owner maps correctly",
                repoOwnerMatches ? TestStatus.PASS : TestStatus.FAIL,
                "expectedOwner=" + testUser + ", actualOwner=" + (repoDetails == null ? null : repoDetails.get("owner")),
                repoOwnerMatches ? "" : "Repository owner did not match the expected test user."
        );

        List<String> commits = sync.fetchDynamicCommits(testUser, testRepo);
        boolean commitsAvailable = commits != null && !commits.isEmpty();

        runTest(
                9,
                "Commit history is available",
                commitsAvailable ? TestStatus.PASS : TestStatus.FAIL,
                "commitCount=" + (commits == null ? 0 : commits.size()) + ", commits=" + commits,
                commitsAvailable ? "" : "No commit history was returned."
        );

        boolean commitHasAuthorMarker =
                commits != null
                        && !commits.isEmpty()
                        && commits.get(0).contains("[")
                        && commits.get(0).contains("]");

        runTest(
                10,
                "Commit entries include author marker",
                commitHasAuthorMarker ? TestStatus.PASS : TestStatus.FAIL,
                "firstCommit=" + (commits == null || commits.isEmpty() ? null : commits.get(0)),
                commitHasAuthorMarker ? "" : "Commit entries did not include an author marker."
        );

        List<Map.Entry<String, Integer>> topCommitters = sync.fetchTopCommitters(testUser, testRepo);
        boolean committersAvailable = topCommitters != null && !topCommitters.isEmpty();

        runTest(
                11,
                "Top committers are available",
                committersAvailable ? TestStatus.PASS : TestStatus.FAIL,
                "topCommitters=" + topCommitters,
                committersAvailable ? "" : "No committer data was returned."
        );

        boolean persistenceReady = projectDb.performIntegrityAudit(testRepo, commits);

        runTest(
                12,
                "Project data maps to persistence format",
                persistenceReady ? TestStatus.PASS : TestStatus.FAIL,
                "repo=" + testRepo + ", commitCount=" + (commits == null ? 0 : commits.size()),
                persistenceReady ? "" : "projectService.performIntegrityAudit() did not pass."
        );

        runTest(
                13,
                "Real Supabase database write from Java harness",
                TestStatus.FAIL_DESCOPED,
                "repo=" + testRepo + ", table=projects",
                "Descoped. The Java harness validates mapping only. It does not insert, update, delete, or verify rows in Supabase."
        );

        skillVerifyService.verifyResult verifyResult = verifier.verifyProjectSkills(testRepo);

        boolean simulatedVerifierWorks =
                verifyResult != null
                        && verifyResult.status != null
                        && verifyResult.confidenceScore >= 0.0;

        runTest(
                14,
                "Simulated AI verifier returns result object",
                simulatedVerifierWorks ? TestStatus.PASS : TestStatus.FAIL,
                "status=" + (verifyResult == null ? null : verifyResult.status)
                        + ", confidenceScore=" + (verifyResult == null ? null : verifyResult.confidenceScore),
                simulatedVerifierWorks ? "" : "skillVerifyService.verifyProjectSkills() did not return a valid simulated result."
        );

        runTest(
                15,
                "Real Gemini Pro skill verification",
                TestStatus.FAIL_DESCOPED,
                "repo=" + testRepo + ", model=Gemini Pro",
                "Descoped. Gemini Pro is not integrated. No real model API call, prompt, evidence packet, response parsing, or model-backed confidence score is implemented."
        );

        notification emailNotification = notificationFactory.createNotification("email");
        boolean emailNotificationCreated = emailNotification != null;

        if (emailNotificationCreated) {
            emailNotification.send(
                    "Test email notification from Portfol.io harness.",
                    testEmail
            );
        }

        runTest(
                16,
                "Email notification object can be created",
                emailNotificationCreated ? TestStatus.PASS : TestStatus.FAIL,
                "type=email, recipient=" + testEmail,
                emailNotificationCreated ? "" : "notificationFactory.createNotification(\"email\") returned null."
        );

        runTest(
                17,
                "Real email delivery",
                TestStatus.FAIL_DESCOPED,
                "recipient=" + testEmail,
                "Descoped. The notification class simulates sending only. SMTP, Resend, SendGrid, Supabase email templates, and inbox delivery are not integrated in this Java harness."
        );

        notification pushNotification = notificationFactory.createNotification("push");
        boolean pushNotificationCreated = pushNotification != null;

        if (pushNotificationCreated) {
            pushNotification.send(
                    "Test push notification from Portfol.io harness.",
                    "device_token_abc123"
            );
        }

        runTest(
                18,
                "Push notification object can be created",
                pushNotificationCreated ? TestStatus.PASS : TestStatus.FAIL,
                "type=push, deviceToken=device_token_abc123",
                pushNotificationCreated ? "" : "notificationFactory.createNotification(\"push\") returned null."
        );

        runTest(
                19,
                "Real push notification delivery",
                TestStatus.FAIL_DESCOPED,
                "deviceToken=device_token_abc123",
                "Descoped. Firebase, APNs, browser push subscriptions, and real device delivery are not integrated."
        );

        boolean unknownTypeHandled = false;

        try {
            notification unknownNotification = notificationFactory.createNotification("sms");
            unknownTypeHandled = unknownNotification == null;
        } catch (Exception exception) {
            unknownTypeHandled = true;
        }

        runTest(
                20,
                "Unknown notification type is handled",
                unknownTypeHandled ? TestStatus.PASS : TestStatus.FAIL,
                "type=sms",
                unknownTypeHandled ? "" : "Unknown notification type created a valid notification unexpectedly."
        );

        System.out.println();
        System.out.println("==================================================");
        System.out.println(" Final Result");
        System.out.println("==================================================");
        System.out.println("Passed: " + passed);
        System.out.println("Failed: " + failed);
        System.out.println("Failed Because Descoped: " + descopedFailed);
        System.out.println("Total Tests: " + (passed + failed));
        System.out.println("==================================================");

        if (failed == descopedFailed) {
            System.out.println("Overall: PASS WITH EXPECTED DESCOPED FAILURES");
        } else {
            System.out.println("Overall: REVIEW REQUIRED");
        }

        System.out.println("==================================================");
    }
}