/* global importScripts, firebase */
importScripts("https://www.gstatic.com/firebasejs/8.9.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.9.0/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyCpORT7Ds0y_KhxklVausKnWwz4X4Bmdr4",
  authDomain: "shot-next.firebaseapp.com",
  projectId: "shot-next",
  storageBucket: "shot-next.appspot.com",
  messagingSenderId: "233654909190",
  appId: "1:233654909190:web:b4b0edb689098143868687",
  measurementId: "G-YR2FKX37N0",
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: "/firebase-logo.png",
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log(event);
  return event;
});

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
  };
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
