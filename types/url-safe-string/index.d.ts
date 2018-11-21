declare module "url-safe-string" {
  export default function UrlSafeString(): {
    generate: (input: string) => string;
  }
}
