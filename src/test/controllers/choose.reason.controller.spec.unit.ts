import app from "../../app";
import * as superTest from "supertest";
import * as pageURLs from "../../model/page.urls";
import {COOKIE_NAME} from "../../session/config";
import {loadSession} from "../../services/redis.service";
import {loadMockSession} from "../mock.utils";
import * as keys from "../../session/keys";
import Session from "../../session/session";
import {addExtensionReasonToRequest} from "../../client/apiclient";
import * as reasonService from "../../services/reason.service";

jest.mock("../../services/redis.service");
jest.mock("../../client/apiclient");
jest.mock("../../services/reason.service");

const mockCacheService = (<unknown>loadSession as jest.Mock<typeof loadSession>);
const mockApiClient = (<unknown>addExtensionReasonToRequest as jest.Mock<typeof addExtensionReasonToRequest>);
const mockGetCurrentReason = (<unknown>reasonService.getCurrentReason as jest.Mock<typeof reasonService.getCurrentReason>);
const mockDeleteReason = (<unknown>reasonService.deleteCurrentReason as jest.Mock<typeof reasonService.deleteCurrentReason>);

const EXTENSION_REASON_NOT_SELECTED = "You must select a reason";
const EXTENSION_OTHER_TEXT_NOT_PROVIDED = "You must tell us the reason";

beforeEach(() => {
  loadMockSession(mockCacheService);
  mockApiClient.mockClear();
  mockDeleteReason.mockClear();
  mockGetCurrentReason.mockClear();
});

describe("choose reason url tests", () => {

  it("should find choose reason page with get", async () => {
    const res = await superTest(app)
      .get(pageURLs.EXTENSIONS_CHOOSE_REASON)
      .set("Referer", "/")
      .set("Cookie", [`${COOKIE_NAME}=123`]);
    expect(res.status).toEqual(200);
  });

  it("should return 404 if choose reason page with put", async () => {
    const res = await superTest(app)
      .put(pageURLs.EXTENSIONS_CHOOSE_REASON)
      .set("Cookie", [`${COOKIE_NAME}=123`]);
    expect(res.status).toEqual(404);
  });
});

describe("choose reason validation tests", () => {

  it("should receive error message instructing user to select a reason when reason is undefined", async () => {
    const res = await superTest(app)
      .post(pageURLs.EXTENSIONS_CHOOSE_REASON)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_NAME}=123`]);
    expect(res.status).toEqual(200);
    expect(res.text).toContain(EXTENSION_REASON_NOT_SELECTED);
    expect(mockApiClient).not.toBeCalled();
  });

  it("should receive error message instructing user to tell the reason when other is selected with no description", async () => {
    const res = await superTest(app)
      .post(pageURLs.EXTENSIONS_CHOOSE_REASON)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_NAME}=123`])
      .send({extensionReason: "other"});
    expect(res.status).toEqual(200);
    expect(res.text).toContain(EXTENSION_OTHER_TEXT_NOT_PROVIDED);
    expect(mockApiClient).not.toBeCalled();
  });

  it("should receive error message instructing user to tell the reason when other is selected with blank description", async () => {
    const res = await superTest(app)
      .post(pageURLs.EXTENSIONS_CHOOSE_REASON)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_NAME}=123`])
      .send({
        extensionReason: "other",
        otherReason: " "
      });
    expect(res.status).toEqual(200);
    expect(res.text).toContain(EXTENSION_OTHER_TEXT_NOT_PROVIDED);
    expect(mockApiClient).not.toBeCalled();
  });

  it("should receive no error message when reason is given", async () => {
    mockCacheService.prototype.constructor.mockImplementation(dummySession);
    mockApiClient.prototype.constructor.mockReturnValueOnce({id: "1234"});
    mockGetCurrentReason.prototype.constructor.mockReturnValueOnce({reason_status: "COMPLETED"});
    const res = await superTest(app)
      .post(pageURLs.EXTENSIONS_CHOOSE_REASON)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_NAME}=123`])
      .send({extensionReason: "illness"});
    expect("/" + res.header.location).toEqual(pageURLs.REASON_ILLNESS);
    expect(res.status).toEqual(302);
    expect(res.text).not.toContain(EXTENSION_REASON_NOT_SELECTED);
    expect(res.text).not.toContain(EXTENSION_OTHER_TEXT_NOT_PROVIDED);
    expect(mockApiClient).toBeCalledWith("00006400", "ACCESS_TOKEN", "12345", "illness");
    expect(mockDeleteReason).not.toHaveBeenCalled();
    expect(mockGetCurrentReason).toHaveBeenCalled();
  });

  it("should receive no error message when reason is other and description is given", async () => {
    mockCacheService.prototype.constructor.mockImplementation(dummySession);
    mockApiClient.prototype.constructor.mockReturnValueOnce({id: "1234"});
    const res = await superTest(app)
      .post(pageURLs.EXTENSIONS_CHOOSE_REASON)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_NAME}=123`])
      .send({
        extensionReason: "other",
        otherReason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      });
    expect("/" + res.header.location).toEqual(pageURLs.REASON_OTHER);
    expect(res.status).toEqual(302);
    expect(res.text).not.toContain(EXTENSION_REASON_NOT_SELECTED);
    expect(res.text).not.toContain(EXTENSION_OTHER_TEXT_NOT_PROVIDED);
    expect(mockApiClient).toBeCalledWith("00006400", "ACCESS_TOKEN", "12345", 
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
    expect(mockDeleteReason).not.toHaveBeenCalled();
    expect(mockGetCurrentReason).toHaveBeenCalled();
  });

  it("should call delete reason if current reason in draft mode", async () => {
    mockCacheService.prototype.constructor.mockImplementation(dummySession);
    mockApiClient.prototype.constructor.mockReturnValueOnce({id: "1234"});
    mockGetCurrentReason.prototype.constructor.mockReturnValueOnce({reason_status: "DRAFT"});
    const res = await superTest(app)
      .post(pageURLs.EXTENSIONS_CHOOSE_REASON)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_NAME}=123`])
      .send({
        extensionReason: "other",
        otherReason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      });
    expect(mockDeleteReason).toHaveBeenCalled();
    expect(mockGetCurrentReason).toHaveBeenCalled();
  });
});

const dummySession = () => {
  const session: Session = Session.newWithCookieId("123");
  session.data = {
    [keys.SIGN_IN_INFO]: {
      [keys.SIGNED_IN]: 1,
      [keys.ACCESS_TOKEN]: {
        [keys.ACCESS_TOKEN]: "ACCESS_TOKEN",
      }
    },
    extension_session: {
      company_in_context: "00006400",
      extension_requests: [{
        company_number: "00006400",
        extension_request_id: "12345",
      }]
    }
  }
  return session;
}
