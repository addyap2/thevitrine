// Vercel Routing Middleware: everything under /outils/ (pages, scripts, images)
// is private and served only with a valid session cookie. The login page
// /outils/connexion/ is the one exception. See api/_outils-session.js.
import { readCookie, verifySession } from "./api/_outils-session.js";

export const config = { matcher: ["/outils", "/outils/:path*"] };

export default async function middleware(request) {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/outils/connexion")) return;

  const user = await verifySession(readCookie(request.headers.get("cookie")), process.env.OUTILS_SECRET);
  if (user) {
    if (url.pathname === "/outils" || url.pathname === "/outils/") {
      return Response.redirect(new URL("/outils/devis-maintenance/", url), 302);
    }
    return; // signed in: carry on to the file
  }

  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
  const isPage = url.pathname.endsWith("/") || url.pathname.endsWith(".html") || !/\.[a-z0-9]+$/i.test(url.pathname);
  if (!isPage) return new Response("Accès réservé.", { status: 401, headers });
  const login = new URL("/outils/connexion/", url);
  login.searchParams.set("next", url.pathname);
  return new Response(null, { status: 302, headers: { ...headers, Location: login.href } });
}
