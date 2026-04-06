package portfolio.integration;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class ImportReport {
    private final String userId;
    private final String provider;
    private final List<String> previewItems;
    private final List<String> importedItems;
    private final List<Map<String, String>> repositoryDetails;
    private final boolean success;

    public ImportReport(String userId, String provider, List<String> previewItems, List<String> importedItems, List<Map<String, String>> repositoryDetails, boolean success) {
        this.userId = userId;
        this.provider = provider;
        this.previewItems = new ArrayList<>(previewItems);
        this.importedItems = new ArrayList<>(importedItems);
        this.repositoryDetails = new ArrayList<>(repositoryDetails);
        this.success = success;
    }

    public String getUserId() {
        return userId;
    }

    public String getProvider() {
        return provider;
    }

    public List<String> getPreviewItems() {
        return Collections.unmodifiableList(previewItems);
    }

    public List<String> getImportedItems() {
        return Collections.unmodifiableList(importedItems);
    }

    public List<Map<String, String>> getRepositoryDetails() {
        return Collections.unmodifiableList(repositoryDetails);
    }

    public boolean isSuccess() {
        return success;
    }
}
