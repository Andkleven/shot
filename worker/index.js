// To disable all workbox logging during development, you can set self.__WB_DISABLE_DEV_LOGS to true
// https://developers.google.com/web/tools/workbox/guides/configure-workbox#disable_logging

// eslint-disable-next-line no-underscore-dangle,no-restricted-globals
self.__WB_DISABLE_DEV_LOGS = true;

("use strict");

self.addEventListener("push", function (event) {
  const data = JSON.parse(event.data.text());
  event.waitUntil(
    registration.showNotification(data.title, {
      body: data.body,
      tag: data.tag,
      image: `shot/${data.title}.jpg`,
      vibrate: [200, 100, 200, 100, 200, 100, 200],
      actions: [{ action: "shot", title: "En til!!!" }],
      sound: "212739__taira-komori__drinking2.mp3",
    })
  );
});
async function m(event) {
  // Exit early if we don't have access to the client.
  // Eg, if it's cross-origin.
  if (!event.clientId) return;

  // Get the client.
  const client = await clients.get(event.clientId);
  // Exit early if we don't get the client.
  // Eg, if it closed.
  if (!client) return;
  console.log(231);
  // Send a message to the client.
  client.postMessage({
    msg: "Hey I just got a fetch from you!",
    url: event.request.url,
  });
}

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        m(event);
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          // return client.focus();
        }
        // return clients.openWindow("/");
      })
  );
});
