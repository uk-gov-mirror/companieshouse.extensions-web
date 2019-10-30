import app from "../../app";
import * as pageURLs from "../../model/page.urls";
import * as request from "supertest";
import {COOKIE_NAME} from "../../session/config";
import * as keys from "../../session/keys";
import Session from "../../session/session";
import {loadSession} from "../../services/redis.service";
import {callProcessorApi} from "../../client/apiclient";
import {createHistoryIfNone, getRequest, getCompanyInContext, updateExtensionSessionValue} from "../../services/session.service";

jest.mock("../../services/redis.service");
jest.mock("../../client/apiclient");
jest.mock( "../../services/session.service");


const EMAIL: string = "demo@ch.gov.uk";
const COMPANY_NUMBER: string = "00006400";
const PAGE_TITLE: string = "Confirmation page";
const ERROR_PAGE: string = "Sorry, there is a problem with the service";


const mockCacheService = (<unknown>loadSession as jest.Mock<typeof loadSession>);
const mockCallProcessorApi = (<unknown>callProcessorApi as jest.Mock<typeof callProcessorApi>);
const mockGetRequest = (<unknown>getRequest as jest.Mock<typeof getRequest>);
const mockCreateHistoryIfNone = (<unknown>createHistoryIfNone as jest.Mock<typeof createHistoryIfNone>);
const mockGetCompanyInContext = (<unknown>getCompanyInContext as jest.Mock<typeof getCompanyInContext>);
const mockUpdateExtensionSessionValue = (<unknown>updateExtensionSessionValue as jest.Mock<typeof updateExtensionSessionValue>);

  beforeEach(() => {
    mockCacheService.mockRestore();
    mockCallProcessorApi.prototype.constructor.mockImplementationOnce(()=> new Error());
    mockGetRequest.prototype.constructor.mockImplementation(() => {
        return {
          [keys.COMPANY_NUMBER]: "00006400",
          "extension_request_id": "request1",
          "reason_in_context_string": "1234",
      }
    });
    mockCreateHistoryIfNone.prototype.constructor.mockImplementation(() =>{
      return {
        page_history: [],
      };
    });
    mockGetCompanyInContext.prototype.constructor.mockImplementation(() => "00006400")
    mockUpdateExtensionSessionValue.prototype.constructor.mockImplementationOnce(() => Promise.resolve());

  });

describe("confirmation controller", () => {

  it("should render the confirmation page", async () => {
    mockCacheService.mockClear();
    mockCacheService.prototype.constructor.mockResolvedValueOnce(dummySession(COMPANY_NUMBER, EMAIL));

    const resp = await request(app)
      .get(pageURLs.EXTENSIONS_CONFIRMATION)
      .set("Referer", "/")
      .set("Cookie", [`${COOKIE_NAME}=123`]);

    expect(resp.status).toEqual(200);
    expect(resp.text).toContain(EMAIL);
    expect(resp.text).toContain(COMPANY_NUMBER);
    expect(resp.text).toContain(PAGE_TITLE);
  });

  it("should return the error page if email is missing from session", async () => {
    mockCacheService.mockClear();
    mockCacheService.prototype.constructor.mockResolvedValueOnce(dummySession(COMPANY_NUMBER, null));
    const resp = await request(app)
      .get(pageURLs.EXTENSIONS_CONFIRMATION)
      .set("Referer", "/")
      .set("Cookie", [`${COOKIE_NAME}=123`]);

    expect(resp.status).toEqual(500);
    expect(resp.text).not.toContain(EMAIL);
    expect(resp.text).not.toContain(COMPANY_NUMBER);
    expect(resp.text).not.toContain(PAGE_TITLE);
    expect(resp.text).toContain(ERROR_PAGE);
  });

  it("should return the error page if company number is missing from session", async () => {
    mockCacheService.mockClear();
    mockCacheService.prototype.constructor.mockResolvedValueOnce(dummySession(null, EMAIL));
    mockGetCompanyInContext.prototype.constructor.mockResolvedValueOnce(undefined);

    const resp = await request(app)
      .get(pageURLs.EXTENSIONS_CONFIRMATION)
      .set("Referer", "/")
      .set("Cookie", [`${COOKIE_NAME}=123`]);

    expect(resp.status).toEqual(500);
    expect(resp.text).not.toContain(EMAIL);
    expect(resp.text).not.toContain(COMPANY_NUMBER);
    expect(resp.text).not.toContain(PAGE_TITLE);
    expect(resp.text).toContain(ERROR_PAGE);
  });

  it("should set already submitted to true in routine call", async () => {
    mockCacheService.mockClear();
    const session: Session = dummySessionWithToken(COMPANY_NUMBER, EMAIL);
    mockCacheService.prototype.constructor.mockResolvedValueOnce(session);
    const resp = await request(app)
      .get(pageURLs.EXTENSIONS_CONFIRMATION)
      .set("Referer", "/")
      .set("Cookie", [`${COOKIE_NAME}=123`]);

    expect(mockUpdateExtensionSessionValue).toBeCalledWith(session, keys.ALREADY_SUBMITTED, true);
    expect(resp.status).toEqual(200);
  });

  it("should set already submitted to false if error", async () => {
    mockCacheService.mockClear();
    const session: Session = dummySessionWithToken(COMPANY_NUMBER, EMAIL);
    mockCacheService.prototype.constructor.mockResolvedValueOnce(session);
    const resp = await request(app)
      .get(pageURLs.EXTENSIONS_CONFIRMATION)
      .set("Referer", "/")
      .set("Cookie", [`${COOKIE_NAME}=123`]);

    expect(mockCallProcessorApi).toBeCalled();
    expect(session.data.extension_session[keys.ALREADY_SUBMITTED]).toBeFalsy();
  });

});

const dummySession = (companyNumber, email) => {
  let session: Session = Session.newInstance();
  session.data = {
    [keys.SIGN_IN_INFO]: {
      [keys.SIGNED_IN]: 1,
      [keys.USER_PROFILE]: {
        email
      }
    },
    [keys.EXTENSION_SESSION]: {
      [keys.COMPANY_IN_CONTEXT]: companyNumber,
      [keys.EXTENSION_REQUESTS]: [{
        [keys.COMPANY_NUMBER]: "00006400",
        "extension_request_id": "request1",
        "reason_in_context_string": "reason1",
        [keys.EXTENSION_REASONS]: [
          {
            reasonNumber: 1,
            reasonId: "reason1",
            reason: "illness",
            removalCandidate: false
          }
        ]
      }],
    }
  }
  return session;
}

const dummySessionWithToken = (companyNumber, email) => {
  let session: Session = Session.newInstance();
  session.data = {
    [keys.SIGN_IN_INFO]: {
      [keys.SIGNED_IN]: 1,
      [keys.USER_PROFILE]: {
        email
      },
      [keys.ACCESS_TOKEN]: {
        access_token: "token"
      }
    },
    [keys.EXTENSION_SESSION]: {
      [keys.COMPANY_IN_CONTEXT]: companyNumber,
      [keys.EXTENSION_REQUESTS]: [{
        [keys.COMPANY_NUMBER]: "00006400",
        "extension_request_id": "request1",
        "reason_in_context_string": "reason1",
        [keys.EXTENSION_REASONS]: [
          {
            reasonNumber: 1,
            reasonId: "reason1",
            reason: "illness",
            removalCandidate: false
          }
        ]
      }],
    }
  }
  return session;
}
