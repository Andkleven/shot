import { useEffect, useState } from "react";
import {
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  Button,
  Alert,
} from "@material-ui/core";
import { drinks } from "../data/data";
import Drink from "../components/Drink";
// import { FillView } from "@phormix/ui";
import { firebaseCloudMessaging } from "../utils/webPush";
import "firebase/messaging";
import firebase from "firebase/app";

type State = Partial<
  {
    [drink in keyof typeof drinks]: boolean;
  }
>;
export function getTime(timeMin: number) {
  const time = new Date();
  time.setSeconds(time.getSeconds() + timeMin * 60);
  return time;
}

export function getRandomTime() {
  const max = 0.1;
  const min = 0.01;
  return (Math.random() * (max - min) + min) * 1000 * 60;
}
export function Index() {
  const [typeOfDrink, setTypeOfDrink] = useState<keyof State | "">("");
  const [isRunning, setIsRunning] = useState(false);

  const [shot, setShot] = useState<State>({});
  const [alert, setAlert] = useState(false);

  function setNewDrink() {
    const result = (Object.keys(shot) as (keyof typeof shot)[]).filter(
      (key) => shot[key] === true
    );
    const shotType = result[Math.floor(Math.random() * (result.length - 1))];
    setTypeOfDrink(shotType);
    return shotType;
  }
  useEffect(() => {
    setToken();
    async function setToken() {
      try {
        const token = await firebaseCloudMessaging.init();
        if (token) {
          console.log("token", token);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  useEffect(() => {
    // Register the service worker
    if ("serviceWorker" in navigator) {
      // Wait for the 'load' event to not block other work
      window.addEventListener("load", async () => {
        // Try to register the service worker.
        try {
          const reg = await navigator.serviceWorker.register(
            "service-worker.js"
          );
          console.log("Service worker registered! 😎", reg);
        } catch (err) {
          console.log("😥 Service worker registration failed: ", err);
        }
      });
    }

    // await navigator.serviceWorker.register("service-worker.js");
    // Notification.requestPermission(() => {
    //   navigator.serviceWorker.addEventListener(
    //     "notificationclick",
    //     (event) => {
    //       console.log(2435);
    //     }
    //   );
    // });

    // test();
  }, []);

  function startTime() {
    setIsRunning(true);
    const shotType = setNewDrink();
    setTimeout(() => {
      if (Notification.permission === "granted") {
        navigator.serviceWorker.getRegistration().then(function (registration) {
          registration?.showNotification(shotType, {
            body: "Drikk! Drikk!",
            image: `shot/${shotType}.jpg`,
            tag: shotType,
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            sound: "212739__taira-komori__drinking2.mp3",
          });
        });
      }
      setIsRunning(false);
    }, getRandomTime());
  }

  return (
    <div className="center-context">
      {typeOfDrink === "" ? (
        <Grid
          container
          direction="column"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Typography align="center" variant="h1" color="error">
            Shot Alert!
          </Typography>
          <Typography align="center" variant="h6" color="error">
            Huk av for tilgjenglig shots
          </Typography>
          <FormGroup>
            {(Object.keys(drinks) as (keyof typeof drinks)[]).map(
              (drink, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    checked={(shot[drink] as boolean) ?? false}
                    onChange={() =>
                      setShot((prevState) => {
                        return {
                          ...prevState,
                          [drink]: !prevState[drink] as boolean,
                        };
                      })
                    }
                    control={<Checkbox color="error" />}
                    label={drink}
                  />
                );
              }
            )}
            {alert && <Alert color="error">Velg en shot!</Alert>}
          </FormGroup>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              const result = (
                Object.keys(shot) as (keyof typeof shot)[]
              ).filter((key) => shot[key] === true);
              if (result.length === 0) {
                setAlert(true);
              } else {
                startTime();
              }
            }}
          >
            Start
          </Button>
        </Grid>
      ) : isRunning ? (
        <Typography variant="h1" color="error" className="center-context">
          🤪
        </Typography>
      ) : (
        <Drink drink={typeOfDrink} startTime={startTime} />
      )}
    </div>
  );
}

export default Index;
