//index.js

const express = require("express");
const routes = require("./routes/router");
const errorHandler = require("./middleware/errorHandler");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use("/api", routes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
