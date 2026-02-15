declare global {
  interface Window {
    siglo: {
      component: {
        loader: Loader;

      }
      service: {
        element: {
          stringToNode(string: string): HTMLDivElement;
        }
        fetch: {
          get<T = any>(url: string): Promise<T>;
          post<T = any>(url: string, data?: { [k: string]: any } | FormData | string | null): Promise<T>;
          submitAsForm(action: string, method?: 'POST'|'GET'|'DELETE'): void;
        }
      }
    };
  }

  class Loader {
    prependTo(container: HTMLElement|string): this;
    appendTo(container: HTMLElement|string): this;
    show(): void;
    hide(): void;
    isShown(): boolean;
    build(): HTMLDivElement;
    execute<T>(task: () => Promise<T>): Promise<T>;
    new(): Loader;
  }
}

export {};