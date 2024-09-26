// service-worker.js
self.addEventListener('push', function (event) {
    const data = event.data.json();
    console.log('Push received:', data);

    const options = {
        body: data.body,
        icon: data.icon,
        badge: data.badge,
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
