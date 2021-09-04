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
const base64ToUint8Array = (base64: string) => {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
const publicKey =
  "BNyFFA_U1JhAvHw5l8WColvexjQyiKuNFbkkxZKcBmc-RmpNqMEkNHwBtAtwk0Wacib4VZ0ivdeALJ5USTqPXGc";

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
  const max = 0.02;
  const min = 0.01;
  return (Math.random() * (max - min) + min) * 1000 * 60;
}
export function Index() {
  const [typeOfDrink, setTypeOfDrink] = useState<keyof State | "">("");
  const [isRunning, setIsRunning] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription>();

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
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: base64ToUint8Array(publicKey),
        });
        registration.addEventListener("message", function handler(event) {
          console.log(event);
        });
        setSubscription(sub);
      }
    }
  }, []);

  function startTime() {
    setIsRunning(true);
    const shotType = setNewDrink();
    setTimeout(() => {
      fetch("/api/notification", {
        method: "POST",
        body: JSON.stringify({ subscription, title: shotType }),
        headers: {
          "content-type": "application/json",
        },
      });
      // if (Notification.permission === "granted") {
      //   navigator.serviceWorker.getRegistration().then(function (registration) {
      //     registration?.showNotification(shotType, {
      //       body: "Drikk! Drikk!",
      //       image: `shot/${shotType}.jpg`,
      //       tag: shotType,
      //       vibrate: [200, 100, 200, 100, 200, 100, 200],
      //       actions: [{ action: "shot", title: "En til!!!" }],
      //       // sound: "212739__taira-komori__drinking2.mp3",
      //     });
      //   });
      // }
      // ServiceWorkerRegistration.showNotification(shotType, {
      //   body: "Drikk! Drikk!",
      //   image: `shot/${shotType}.jpg`,
      //   tag: shotType,
      //   vibrate: [200, 100, 200, 100, 200, 100, 200],
      //   sound: "212739__taira-komori__drinking2.mp3",
      // });
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
