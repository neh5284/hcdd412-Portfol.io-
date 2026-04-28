package portfolio.integration;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;

public class syncService {

    public Map<String, String> fetchRepoDetails(String repoName) {
        return fetchRepoDetails("neh5284", repoName);
    }

    public java.util.List<String> preview(String userId, String provider) {
        System.out.println("[API] Querying " + provider + " for PSU User: " + userId);

        return java.util.Arrays.asList(
                "Portfol.io-MVP",
                "NodeJS-Study-Guide",
                "Cyber-Threat-Assessment",
                "HCDD-Bio-Integration"
        );
    }

    public boolean importProjects(String userId, String provider) {
        List<String> data = preview(userId, provider);
        System.out.println("[DATA] Successfully imported " + data.size() + " repositories.");
        return true;
    }

    public List<String> fetchDynamicCommits(String user, String repo) {
        List<String> logs = new ArrayList<>();

        try {
            URL url = new URL("https://api.github.com/repos/" + user + "/" + repo + "/commits?per_page=100");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setConnectTimeout(3000);
            conn.setReadTimeout(3000);
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/vnd.github.v3+json");
            conn.setRequestProperty("User-Agent", "HCDD-412-Test-Harness");

            if (conn.getResponseCode() == 200) {
                Scanner sc = new Scanner(conn.getInputStream());
                StringBuilder inline = new StringBuilder();

                while (sc.hasNext()) {
                    inline.append(sc.nextLine());
                }

                sc.close();

                String json = inline.toString();
                String[] entries = json.split("\"commit\":\\{");
                Set<String> uniqueMessages = new HashSet<>();

                for (int i = 1; i < entries.length && logs.size() < 10; i++) {
                    String block = entries[i];

                    String author = "Unknown";
                    String[] nameSplit = block.split("\"name\":\"");

                    if (nameSplit.length > 1) {
                        author = nameSplit[1].split("\"")[0];
                    }

                    String msg = "No message";
                    String[] msgSplit = block.split("\"message\":\"");

                    if (msgSplit.length > 1) {
                        msg = msgSplit[1].split("\"")[0];
                    }

                    msg = msg.replace("\\n", " ").replace("\\r", "").replace("\\", "");

                    if (!uniqueMessages.contains(msg)) {
                        uniqueMessages.add(msg);
                        logs.add(msg + " - [" + author + "]");
                    }
                }
            } else {
                System.out.println("[API] Failed to fetch commits. HTTP Code: " + conn.getResponseCode());
            }
        } catch (Exception e) {
            System.err.println("Network Trace: " + e.getMessage());
        }

        if (logs.isEmpty()) {
            logs.add("Initial portfolio dashboard implementation - [Nathan Hinkle]");
            logs.add("Connect Supabase project data - [Nathan Hinkle]");
            logs.add("Add public profile filters - [Nathan Hinkle]");
        }

        return logs;
    }

    public List<Map.Entry<String, Integer>> fetchTopCommitters(String user, String repo) {
        Map<String, Integer> committerCounts = new HashMap<>();

        try {
            URL url = new URL("https://api.github.com/repos/" + user + "/" + repo + "/commits?per_page=100");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setConnectTimeout(3000);
            conn.setReadTimeout(3000);
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/vnd.github.v3+json");
            conn.setRequestProperty("User-Agent", "HCDD-412-Test-Harness");

            if (conn.getResponseCode() == 200) {
                Scanner sc = new Scanner(conn.getInputStream());
                StringBuilder inline = new StringBuilder();

                while (sc.hasNext()) {
                    inline.append(sc.nextLine());
                }

                sc.close();

                String json = inline.toString();
                String[] entries = json.split("\"author\":\\{\"name\":\"");

                for (int i = 1; i < entries.length; i++) {
                    String name = entries[i].split("\"")[0];
                    committerCounts.put(name, committerCounts.getOrDefault(name, 0) + 1);
                }
            } else {
                System.out.println("[API] Failed to fetch committers. HTTP Code: " + conn.getResponseCode());
            }
        } catch (Exception e) {
            System.err.println("Network Trace: " + e.getMessage());
        }

        if (committerCounts.isEmpty()) {
            committerCounts.put("Nathan Hinkle", 3);
            committerCounts.put("Portfol.io Team", 2);
        }

        List<Map.Entry<String, Integer>> sorted = new ArrayList<>(committerCounts.entrySet());
        sorted.sort((a, b) -> b.getValue().compareTo(a.getValue()));

        return sorted.size() > 10 ? sorted.subList(0, 10) : sorted;
    }

    public Map<String, String> fetchRepoDetails(String userId, String repoName) {
        System.out.println("[NETWORK] GET https://api.github.com/repos/" + userId + "/" + repoName);

        Map<String, String> details = new HashMap<>();

        details.put("name", repoName);
        details.put("owner", userId);

        try {
            URL url = new URL("https://api.github.com/repos/" + userId + "/" + repoName);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setConnectTimeout(3000);
            conn.setReadTimeout(3000);
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/vnd.github.v3+json");
            conn.setRequestProperty("User-Agent", "HCDD-412-Test-Harness");

            if (conn.getResponseCode() == 200) {
                Scanner sc = new Scanner(conn.getInputStream());
                StringBuilder inline = new StringBuilder();

                while (sc.hasNext()) {
                    inline.append(sc.nextLine());
                }

                sc.close();

                String json = inline.toString();

                details.put("language", extractJsonValue(json, "language"));
                details.put("stars", extractJsonValue(json, "stargazers_count"));
                details.put("forks", extractJsonValue(json, "forks_count"));
                details.put("last_commit", extractJsonValue(json, "updated_at"));
            } else {
                System.out.println("[API] Failed to fetch repo details. HTTP Code: " + conn.getResponseCode());

                details.put("language", "TypeScript");
                details.put("stars", "0");
                details.put("forks", "0");
                details.put("last_commit", "offline-fixture");
            }
        } catch (Exception e) {
            System.err.println("Network Trace: " + e.getMessage());

            details.put("language", "TypeScript");
            details.put("stars", "0");
            details.put("forks", "0");
            details.put("last_commit", "offline-fixture");
        }

        return details;
    }

    private String extractJsonValue(String json, String key) {
        String search = "\"" + key + "\":";
        int index = json.indexOf(search);

        if (index == -1) {
            return "N/A";
        }

        int start = index + search.length();

        while (start < json.length() && Character.isWhitespace(json.charAt(start))) {
            start++;
        }

        if (json.startsWith("null", start)) {
            return "N/A";
        }

        boolean isString = json.charAt(start) == '"';

        if (isString) {
            start++;
        }

        int end = start;

        if (isString) {
            end = json.indexOf('"', start);
        } else {
            while (
                    end < json.length()
                            && json.charAt(end) != ','
                            && json.charAt(end) != '}'
                            && !Character.isWhitespace(json.charAt(end))
            ) {
                end++;
            }
        }

        if (end == -1) {
            return "N/A";
        }

        return json.substring(start, end);
    }
}