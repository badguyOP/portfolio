import { MetadataRoute } from 'next'
import { getBlogPosts } from '@/lib/content'

export default function sitemap(): MetadataRoute.Sitemap {
    const base = 'https://atharv.is-a-good.dev'
    const posts = getBlogPosts()

    return [
        {
            url: base,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${base}/research`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${base}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        ...posts.map((post) => ({
            url: `${base}/blog/${post.slug}`,
            lastModified: new Date(post.date),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        })),
    ]
}
