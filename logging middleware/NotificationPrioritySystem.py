import heapq
from datetime import datetime

class Notification:
    WEIGHTS = {
        "placement": 3,
        "result": 2,
        "event": 1
    }

    def __init__(self, notification_id, category, timestamp, is_read=False):
        self.notification_id = notification_id
        self.category = category.lower()
        self.timestamp = timestamp
        self.is_read = is_read

    def priority_score(self):
        weight = self.WEIGHTS.get(self.category, 0)
        return weight * 10**12 + self.timestamp


class NotificationSystem:
    def __init__(self):
        self.heap = []

    def add_notification(self, notification):
        if not notification.is_read:
            score = notification.priority_score()
            heapq.heappush(self.heap, (-score, notification))

    def get_top_notifications(self, n=10):
        top = heapq.nsmallest(n, self.heap)
        return [item[1] for item in top]


if __name__ == "__main__":
    system = NotificationSystem()

    now = int(datetime.now().timestamp())

    system.add_notification(Notification("N1", "placement", now - 10))
    system.add_notification(Notification("N2", "result", now - 20))
    system.add_notification(Notification("N3", "event", now - 30))
    system.add_notification(Notification("N4", "placement", now - 40))
    system.add_notification(Notification("N5", "result", now - 50))
    system.add_notification(Notification("N6", "placement", now - 60))
    system.add_notification(Notification("N7", "event", now - 70))
    system.add_notification(Notification("N8", "placement", now - 5))
    system.add_notification(Notification("N9", "result", now - 15))
    system.add_notification(Notification("N10", "event", now - 25))
    system.add_notification(Notification("N11", "placement", now))

    top_notifications = system.get_top_notifications(10)

    print("Top 10 Unread Notifications:")
    for n in top_notifications:
        print(
            f"ID={n.notification_id}, "
            f"Category={n.category}, "
            f"Timestamp={n.timestamp}"
        )