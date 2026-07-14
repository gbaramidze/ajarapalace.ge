import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ajara Palace',
    short_name: 'AjaraPalace',
    description: 'Premium Restaurant & Hotel in Batumi',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/icons/favicon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/favicon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/favicon-512x512.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
    screenshots: [
      {
        src: '/screenshot-wide.jpg',
        sizes: '1920x1080',
        type: 'image/jpeg',
        form_factor: 'wide',
      },
      {
        src: '/screenshot-mobile.jpg',
        sizes: '1080x1920',
        type: 'image/jpeg',
      }
    ]
  }
}
