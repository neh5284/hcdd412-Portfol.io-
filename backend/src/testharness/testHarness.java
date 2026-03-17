package testharness;

import portfolio.identity.*;
import portfolio.integration.*;
import portfolio.verification.*;
import portfolio.core.*;
import portfolio.publishing.*;

public class testHarness {
    public static void main(String[] args)
    {
        System.out.println("--- Starting Portfol.io Automated System Test ---");

        // 1. Test Identity Module
        authService auth = new authService();
        String session = auth.login("student@uni.edu", "pass123");
        if (session != null)
            System.out.println("PASS: Auth API Exercised.");

        // 2. Test Integrations Module
        syncService sync = new syncService();
        if (sync.importProjects("USR1", "GitHub"))
        {
            System.out.println("PASS: Sync API Exercised.");
        }

        // 3. Test Verification Module (Complex Logic)
        skillVerifyService verify = new skillVerifyService();
        verifyResult res = verify.verifyProjectSkills("PROJ_01");
        if (res.confidenceScore > 0.9)
        {
            System.out.println("PASS: Verification API Exercised.");
        }

        // 4. Test Core Module (Narrative)
        projectService project = new projectService();
        caseStudy section = new caseStudy("Problem", "Process", "Outcome");
        if (project.addNarrativeSection("PROJ_01", section))
        {
            System.out.println("PASS: Core Narrative API Exercised.");
        }

        // 5. Test Publishing Module
        publishService pub = new publishService();
        String url = pub.createShareLink("PROJ_01", "Public");
        System.out.println("PASS: Publishing API Exercised. URL: " + url);

        System.out.println("--- All Integration Tests Completed ---");
    }
}
