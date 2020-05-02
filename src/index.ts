type AjaxRequestInit = RequestInit & { 
  /**
   * By default a non 200-status code will raise an `APIError`. If this property 
   * is set to false, no API error will be thrown and the request will be treated 
   * as a success despite the server side error.
   */
  allowNonSuccessStatusCode?: boolean 
};

/**
 * Content-Type for JSON without UTF-8.
 */
const JSON_CONTENT_TYPE_BASIC = 'application/json';

/**
 * Content-Type for JSON with UTF-8.
 */
const JSON_CONTENT_TYPE_UTF8 = JSON_CONTENT_TYPE_BASIC + '; charset=utf-8';

/**
 * Default options for every request.
 */
export const defaultInit: Partial<AjaxRequestInit> & { headers: Record<string, string> } = {
  headers: {}
};

/**
 * A valid URL for an ajax request. Can either directly be a string representing a raw URL or a object to safely build it (recommended).
 */
export type AjaxURL = string | {
  /**
   * The base URL of the request.
   * Example: `https://www.sahnee.games/request?param1=true&params2=hello%20world&param2=second#test`
   * 
   * If our currently domain is `www.sahnee.games` the `url` in this example can be 
   * specified as `/request`. Otherwise it is `www.sahnee.games/request`.
   * 
   * However prefer using `origin` for cross origin requests.
   */
  url: string,

  /**
   * The origin domain the `url` is relative to. By default the current domain.
   */
  origin?: string;

  /**
   * The username for making the request.
   */
  username?: string,

  /**
   * The password for making the request.
   */
  password?: string,

  /**
   * The protocol to use.
   */
  protocol?: string;

  /**
   * The port to use.
   */
  port?: number;

  /**
   * The hash to use.
   * Example: `https://www.sahnee.games/request?param1=true&params2=hello%20world&param2=second#test`
   * The `hash` in this case is `test`.
   */
  hash?: string,

  /**
   * The search query parameters.
   * Example: `https://www.sahnee.games/request?param1=true&params2=hello%20world&param2=second#test`
   * ```js
   * search: {
   *  param1: true,
   *  param2: ['hello world', 'second']
   * }
   * ```
   */
  search?: {
    [key: string]: string | number | boolean | null | undefined | (string | number | boolean | null | undefined)[]
  }
};

/**
 * Helper for inline building a URL.
 * @param url The URL.
 * @param query The search params.
 */
export const url = (p: AjaxURL) => {
  if (typeof p === 'string') {
    return p;
  }
  const obj = new URL(p.url, p.origin || window.location.origin);
  if (p.protocol) {
    obj.protocol = p.protocol;
  }
  if (p.port) {
    obj.port = p.port.toString(10);
  }
  if (p.hash) {
    obj.hash = p.hash;
  }
  if (p.username) {
    obj.username = p.username;
  }
  if (p.password) {
    obj.password = p.password;
  }
  if (p.search) {
    for (const key in p.search) {
      const value = p.search[key];
      if (p.search.hasOwnProperty(key) && value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Multiple query values
          for (let i = 0; i < value.length; i++) {
            const valueI = value[i];
            if (valueI !== undefined && valueI !== null) {
              obj.searchParams.append(key, valueI.toString());
            }
          }
        } else {
          // Single query value
          obj.searchParams.set(key, value.toString());
        }
      }
    }
  }
  return obj.toString();
}

/**
 * Makes an AJAX request.
 * @param req The request.
 * @param init Some details.
 */
export const ajax = async (req: AjaxURL, init: AjaxRequestInit) => {
  const headers = new Headers();
  mergeHeaders(headers, defaultInit.headers);
  if (init.headers) {
    mergeHeaders(headers, init.headers);
  }
  init.headers = headers;
  init = Object.assign({}, defaultInit, init);
  // https://muffinman.io/uploading-files-using-fetch-multipart-form-data/
  if (init.body instanceof FormData && init.headers) {
    deleteHeader(init.headers, 'content-type');
  }
  const res = await fetch(url(req), init);
  if (!res.ok && !init.allowNonSuccessStatusCode) {
    let type = res.headers.get('content-type');
    if (type && type.toLowerCase().startsWith(JSON_CONTENT_TYPE_BASIC)) {
      const json = await res.json();
      throw new APIError({
        status: res.status,
        code: 'code' in json ? json.code : res.statusText,
        message: 'message' in json ? json.message : res.statusText,
        details: json
      });
    } else {
      const text = await res.text();
      throw new APIError({
        status: res.status,
        code: res.statusText,
        message: text || res.statusText,
        details: {}
      })
    }
  }
  return res;
}

/**
 * Loads the given request as JSON. You can also pass request JSON in the `json` prop.
 * Automatically sets the headers `accept` and `content-type` to `application/json; charset=utf-8`.
 * @param req The request.
 * @param init Some details.
 * @param init.json Pass the JSON payload here. The payload will be transformed to JSON using 
 * `JSON.stringify`. Should this not be sufficent this parameter can be omitted and the already 
 * seralized JSON may be passed as the body.
 */
export const json = async <T>(req: AjaxURL, { json, ...init }: AjaxRequestInit & { json?: any }) => {
  // Maybe stringify body
  const body = json ? JSON.stringify(json) : init.body;
  // Create new request.
  const headers = new Headers();
  if (init.headers) {
    mergeHeaders(headers, init.headers);
  }
  headers.set('accept', JSON_CONTENT_TYPE_UTF8)
  headers.set('content-type', JSON_CONTENT_TYPE_UTF8)
  init = {
    ...init,
    body: body,
    headers: headers
  }
  // Set it as ajax and parse return JSON
  const res = await ajax(req, init);
  return await res.json() as T;
}

const mergeHeaders = (target: Headers, source: HeadersInit, overwrite: boolean = true) => {
  const setHeader = (header: string, value: string) => {
    return overwrite
      ? target.set(header, value)
      : target.append(header, value);
  }

  if (source instanceof Headers) {
    source.forEach((value, header) => {
      setHeader(header, value);
    });
  } else if (Array.isArray(source)) {
    for (let i = 0; i < source.length; i++) {
      setHeader(source[i][0], source[i][1]);
    }
  } else {
    for (const header in source) {
      const value = source[header];
      setHeader(header, value);
    }
  }
}

const getHeader = (h: HeadersInit, name: string) => {
  if (h instanceof Headers) {
    return h.get(name);
  } else if (Array.isArray(h)) {
    const entry = h.find(h => h[0].toLowerCase() === name.toLowerCase());
    return entry !== undefined ? entry[1] : null;
  } else {
    const entry = h[name];
    return entry !== undefined ? entry : null;
  }
}

const deleteHeader = (h: HeadersInit, name: string) => setHeader(h, name, undefined);

const setHeader = (h: HeadersInit, name: string, value: string | undefined) => {
  if (h instanceof Headers) {
    if (value !== undefined) {
      h.set(name, value);
    } else {
      h.delete(name);
    }
  } else if (Array.isArray(h)) {
    const entry = h.findIndex(h => h[0].toLowerCase() === name.toLowerCase());
    if (entry !== -1 && value !== undefined) {
      h[entry][1] = value;
    } else if (entry !== -1 && value === undefined) {
      delete h[entry];
    } else if (entry === -1 && value !== undefined) {
      h.push([name, value]);
    }
  } else {
    if (value !== undefined) {
      h[name] = value;
    } else {
      delete h[name];
    }
  }
}

export interface IAPIError<T = {}> {
  status: number;
  code: string;
  message: string;
  details: T;
}

export default class APIError<T = {}> extends Error {
  constructor(error: IAPIError<T>) {
    super(error.message);
    this.$code = error.code;
    this.$details = error.details;
    this.$status = error.status;
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, APIError.prototype);
    // Capture the stack trace
    const myError: any = Error;
    if (myError.captureStackTrace) {
      myError.captureStackTrace(this, this.constructor);
    }
  }

  private $code: string;
  private $status: number;
  private $details: T;

  /**
   * The error code. Typically the name of the error class.
   */
  public get code() {
    return this.$code;
  }

  /**
   * The HTTP status code of this error.
   */
  public get status() {
    return this.$status;
  }

  /**
   * The error details.
   */
  public get details() {
    return this.$details;
  }
}
