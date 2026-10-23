// Structured data for simple pages: the page itself, linked to the site and
// the organisation, plus a two-step breadcrumb from the homepage.
import { homePath, type Lang } from "./i18n";

interface PageLd {
  site: URL;
  lang: Lang;
  path: string;
  /** Page name, as it should read in a breadcrumb (no " | The Vitrine"). */
  name: string;
  description: string;
  type?: "WebPage" | "ContactPage" | "AboutPage";
}

export function pageLd({ site, lang, path, name, description, type = "WebPage" }: PageLd) {
  const abs = (p: string) => new URL(p, site).href;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type,
        "@id": `${abs(path)}#webpage`,
        url: abs(path),
        name,
        description,
        inLanguage: lang,
        isPartOf: { "@id": abs("/#website") },
        about: { "@id": abs("/#organization") },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "The Vitrine", item: abs(homePath[lang]) },
          { "@type": "ListItem", position: 2, name, item: abs(path) },
        ],
      },
    ],
  };
}
