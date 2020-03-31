import * as templates from "./template.paths";

export const ROOT: string = "/";
const SEPARATOR: string = "/";

export const EXTENSIONS: string = "/extensions";
export const COMPANY_NUMBER: string = SEPARATOR + templates.COMPANY_NUMBER;
export const CONFIRM_COMPANY: string = SEPARATOR + templates.CONFIRM_COMPANY;
export const ACCOUNTS_OVERDUE: string = SEPARATOR + templates.ACCOUNTS_OVERDUE;
export const CHOOSE_REASON: string = SEPARATOR + templates.CHOOSE_REASON;
export const REASON_ILLNESS: string = SEPARATOR + templates.REASON_ILLNESS;
export const ILLNESS_START_DATE: string = SEPARATOR + templates.ILLNESS_START_DATE;
export const CONTINUED_ILLNESS: string = SEPARATOR + templates.CONTINUED_ILLNESS;
export const ILLNESS_END_DATE: string = SEPARATOR + templates.ILLNESS_END_DATE;
export const ILLNESS_INFORMATION: string = SEPARATOR + templates.ILLNESS_INFORMATION;
export const REASON_ACCOUNTING_ISSUE: string = SEPARATOR + templates.REASON_ACCOUNTING_ISSUE;
export const ACCOUNTS_INFORMATION: string = SEPARATOR + templates.ACCOUNTS_INFORMATION;
export const REASON_OTHER: string = SEPARATOR + templates.REASON_OTHER;
export const DOCUMENT_OPTION: string = SEPARATOR + templates.DOCUMENT_OPTION;
export const DOCUMENT_UPLOAD: string = SEPARATOR + templates.DOCUMENT_UPLOAD;
export const REMOVE_DOCUMENT: string = SEPARATOR + templates.REMOVE_DOCUMENT;
export const DOCUMENT_UPLOAD_CONTINUE_NO_DOCS: string = "/document-upload-continue-no-docs";
export const ADD_EXTENSION_REASON: string = SEPARATOR + templates.ADD_EXTENSION_REASON;
export const CONFIRMATION: string = SEPARATOR + templates.CONFIRMATION;
export const PRINT_APPLICATION: string = SEPARATOR + templates.PRINT_APPLICATION;
export const REMOVE_REASON: string = SEPARATOR + templates.REMOVE_REASON;
export const NO_FOUND: string = "/no-found";
export const ERROR: string = SEPARATOR + templates.ERROR;
export const CHECK_YOUR_ANSWERS: string = SEPARATOR + templates.CHECK_YOUR_ANSWERS;
export const DOWNLOAD_ATTACHMENT: string =
  "/company/:companyId/extensions/requests/:requestId/*/attachments/*/download";
export const BACK_LINK: string =  "/back-link";
export const REASON_ID: string = "reasonId=";
export const OAUTH_LOGIN_URL: string = "/oauth2/user/signin?";
export const DOWNLOAD_PREFIX: string = "/download";
export const DOWNLOAD_SUFFIX: string = "/download";
export const DOWNLOAD_ATTACHMENT_LANDING: string = DOWNLOAD_PREFIX + DOWNLOAD_ATTACHMENT;
export const EXTENSIONS_COMPANY_NUMBER: string = EXTENSIONS + COMPANY_NUMBER;
export const EXTENSIONS_CHOOSE_REASON: string = EXTENSIONS + CHOOSE_REASON;
export const EXTENSIONS_CONFIRM_COMPANY: string = EXTENSIONS + CONFIRM_COMPANY;
export const EXTENSIONS_REASON_ILLNESS: string = EXTENSIONS + REASON_ILLNESS;
export const EXTENSIONS_REASON_OTHER: string = EXTENSIONS + REASON_OTHER;
export const EXTENSIONS_REASON_ACCOUNTING_ISSUE: string = EXTENSIONS + REASON_ACCOUNTING_ISSUE;
export const EXTENSIONS_DOCUMENT_OPTION: string = EXTENSIONS + DOCUMENT_OPTION;
export const EXTENSIONS_DOCUMENT_UPLOAD: string = EXTENSIONS + DOCUMENT_UPLOAD;
export const EXTENSIONS_DOCUMENT_UPLOAD_CONTINUE_NO_DOCS: string = EXTENSIONS + DOCUMENT_UPLOAD_CONTINUE_NO_DOCS;
export const EXTENSIONS_REMOVE_DOCUMENT: string = EXTENSIONS + REMOVE_DOCUMENT;
export const EXTENSIONS_ILLNESS_START_DATE: string = EXTENSIONS + ILLNESS_START_DATE;
export const EXTENSIONS_CONTINUED_ILLNESS: string = EXTENSIONS + CONTINUED_ILLNESS;
export const EXTENSIONS_ILLNESS_END_DATE: string = EXTENSIONS + ILLNESS_END_DATE;
export const EXTENSIONS_ILLNESS_INFORMATION: string = EXTENSIONS + ILLNESS_INFORMATION;
export const EXTENSIONS_ACCOUNTS_INFORMATION: string = EXTENSIONS + ACCOUNTS_INFORMATION;
export const EXTENSIONS_ADD_EXTENSION_REASON: string = EXTENSIONS + ADD_EXTENSION_REASON;
export const EXTENSIONS_CONFIRMATION: string = EXTENSIONS + CONFIRMATION;
export const EXTENSIONS_PRINT_APPLICATION: string = EXTENSIONS + PRINT_APPLICATION;
export const EXTENSIONS_REMOVE_REASON: string = EXTENSIONS + REMOVE_REASON;
export const EXTENSIONS_ERROR: string = EXTENSIONS + ERROR;
export const EXTENSIONS_CHECK_YOUR_ANSWERS: string = EXTENSIONS + CHECK_YOUR_ANSWERS;
export const EXTENSIONS_BACK_LINK: string = EXTENSIONS + BACK_LINK;
