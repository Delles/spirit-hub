import { MetadataRoute } from 'next'
import { guides } from '@/data/guides'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.spirithub.ro'

    return [
        // Homepage - highest priority, updates daily
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        // Numerologie section
        {
            url: `${baseUrl}/numerologie`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/numerologie/calea-vietii`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/numerologie/numar-zilnic`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/numerologie/nume-destin`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/numerologie/compatibilitate`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        // Bioritm section
        {
            url: `${baseUrl}/bioritm`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/bioritm/energia-zilei`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/bioritm/critice`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        // Daily message
        {
            url: `${baseUrl}/mesaj-zilnic`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/ghiduri`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        ...guides.map((guide) => ({
            url: `${baseUrl}/ghiduri/${guide.slug}`,
            lastModified: new Date(guide.updatedAt),
            changeFrequency: 'monthly' as const,
            priority: 0.65,
        })),
        // Trust/legal pages
        {
            url: `${baseUrl}/despre`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/confidentialitate`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.4,
        },
        {
            url: `${baseUrl}/termeni`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.4,
        },
    ]
}
