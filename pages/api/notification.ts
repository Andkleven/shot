import type { NextApiRequest, NextApiResponse } from "next";
import webPush from "web-push";
import bodyParser from "body-parser";
import path from "path";

const publicKey =
  "BNyFFA_U1JhAvHw5l8WColvexjQyiKuNFbkkxZKcBmc-RmpNqMEkNHwBtAtwk0Wacib4VZ0ivdeALJ5USTqPXGc";
const privateKey = "-F4oQ1Y_oFRRKWXJbCMKhhO1exd_ojnSeyDvoXK_E0A";

webPush.setVapidDetails("mailto:example@yourdomain.org", publicKey, privateKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    const { subscription, title } = req.body;
    webPush
      .sendNotification(
        subscription,
        JSON.stringify({
          title,
          body: "Drikk! Drikk!",
          tag: title,
        })
      )
      .then((response) => {
        res.writeHead(response.statusCode, response.headers).end(response.body);
      })
      .catch((err) => {
        if ("statusCode" in err) {
          res.writeHead(err.statusCode, err.headers).end(err.body);
        } else {
          console.error(err);
          res.statusCode = 500;
          res.end();
        }
      });
  } else {
    res.statusCode = 405;
    res.end();
  }
}
