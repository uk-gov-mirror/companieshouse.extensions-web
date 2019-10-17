import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as nunjucks from "nunjucks";
import * as path from "path";
import authenticate from "./authentication/middleware/index";
import monitor from "./authentication/middleware/monitor";
import errorHandlers from "./controllers/error.controller";
import * as pageURLs from "./model/page.urls";
import sessionMiddleware from "./session/middleware";
import history from "./session/middleware/history";
import {appRouter} from "./routes/routes";
import accessibilityRoutes from "./routes/accessibility.routes";
import {ERROR_SUMMARY_TITLE} from "./model/error.messages";
import {PIWIK_SITE_ID, PIWIK_URL} from "./session/config";
import activeFeature from "./feature.flag";

const app = express();

// view engine setup
const env = nunjucks.configure([
    "views",
    "node_modules/govuk-frontend/",
    "node_modules/govuk-frontend/components/",
  ], {
    autoescape: true,
    express: app,
});
env.addGlobal("CDN_URL", process.env.CDN_HOST);
env.addGlobal("ERROR_SUMMARY_TITLE", ERROR_SUMMARY_TITLE);
env.addGlobal("PIWIK_URL", PIWIK_URL);
env.addGlobal("PIWIK_SITE_ID", PIWIK_SITE_ID);

app.enable("trust proxy");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(`${pageURLs.EXTENSIONS}/*`, authenticate);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

if (activeFeature(process.env.ACCESSIBILITY_TEST_MODE)) {
  app.use(pageURLs.EXTENSIONS, accessibilityRoutes);
} else {
  app.use(`${pageURLs.EXTENSIONS}/*`, monitor);
  app.use(`${pageURLs.EXTENSIONS}/*`, history);
}
app.use(pageURLs.EXTENSIONS, appRouter);
app.use(...errorHandlers);

export default app;
