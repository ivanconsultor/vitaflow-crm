import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://vitaflow-seunegocio.com'; // Endereço final que será ativado na VPS
  
  const routes = ['', '/login', '/capture'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : route === '/capture' ? 0.9 : 0.8,
  }));

  return [...routes];
}
