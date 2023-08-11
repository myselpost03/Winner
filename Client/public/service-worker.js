//! Cache file
const CACHE_NAME = "my-cache-v1";
const clientFolderURL = "/Client";
const staticAssets = [
  "/",
  "/static/css/main.css",
  "/static/js/main.js",
  "/static/js/bundle.js",
  "/static/media/logo.d793c24c66e6bfd203fc.png",
  "/static/media/thirdselfie.e7e8e6989d1743677b7c.jpg",
  "/static/media/seventhselfie.b61fd354302463ca5d37.jpg",
  "/static/media/secondselfie.50aa5a634a470c4f7b30.jpg",
  "/static/media/fourthselfie.a274b42daf413a9246e9.jpg",
  clientFolderURL,
];

const self = this;

//! Installation
self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(staticAssets))
  );
  self.skipWaiting();
});

//! Activation
self.addEventListener("activate", (evt) => {
  const cacheWhiteList = [CACHE_NAME];
  evt.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((item) => {
          if (!cacheWhiteList.includes(item)) {
            return caches.delete(item);
          }
          return item;
        })
      )
    )
  );
});

//! Push notification
self.addEventListener("push", (event) => {
  let title = "MySelpost";
  let body = "New notification";
  if (event.data) {
    const data = event.data.json();
    if (data.title) {
      title = data.title;
    }
    if (data.body) {
      body = data.body;
    }
    if (data.customTitle) {
      title = data.customTitle;
    }
    if (data.customBody) {
      body = data.customBody;
    }
  }

  const options = {
    icon: "image.png",
    badge: "Image.png",
    vibrate: [200, 100, 200],
    requireInteraction: true,
    body: body,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

//! On message event called
self.addEventListener("message", (event) => {
  if (event.data && event.data.title && event.data.body) {
    const notificationOptions = {
      icon: "Image.png",
      badge: "Image.png",
      vibrate: [200, 100, 200],
      requireInteraction: true,
      body: event.data.body,
    };

    self.registration.showNotification(event.data.title, notificationOptions);
  }
});

//! On notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: "window" })
      .then((clientList) => {
        let urlToOpen = "https://myselpost.com/home";
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          const newWindow = self.clients.openWindow(urlToOpen);
          newWindow.then((client) => {
            if (client) {
              const notificationOptions = {
                ...event.notification.options,
                requireInteraction: false,
              };
              client.postMessage({ notificationOptions });
            }
          });
        }
      })
  );
});

//! Push subscription change
self.addEventListener("pushsubscriptionchange", async (event) => {
  const newSubscription = await event.target.registration.pushManager.subscribe();
  const subscriptionData = {
    endpoint: newSubscription.endpoint,
    keys: {
      p256dh: newSubscription.getKey("p256dh"),
      auth: newSubscription.getKey("auth"),
    },
  };

  const updateSubscription = (url) => {
    return fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscriptionData),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Subscription updated successfully");
        } else {
          console.error("Failed to update subscription");
        }
      })
      .catch((error) => {
        console.error("Error updating subscription:", error);
      });
  };

  const updateSubscriptions = async () => {
    await Promise.all([
      updateSubscription("http://localhost:5000/api/fireNotifications/update-subscription"),
      updateSubscription("http://localhost:5000/api/notifications/update-msg-subscription"),
      updateSubscription("http://localhost:5000/api/userlist/update-subscription"),
    ]);
  };

  event.waitUntil(updateSubscriptions());
});
