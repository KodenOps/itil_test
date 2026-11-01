/**
 * Only ever redirect to a path on this site.
 *
 * A value like `//evil.example` or `/\\evil.example` is a protocol-relative
 * URL in browsers, so a naive `startsWith("/")` check turns into an open
 * redirect. `javascript:` / `data:` URLs are also rejected, which matters
 * because the login form assigns the callback to `window.location`.
 */
export function safeRedirectPath(value: unknown, fallback = "/"): string {
  if (typeof value !== "string") return fallback;

  const path = value.trim();

  if (!path.startsWith("/")) return fallback;
  if (path.startsWith("//") || path.startsWith("/\\")) return fallback;
  // Control characters can be used to smuggle a new scheme past parsers.
  if (/[\u0000-\u001f\u007f]/.test(path)) return fallback;
  // `/\t/evil.example` style tricks.
  if (path.slice(1).startsWith("\\")) return fallback;

  return path;
}
