import { drinks } from "../data/data";
import { Button, Grid, Typography } from "@material-ui/core";
import { getRandomTime } from "../pages/index";

export default function Drink({
  drink,
  startTime,
}: {
  drink: keyof typeof drinks;
  startTime: () => void;
}) {
  return (
    <Grid
      container
      direction="column"
      justifyContent="space-evenly"
      alignItems="center"
    >
      <Typography variant="h1" align="center">
        {drink}
      </Typography>

      {/* <audio autoPlay src="212739__taira-komori__drinking2.mp3" /> */}

      <iframe src={drinks[drink]} allowFullScreen></iframe>

      <Button
        size="large"
        variant="contained"
        color="error"
        onClick={() => startTime()}
      >
        En til!
      </Button>
    </Grid>
  );
}
