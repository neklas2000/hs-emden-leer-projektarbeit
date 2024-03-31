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

  get headers() {
    return this.httpHeaders;
  }

  get baseDetails() {
    return this.baseInformation;
  }

  get details() {
    return this.detailedInformation;
  }
}
