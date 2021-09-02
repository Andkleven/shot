import "firebase/messaging";
import firebase from "firebase/app";
import localforage from "localforage";

const firebaseCloudMessaging = {
  tokenInlocalforage: async () => {
    return localforage.getItem("fcm_token");
  },

  init: async function () {
    firebase.initializeApp({
      apiKey: "AIzaSyCpORT7Ds0y_KhxklVausKnWwz4X4Bmdr4",
      authDomain: "shot-next.firebaseapp.com",
      projectId: "shot-next",
      storageBucket: "shot-next.appspot.com",
      messagingSenderId: "233654909190",
      appId: "1:233654909190:web:b4b0edb689098143868687",
      measurementId: "G-YR2FKX37N0",
    });
    try {
      if ((await this.tokenInlocalforage()) !== null) {
        localforage.removeItem("fcm_token");
        // return false;
      }

      const messaging = firebase.messaging();
      await Notification.requestPermission();
      const token = await messaging.getToken({
        vapidKey:
          "BPsAGThS33gPhpkWALNwHa6hQUQXLGAZRnH8qLzLT352NUm3Tnx6dTeVA-_vMsol-aINctu85jzWzmkY9fppTis",
      });

      localforage.setItem("fcm_token", token);
      console.log("fcm_token", token);
      return token;
    } catch (error) {
      console.error(error);
    }
  },
};

export { firebaseCloudMessaging };
