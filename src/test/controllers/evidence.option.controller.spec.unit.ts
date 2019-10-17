import app from "../../app";
import * as request from "supertest";
import * as pageURLs from "../../model/page.urls";
import {COOKIE_NAME} from "../../session/config";
import {loadSession} from "../../services/redis.service";
import {loadMockSession} from "../mock.utils";
import {createHistoryIfNone} from "../../services/session.service";

jest.mock("../../services/redis.service");
jest.mock("../../services/session.service");

const mockCacheService = (<unknown>loadSession as jest.Mock<typeof loadSession>);
const mockCreateHistoryIfNone = (<unknown>createHistoryIfNone  as jest.Mock<typeof createHistoryIfNone>);

export const UPLOAD_EVIDENCE_DECISION_NOT_MADE = "You must tell us if you want to upload evidence";

beforeEach( () => {
  loadMockSession(mockCacheService);
  mockCreateHistoryIfNone.prototype.constructor.mockImplementation(() => {
    return {
      page_history:[],
    };
  });
});

describe("evidence option url tests", () => {
  it("should find evidence option page with get", async () => {
    const res = await request(app)
      .get(pageURLs.EXTENSIONS_EVIDENCE_OPTION)
      .set("Referer", "/")
      .set("Cookie", [`${COOKIE_NAME}=123`]);
    expect(res.status).toEqual(200);
  });

  it("should return 404 if evidence option page with put", async () => {
    const res = await request(app)
      .put(pageURLs.EXTENSIONS_EVIDENCE_OPTION)
      .set("Cookie", [`${COOKIE_NAME}=123`]);
    expect(res.status).toEqual(404);
  });
});

describe("evidence option validation tests", () => {
  it("should receive error message asking for a decision when it has not been made", async () => {
    const res = await request(app)
      .post(pageURLs.EXTENSIONS_EVIDENCE_OPTION)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_NAME}=123`]);
    expect(res.status).toEqual(200);
    expect(res.text).toContain(UPLOAD_EVIDENCE_DECISION_NOT_MADE);
  });

  it("should receive no error message asking for a decision when yes is selected", async () => {
    const res = await request(app)
      .post(pageURLs.EXTENSIONS_EVIDENCE_OPTION)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_NAME}=123`])
      .send({supportingEvidence: "yes"});
    expect(res.header.location).toEqual(pageURLs.EXTENSIONS_EVIDENCE_UPLOAD);
    expect(res.status).toEqual(302);
    expect(res.text).not.toContain(UPLOAD_EVIDENCE_DECISION_NOT_MADE);
  });

  it("should receive no error message asking for a decision when no is selected", async () => {
    const res = await request(app)
      .post(pageURLs.EXTENSIONS_EVIDENCE_OPTION)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_NAME}=123`])
      .send({supportingEvidence: "no"});
    expect(res.header.location).toEqual(pageURLs.EXTENSIONS_ADD_EXTENSION_REASON);
    expect(res.status).toEqual(302);
    expect(res.text).not.toContain(UPLOAD_EVIDENCE_DECISION_NOT_MADE);
  });
});

