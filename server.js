global.Promise = require("bluebird");
const { join } = require("path");

const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const csurf = require("csurf");
const session = require("express-session");
const dotenv = require("dotenv");

const allRoutes = require("./src/routes/all-routes");
const serverErrorHandler = require("./errors/server-error-handler");

const databaseConnection = require("./config/database-connection");
const sessionObject = require("./config/session-config");
const checkCsrfToken = require("./config/check-csrf-token");

const app = express();
dotenv.config();

app.set("view engine", "ejs");
app.set("views", join(__dirname, "./src/views"));

app.use(helmet());
app.use(session(sessionObject()));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(csurf());
app.use(checkCsrfToken);
app.use(express.static(join(__dirname, "./src/public")));
app.use(allRoutes);
app.use(serverErrorHandler);

try {
  databaseConnection(() => {
    app.listen(process.env.PORT, () => {
      console.log(`APP running on PORT: ${process.env.PORT}`);
      console.log(`Ambiente de execucao: ${process.env.NODE_ENV}`);
    });
  });
} catch (error) {
  console.log("****> Database connection error. Application will not start.\n");
  console.error(error);
}
