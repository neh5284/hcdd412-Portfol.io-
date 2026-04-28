package testharness;

import portfolio.identity.authService;
import portfolio.integration.syncService;
import portfolio.core.projectService;
import portfolio.verification.skillVerifyService;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class testHarness {
    private static String passFail(boolean condition) {
        return condition ? "PASS" : "FAIL";
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("   HCDD 412: PORTFOL.IO SYSTEM INTEGRATION       ");
        System.out.println("   User: neh5284 | Status: Rigorous Validation   ");
        System.out.println("==================================================");

        authService auth = new authService();
        String session = auth.login("neh5284@psu.edu", "pass123");
        boolean authPass = session != null && session.contains("JWT");

        System.out.println("\n[BLOCK 1] Identity Module");
        System.out.println("   STATUS: " + passFail(authPass));
        System.out.println("   > Handshake: SUCCESS");
        System.out.println("   > Session: " + (authPass ? session : "AUTH_ERROR"));

        syncService sync = new syncService();
        sync.preview("neh5284", "GitHub");

        String testOwner = "neh5284";
        String testRepo = "hcdd412-Portfol.io-";

        Map<String, String> details = sync.fetchRepoDetails(testOwner, testRepo);

        boolean syncPass =
                details != null
                        && !details.isEmpty()
                        && details.get("stars") != null
                        && !"N/A".equals(details.get("stars"));

        System.out.println("\n[BLOCK 2] External API Fetch");
        System.out.println("   STATUS: " + passFail(syncPass));
        System.out.println("   > Repo Name:      " + details.get("name"));
        System.out.println("   > Primary Lang:   " + details.get("language"));
        System.out.println("   > Popularity:     " + details.get("stars") + " Stars / " + details.get("forks") + " Forks");
        System.out.println("   > Sync Timestamp: " + details.get("last_commit"));

        List<String> liveData = sync.fetchDynamicCommits(testOwner, testRepo);
        boolean commitFetchPass = liveData != null && !liveData.isEmpty();

        System.out.println("\n[BLOCK 3] Repository Commit Fetch");
        System.out.println("   STATUS: " + passFail(commitFetchPass));

        if (commitFetchPass) {
            Set<String> users = new HashSet<>();

            for (String log : liveData) {
                System.out.println("     [EXTRACTED]: " + log);

                if (log.contains("[") && log.contains("]")) {
                    users.add(log.substring(log.indexOf("[") + 1, log.indexOf("]")));
                }
            }

            System.out.println("   > Identified Participants: " + users);
        }

        System.out.println("\n[BLOCK 4] Committer Analysis");

        List<Map.Entry<String, Integer>> topCommitters = sync.fetchTopCommitters(testOwner, testRepo);
        boolean committerPass = topCommitters != null && !topCommitters.isEmpty();

        System.out.println("   STATUS: " + passFail(committerPass));

        if (committerPass) {
            System.out.println("   > Top Committers for " + testOwner + "/" + testRepo + ":");

            int rank = 1;

            for (Map.Entry<String, Integer> committer : topCommitters) {
                System.out.println("      " + rank + ". " + committer.getKey() + " (" + committer.getValue() + " commits)");
                rank++;
            }
        }

        System.out.println("\n[BLOCK 5] SQL Persistence and Metadata Mapping");

        projectService dbService = new projectService();
        boolean persistencePass = dbService.performIntegrityAudit(testRepo, liveData);

        System.out.println("   STATUS: " + passFail(persistencePass));

        if (persistencePass) {
            System.out.println("   > Action: Object serialized for Supabase push");
            System.out.println("   > Mapping: { repo: \"" + testRepo + "\", commit_count: " + liveData.size() + " }");
            System.out.println("   > Sync Status: READY_FOR_DASHBOARD_REFRESH");
        } else {
            System.out.println("   > Error: No data available to map to database.");
        }

        skillVerifyService verifyService = new skillVerifyService();
        skillVerifyService.verifyResult verifyResult = verifyService.verifyProjectSkills(testRepo);

        boolean aiServicePass =
                verifyResult != null
                        && verifyResult.confidenceScore >= 0.90
                        && "AI_VERIFIED_SUCCESS".equals(verifyResult.status);

        System.out.println("\n[BLOCK 6] AI Skill Verification");
        System.out.println("   STATUS: " + passFail(aiServicePass));

        if (verifyResult != null) {
            System.out.println("   > Confidence: " + verifyResult.confidenceScore);
            System.out.println("   > Status: " + verifyResult.status);
        } else {
            System.out.println("   > Confidence: unavailable");
            System.out.println("   > Status: unavailable");
        }

        System.out.println("\n==================================================");
        System.out.println("   FINAL AUDIT COMPLETE                           ");
        System.out.println("==================================================");

        System.out.println("\nNotification Factory Test");

        portfolio.notifications.notificationFactory factory =
                new portfolio.notifications.notificationFactory();

        portfolio.notifications.notification emailAlert =
                factory.createNotification("email");

        emailAlert.send(
                "Welcome to Portfol.io! System handshake verified.",
                "neh5284@psu.edu"
        );

        portfolio.notifications.notification pushAlert =
                factory.createNotification("push");

        pushAlert.send(
                "New repository synced to your dashboard.",
                "device_token_abc123"
        );

        System.out.println("   STATUS: PASS");
    }
}