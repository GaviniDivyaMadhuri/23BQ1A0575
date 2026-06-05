import java.util.*;

class Notification {
    String id;
    String type; // Placement, Result, Event
    long timestamp;
    boolean isRead;

    public Notification(String id, String type, long timestamp, boolean isRead) {
        this.id = id;
        this.type = type;
        this.timestamp = timestamp;
        this.isRead = isRead;
    }

    public int getWeight() {
        switch (type.toLowerCase()) {
            case "placement":
                return 3;
            case "result":
                return 2;
            case "event":
                return 1;
            default:
                return 0;
        }
    }

    public double getPriorityScore() {
        return getWeight() * 1_000_000_000.0 + timestamp;
    }

    @Override
    public String toString() {
        return "Notification{" +
                "id='" + id + '\'' +
                ", type='" + type + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}

public class NotificationPrioritySystem {

    private final PriorityQueue<Notification> heap;

    public NotificationPrioritySystem() {
        heap = new PriorityQueue<>(
                (a, b) -> Double.compare(
                        b.getPriorityScore(),
                        a.getPriorityScore()
                )
        );
    }

    public void addNotification(Notification notification) {
        if (!notification.isRead) {
            heap.offer(notification);
        }
    }

    public List<Notification> getTopNotifications(int n) {
        List<Notification> result = new ArrayList<>();
        List<Notification> temp = new ArrayList<>();

        int count = 0;

        while (!heap.isEmpty() && count < n) {
            Notification current = heap.poll();
            result.add(current);
            temp.add(current);
            count++;
        }

        heap.addAll(temp);

        return result;
    }

    public static void main(String[] args) {

        NotificationPrioritySystem system = new NotificationPrioritySystem();

        long now = System.currentTimeMillis();

        system.addNotification(new Notification("N1", "Placement", now - 1000, false));
        system.addNotification(new Notification("N2", "Result", now - 2000, false));
        system.addNotification(new Notification("N3", "Event", now - 3000, false));
        system.addNotification(new Notification("N4", "Placement", now - 4000, false));
        system.addNotification(new Notification("N5", "Result", now - 5000, false));
        system.addNotification(new Notification("N6", "Placement", now - 6000, false));
        system.addNotification(new Notification("N7", "Event", now - 7000, false));
        system.addNotification(new Notification("N8", "Result", now - 8000, false));
        system.addNotification(new Notification("N9", "Placement", now - 9000, false));
        system.addNotification(new Notification("N10", "Event", now - 10000, false));
        system.addNotification(new Notification("N11", "Placement", now, false));

        List<Notification> top10 = system.getTopNotifications(10);

        System.out.println("Top 10 Notifications:");
        for (Notification n : top10) {
            System.out.println(n);
        }
    }
}