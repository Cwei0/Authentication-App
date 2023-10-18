import { env } from "process";
import App from "./utils";
import log from "./utils/logger";
import { config } from "dotenv";

config();

const app = new App();
const server = app.start();
const port = env.PORT;

server.listen(port, async () => {
  await app.connectToDb();
  log.info(`App is running on ${port}`);
});
