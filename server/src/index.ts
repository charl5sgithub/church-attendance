import { env } from "./config/env";
import app from "./app";

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${env.port}`);
});
