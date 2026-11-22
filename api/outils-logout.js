// Signs out of the private tools under /outils/ and returns to the login page.
import { clearedCookie } from "./_outils-session.js";

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Set-Cookie", clearedCookie);
  res.setHeader("Location", "/outils/connexion/?sortie=1");
  return res.status(302).end();
}
