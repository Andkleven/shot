import { initializeApp } from "firebase/app";
import localforage from "localforage";
import { getToken } from "firebase/messaging";

const app = initializeApp({
  apiKey: "AIzaSyCpORT7Ds0y_KhxklVausKnWwz4X4Bmdr4",
  authDomain: "shot-next.firebaseapp.com",
  projectId: "shot-next",
  storageBucket: "shot-next.appspot.com",
  messagingSenderId: "233654909190",
  appId: "1:233654909190:web:b4b0edb689098143868687",
  measurementId: "G-YR2FKX37N0",
});

const firebaseCloudMessaging = {
  tokenInlocalforage: async () => {
    return localforage.getItem("fcm_token");
  },

  init: async function () {
    try {
      if ((await this.tokenInlocalforage()) !== null) {
        localforage.removeItem("fcm_token");
        // return false;
      }
      console.log(2);
      await Notification.requestPermission();
      console.log(3);
      const token = await getToken(
        {
          app,
        },
        {
          vapidKey:
            "BPsAGThS33gPhpkWALNwHa6hQUQXLGAZRnH8qLzLT352NUm3Tnx6dTeVA-_vMsol-aINctu85jzWzmkY9fppTis",
        }
      );
      console.log(4);

      localforage.setItem("fcm_token", token);
      console.log("fcm_token", token);
      return token;
    } catch (error) {
      console.error(error);
    }
  },
};

export { firebaseCloudMessaging, app };
