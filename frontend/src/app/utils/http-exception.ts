type BaseInformation = {
  [key: string]: any;
  message: string;
  name: string;
  ok: boolean;
  status: number;
  statusText: string;
  url: string;
};

type DetailedInformation = {
  [key: string]: any;
  code: string;
  description: string;
  message: string;
  path: string;
  status: number;
  timestamp: string;
};

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

  get headers(): any {
    return this.httpHeaders;
  }

  get code(): string {
    return this.detailedInformation.code;
  }

  get description(): string {
    return this.detailedInformation.description;
  }

  get message(): string {
    if (this.detailedInformation.message.length === 0) {
      return this.baseInformation.message;
    }

    return this.detailedInformation.message;
  }

  get requestPath(): string {
    return this.detailedInformation.path;
  }

  get timestamp(): string {
    return this.detailedInformation.timestamp;
  }

  get fullRequestUrl(): string {
    return this.baseInformation.url;
  }

  get status(): number {
    if (this.detailedInformation.status !== 0) {
      return this.detailedInformation.status;
    }

    return this.baseInformation.status;
  }

  get statusText(): string {
    return this.baseInformation.statusText;
  }

  get name(): string {
    return this.baseInformation.name;
  }

  get ok(): boolean {
    return this.baseInformation.ok;
  }
}
