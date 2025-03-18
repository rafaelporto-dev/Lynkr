import { createClient } from '../../supabase/client'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient()
  
  // Buscar todos os perfis públicos
  const { data: profiles } = await supabase
    .from('profiles')
    .select('username, updated_at')
    .eq('visibility', 'public') // Assumindo que temos um campo de visibilidade
    
  // Buscar domínios personalizados verificados
  const { data: customDomains } = await supabase
    .from('custom_domains')
    .select('domain, user_id, updated_at')
    .eq('verified', true)
    
  // Criar um mapa para domínios personalizados por user_id
  const domainMap = new Map()
  if (customDomains) {
    customDomains.forEach(domain => {
      domainMap.set(domain.user_id, domain.domain)
    })
  }
  
  // URLs estáticas do site
  const staticUrls = [
    {
      url: 'https://lynkr.me',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://lynkr.me/pricing',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://lynkr.me/features',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://lynkr.me/login',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://lynkr.me/register',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Criar URLs para perfis
  const profileUrls = profiles?.map(profile => {
    const hasCustomDomain = domainMap.has(profile.id)
    
    return {
      url: hasCustomDomain 
        ? `https://${domainMap.get(profile.id)}` 
        : `https://lynkr.me/${profile.username}`,
      lastModified: profile.updated_at ? new Date(profile.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }
  }) || []

  return [...staticUrls, ...profileUrls]
} 