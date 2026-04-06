package portfolio.notifications;

public class notificationFactory {
    public notification createNotification(String type) {
        if (type == null || type.isEmpty()) return null;

        switch (type.toLowerCase()) {
            case "email":
                return new emailNotification();
            case "push":
                return new pushNotification();
            default:
                throw new IllegalArgumentException("Unknown type: " + type);
        }
    }
}