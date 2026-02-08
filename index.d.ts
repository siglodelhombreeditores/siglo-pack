declare global {
  interface Window {
    siglo: {
      service: {
        fetch: {
          get<T = any>(url: string): Promise<T>;
          post<T = any>(url: string, data?: { [k: string]: any } | FormData | string | null): Promise<T>;
          submitAsForm(action: string, method?: 'POST'|'GET'|'DELETE'): void;
        }
      }
    };
  }
}

export {};