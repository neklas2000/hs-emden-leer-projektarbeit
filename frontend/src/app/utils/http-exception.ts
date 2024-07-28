/**
 * @description
 * This type represents the default information provided by the JavaScript error object.
 */
type BaseInformation = {
  [key: string]: any;
  message: string;
  name: string;
  ok: boolean;
  status: number;
  statusText: string;
  url: string;
};

/**
 * @description
 * This type represents more detailed information of an exception provided by the api.
 */
type DetailedInformation = {
  [key: string]: any;
  code: string;
  description: string;
  message: string;
  path: string;
  status: number;
  timestamp: string;
};

/**
 * @description
 * This class represents an exception which will be thrown while accessing the api. It takes the
 * default JavaScript error object and transforms it to a more accessible exception object
 * containing more details provided by the api.
 *
 * @usageNotes
 * ### Create the exception object
 * ```ts
 * const http = inject(HttpClient); // Inside of an injection context
 * http.get('/api/helloworld').pipe(catchError((error) => new HttpException(error))).subscribe({
 *    next: (data: ResponseData) => { ... },
 *    error: (exception: HttpException) => { ... },
 * });
 * ```
 */
export class HttpException {
  private httpHeaders: any;
  private baseInformation: BaseInformation = {
    message: '',
    name: '',
    ok: false,
    status: 0,
    statusText: '',
    url: '',
  };
  private detailedInformation: DetailedInformation = {
    code: '',
    description: '',
    message: '',
    path: '',
    status: 0,
    timestamp: '',
  };

  constructor(exception: any) {
    if (exception === null) exception = {};
    if (Object.hasOwn(exception, 'headers')) this.httpHeaders = exception.headers;

    if (Object.hasOwn(exception, 'error')) {
      const keys = Object.keys(this.detailedInformation);

      for (const key of keys) {
        if (Object.hasOwn(exception.error, key)) {
          this.detailedInformation[key] = exception.error[key];
        }
      }
    }

    const keys = Object.keys(this.baseInformation);

    for (const key of keys) {
      if (Object.hasOwn(exception, key)) {
        this.baseInformation[key] = exception[key];
      }
    }
  }

  /**
   * @returns A map of http headers.
   */
  get headers(): any {
    return this.httpHeaders;
  }

  /**
   * @returns An exception code from the api (e.g. HSEL-400-001).
   */
  get code(): string {
    return this.detailedInformation.code;
  }

  /**
   * @returns A basic description detailing the cause of the exception.
   */
  get description(): string {
    return this.detailedInformation.description;
  }

  /**
   * @returns A basic message naming the exception type.
   */
  get message(): string {
    if (this.detailedInformation.message.length === 0) {
      return this.baseInformation.message;
    }

    return this.detailedInformation.message;
  }

  /**
   * @returns The endpoint which was requested and caused this exception.
   */
  get requestPath(): string {
    return this.detailedInformation.path;
  }

  /**
   * @returns The timestamp of when the request was handled within the api.
   */
  get timestamp(): string {
    return this.detailedInformation.timestamp;
  }

  /**
   * @returns The full request url, consisting of the protocol, domain and the endpoint.
   */
  get fullRequestUrl(): string {
    return this.baseInformation.url;
  }

  /**
   * @returns The http status code (e.g. 400, 404 etc.).
   */
  get status(): number {
    if (this.detailedInformation.status !== 0) {
      return this.detailedInformation.status;
    }

    return this.baseInformation.status;
  }

  /**
   * @returns The status message corresponding to the HTTP status code (e.g. 404 ~> Not Found).
   */
  get statusText(): string {
    return this.baseInformation.statusText;
  }

  /**
   * @returns The name for the type of the exception.
   */
  get name(): string {
    return this.baseInformation.name;
  }

  /**
   * @returns `true`, if the http status code was 200, otherwise `false`.
   */
  get ok(): boolean {
    return this.baseInformation.ok;
  }
}
