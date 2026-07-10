import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/capture'],
      disallow: ['/admin', '/crm', '/api', '/prospectos', '/integracoes', '/campanhas', '/ads', '/analytics'],
    },
    sitemap: 'https://vitaflow-seunegocio.com/sitemap.xml',
  };
}
