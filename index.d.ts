/// <reference path="./prestashop.d.ts" />

declare global {
  interface Window {
    prestashop: PrestaShop;
    siglo: {
      component: {
        loader: Loader;
        typeahead: {
          load(): void;
        };
      };
      service: {
        element: {
          stringToNode(string: string): HTMLDivElement;
        }
        fetch: {
          get<T = any>(url: string): Promise<T>;
          post<T = any>(url: string, data?: { [k: string]: any } | FormData | string | null): Promise<T>;
          submitAsForm(action: string, method?: 'POST'|'GET'|'DELETE'): void;
        }
        form: {
          textToLinkRewrite(params: {
            sourceSelector: string,
            destinationSelector: string,
            eventName?: string
          }): void;
          updateFormFields: {
            init(): void;
          };
        }
      }
    };
    modalConfirmation: ModalConfirmation
    str2url(str: string): string;
  }

  class Loader {
    appendTo(container: HTMLElement|string): this;
    show(): void;
    hide(): void;
    isShown(): boolean;
    build(): HTMLDivElement;
    execute<T>(task: () => Promise<T>): Promise<T>;
    new(): Loader;
    isInserted(): boolean;
  }

  class ModalConfirmation {
    create(content: null|string, title: null|string, callbacks?: {onContinue?: () =>void, onCancel?: () => void}): this;
    show(): void;
    hide(): void;
  }
  
}

export {};