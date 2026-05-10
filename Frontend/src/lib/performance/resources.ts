/**
 * Resource preloading utilities
 */

export function preloadResource(
  href: string,
  as: "image" | "font" | "script" | "style",
  type?: string,
) {
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  if (as === "font") link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}

/**
 * Preload critical resources for faster initial load
 */
export function preloadCriticalResources() {
  const resources: Array<{
    href: string;
    as: "image" | "font";
    type?: string;
  }> = [
    { href: "/src/assets/fonts/cairo.woff2", as: "font", type: "font/woff2" },
  ];

  resources.forEach(({ href, as, type }) => preloadResource(href, as, type));
}
