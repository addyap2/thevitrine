import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  // The live domain. Canonicals, hreflang, the sitemap, robots.txt, share
  // images and structured data all derive from it.
  site: "https://thevitrine.fr",
  // One URL per page: always with a trailing slash (Vercel redirects the rest, see vercel.json).
  trailingSlash: "always",

  // Content security policy: Astro hashes every script and style it emits and
  // writes them into a <meta> tag; everything else may only come from this site.
  // (frame-ancestors can't go in a <meta>, so it is sent as a header: vercel.json.)
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
      ],
    },
  },

  // Fonts are downloaded at build time and served from our own domain: no
  // render-blocking request to Google, no visitor data sent to a third party,
  // and size-matched fallbacks so text doesn't jump when the font arrives.
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Fraunces",
      cssVariable: "--font-fraunces",
      weights: ["500 600"],
      styles: ["normal", "italic"],
      fallbacks: ["Georgia", "serif"],
      // Keep the optical-size axis: the display headlines rely on it.
      options: { experimental: { variableAxis: { opsz: [{ min: 9, max: 144 }] } } },
    },
    {
      provider: fontProviders.google(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: ["400 600"],
      styles: ["normal"],
      fallbacks: ["system-ui", "sans-serif"],
    },
  ],
});
