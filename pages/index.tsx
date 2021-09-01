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
import { firebaseCloudMessaging, app } from "../utils/webPush";
import { onMessage } from "firebase/messaging";

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
  const max = 0.2;
  const min = 0.1;
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
    setTypeOfDrink(result[Math.floor(Math.random() * (result.length - 1))]);
  }

  useEffect(() => {
    navigator.serviceWorker.register("sw.js");
    Notification.requestPermission(function (result) {
      console.log(result);
    });
  }, []);

  function startTime() {
    setIsRunning(true);
    setNewDrink();
    setTimeout(() => {
      console.log(123);

      if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then(function (registration) {
          console.log(234);

          registration.showNotification("Vibration Sample", {
            body: "Buzz! Buzz!",
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            tag: "vibration-sample",
          });
        });
      }
      setIsRunning(false);
    }, getRandomTime());
  }

  return (
    <>
      {typeOfDrink === "" ? (
        <div className="center-context">
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
                new Notification("Hey");
              }}
            >
              Start
            </Button>
          </Grid>
        </div>
      ) : isRunning ? (
        // <FillView>
        <Typography variant="h1" color="error">
          🤪
        </Typography>
      ) : (
        // </FillView>
        <Drink drink={typeOfDrink} startTime={startTime} />
      )}
    </>
  );
}

export default Index;
