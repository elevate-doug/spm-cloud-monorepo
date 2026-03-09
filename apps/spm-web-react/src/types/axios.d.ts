import 'axios';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _202RetryCount?: number;
  }
}
