import { Helmet } from "react-helmet-async";
import { SITE_CONFIG } from "@/config/siteConfig";

interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  noindex?: boolean;
  jsonLd?: object[];
}

export const SEO = ({ title, description, canonical, noindex = false, jsonLd = [] }: SEOProps) => {
  const faviconUrl = SITE_CONFIG.logoUrl || "/favicon.ico";
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      
      {/* Favicon */}
      <link rel="icon" type="image/webp" href={faviconUrl} />
      <link rel="apple-touch-icon" href={faviconUrl} />
      
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      {SITE_CONFIG.logoUrl && <meta property="og:image" content={`${canonical}${SITE_CONFIG.logoUrl}`} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {SITE_CONFIG.logoUrl && <meta name="twitter:image" content={`${canonical}${SITE_CONFIG.logoUrl}`} />}

      {/* JSON-LD */}
      {jsonLd.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
