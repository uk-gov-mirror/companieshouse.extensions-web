import {NextFunction, Request, Response} from "express";
import app from "../../app";
import * as pageURLs from "../../model/page.urls";
import * as request from "supertest";
import {appRouter} from "../../routes/routes";
import {COOKIE_NAME} from "../../session/config";
import {loadSession} from "../../services/redis.service";
import {loadMockSession} from "../mock.utils";

jest.mock("../../services/redis.service");

const mockCacheService = (<unknown>loadSession as jest.Mock<typeof loadSession>);

const ERROR_404 = "Page not found";
const ERROR_500 = "Sorry, there is a problem with the service";

beforeEach(() => {
  mockCacheService.mockRestore();

  loadMockSession(mockCacheService);
});

describe("error controller", () => {

  appRouter.get("/error", (req: Request, res: Response, next: NextFunction) => {
    throw new Error("this simulates any type of error coming from the app");
  });

  it("should render the 404 template if a page is not found", async () => {
    const resp = await request(app)
      .get(pageURLs.NO_FOUND)
      .set("Cookie", [`${COOKIE_NAME}=123`]);

    expect(resp.status).toEqual(404);
    expect(resp.text).toContain(ERROR_404);
  });

  it("should render the error template for all other errors", async () => {
    const resp = await request(app)
      .get(pageURLs.EXTENSIONS + pageURLs.ERROR)
      .set("Referer", "/")
      .set("Cookie", [`${COOKIE_NAME}=123`]);

    expect(resp.status).toEqual(500);
    expect(resp.text).toContain(ERROR_500);
  });
});
