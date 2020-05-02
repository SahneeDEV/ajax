declare type AjaxRequestInit = RequestInit & {
    /**
     * By default a non 200-status code will raise an `APIError`. If this property
     * is set to false, no API error will be thrown and the request will be treated
     * as a success despite the server side error.
     */
    allowNonSuccessStatusCode?: boolean;
};
/**
 * Default options for every request.
 */
export declare const defaultInit: Partial<AjaxRequestInit> & {
    headers: Record<string, string>;
};
/**
 * A valid URL for an ajax request. Can either directly be a string representing a raw URL or a object to safely build it (recommended).
 */
export declare type AjaxURL = string | {
    /**
     * The base URL of the request.
     * Example: `https://www.sahnee.games/request?param1=true&params2=hello%20world&param2=second#test`
     *
     * If our currently domain is `www.sahnee.games` the `url` in this example can be
     * specified as `/request`. Otherwise it is `www.sahnee.games/request`.
     *
     * However prefer using `origin` for cross origin requests.
     */
    url: string;
    /**
     * The origin domain the `url` is relative to. By default the current domain.
     */
    origin?: string;
    /**
     * The username for making the request.
     */
    username?: string;
    /**
     * The password for making the request.
     */
    password?: string;
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
    hash?: string;
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
        [key: string]: string | number | boolean | null | undefined | (string | number | boolean | null | undefined)[];
    };
};
/**
 * Helper for inline building a URL.
 * @param url The URL.
 * @param query The search params.
 */
export declare const url: (p: AjaxURL) => string;
/**
 * Makes an AJAX request.
 * @param req The request.
 * @param init Some details.
 */
export declare const ajax: (req: AjaxURL, init: AjaxRequestInit) => Promise<Response>;
/**
 * Loads the given request as JSON. You can also pass request JSON in the `json` prop.
 * Automatically sets the headers `accept` and `content-type` to `application/json; charset=utf-8`.
 * @param req The request.
 * @param init Some details.
 * @param init.json Pass the JSON payload here. The payload will be transformed to JSON using
 * `JSON.stringify`. Should this not be sufficent this parameter can be omitted and the already
 * seralized JSON may be passed as the body.
 */
export declare const json: <T>(req: AjaxURL, { json, ...init }: RequestInit & {
    /**
     * By default a non 200-status code will raise an `APIError`. If this property
     * is set to false, no API error will be thrown and the request will be treated
     * as a success despite the server side error.
     */
    allowNonSuccessStatusCode?: boolean | undefined;
} & {
    json?: any;
}) => Promise<T>;
export interface IAPIError<T = {}> {
    status: number;
    code: string;
    message: string;
    details: T;
}
export default class APIError<T = {}> extends Error {
    constructor(error: IAPIError<T>);
    private $code;
    private $status;
    private $details;
    /**
     * The error code. Typically the name of the error class.
     */
    get code(): string;
    /**
     * The HTTP status code of this error.
     */
    get status(): number;
    /**
     * The error details.
     */
    get details(): T;
}
export {};
