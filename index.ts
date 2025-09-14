import dotenv from "dotenv";
dotenv.config();

import express from "express";
import router from "./routes/router";
import errorHandler from "./middleware/errorHandler";

const PORT: number = Number(process.env.PORT) || 8080;

const app = express();

app.use(express.json());
app.use("/api", router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
