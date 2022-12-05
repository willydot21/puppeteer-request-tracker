import { HTTPRequest, HTTPResponse } from "puppeteer";
import { IRequestInfo } from "../../@types/request-tracker";

async function getResponseBody(response: HTTPResponse, request: HTTPRequest) {

  /*

    #### [ REMINDER ] ####

    This could cause next error:

    ProtocolError: 
      Could not load body for this request. 
      This might happen if the request is a preflight request.

    I readed alot of possible causes, but still don't know why exactly.

    Tracks or so I think: 
      https://stackoverflow.com/questions/35588699/response-to-preflight-request-doesnt-pass-access-control-check
      https://github.com/puppeteer/puppeteer/issues/7884
      https://stackoverflow.com/questions/38924798/chrome-dev-tools-fails-to-show-response-even-the-content-returned-has-header-con
      

  */

  try {

    const redirectChainEmpty = request.redirectChain().length === 0;

    if (redirectChainEmpty) {
      const buffer = await response.buffer();
      return buffer;
    }

  } catch (error) {

    // console.error(error) -- Only on testing.

  } finally { return null; }

}


export async function getRequestInfo(request: HTTPRequest) {

  let responseBody = null, responseHeaders = null, responseSize = null;
  const response = request.response();

  // response data
  if (response) {
    responseHeaders = response.headers();
    responseSize = responseHeaders['content-length'] as unknown as number;
    responseBody = await getResponseBody(response, request);
  }

  return {
    url: request.url(),
    requestHeaders: request.headers(),
    requestPostData: request.postData() || null,
    responseHeaders,
    responseSize,
    responseBody
  };

}