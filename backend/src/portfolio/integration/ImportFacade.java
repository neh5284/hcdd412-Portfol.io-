package portfolio.integration;

import portfolio.core.projectService;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public class ImportFacade {
    private final syncService sync;
    private final projectService projects;

    public ImportFacade() {
        this(new syncService(), new projectService());
    }

    public ImportFacade(syncService sync, projectService projects) {
        this.sync = sync;
        this.projects = projects;
    }

    public List<String> previewImport(String userId, String provider, List<String> allowedTypes) {
        if (!isProviderSupported(provider) || userId == null || userId.isBlank()) {
            return Collections.emptyList();
        }

        List<String> availableItems = sync.preview(userId, provider);
        return applyFileTypeFilters(availableItems, allowedTypes);
    }

    public ImportReport importProjects(String userId, String provider, List<String> allowedTypes) {
        List<String> previewItems = previewImport(userId, provider, allowedTypes);
        List<Map<String, String>> details = new ArrayList<>();

        for (String item : previewItems) {
            details.add(sync.fetchRepoDetails(userId, item));
        }

        boolean imported = !previewItems.isEmpty() && projects.performIntegrityAudit(provider + "-import", previewItems);
        List<String> importedItems = imported ? new ArrayList<>(previewItems) : Collections.emptyList();

        return new ImportReport(userId, provider, previewItems, importedItems, details, imported);
    }

    public Map<String, String> importRepositoryDetails(String userId, String provider, String repoName) {
        if (!isProviderSupported(provider) || repoName == null || repoName.isBlank()) {
            return Collections.emptyMap();
        }
        return sync.fetchRepoDetails(userId, repoName);
    }

    public boolean isProviderSupported(String provider) {
        if (provider == null) {
            return false;
        }

        String normalizedProvider = provider.trim().toLowerCase(Locale.ROOT);
        return normalizedProvider.equals("github")
                || normalizedProvider.equals("figma")
                || normalizedProvider.equals("google drive")
                || normalizedProvider.equals("cloud storage");
    }

    private List<String> applyFileTypeFilters(List<String> items, List<String> allowedTypes) {
        if (items == null || items.isEmpty()) {
            return Collections.emptyList();
        }

        if (allowedTypes == null || allowedTypes.isEmpty()) {
            return new ArrayList<>(items);
        }

        List<String> normalizedTypes = new ArrayList<>();
        for (String type : allowedTypes) {
          if (type != null && !type.isBlank()) {
                normalizedTypes.add(type.trim().toLowerCase(Locale.ROOT));
            }
        }

        if (normalizedTypes.isEmpty()) {
            return new ArrayList<>(items);
        }

        List<String> filteredItems = new ArrayList<>();
        for (String item : items) {
            String itemType = resolveItemType(item);
            if (normalizedTypes.contains(itemType)) {
                filteredItems.add(item);
            }
        }
        return filteredItems;
    }

    private String resolveItemType(String itemName) {
        if (itemName == null || itemName.isBlank()) {
            return "other";
        }

        String normalizedName = itemName.toLowerCase(Locale.ROOT);

        if (normalizedName.endsWith(".fig") || normalizedName.contains("figma")) {
            return "design";
        }

        if (normalizedName.endsWith(".png") || normalizedName.endsWith(".jpg") || normalizedName.endsWith(".jpeg") || normalizedName.endsWith(".svg")) {
            return "image";
        }

        if (normalizedName.endsWith(".pdf") || normalizedName.endsWith(".doc") || normalizedName.endsWith(".docx") || normalizedName.endsWith(".txt")) {
            return "document";
        }

        return "repository";
    }
}
