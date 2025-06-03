import type { Track, Artist } from '@/app/lib/spotify'
import { buildRatingPayload } from '@/app/lib/payload'

export async function fetchRating(tracks: Track[], artists: Artist[], username: string): Promise<string> {
   if (tracks.length === 0 && artists.length === 0) {
      return 'Not enough listening data to generate a rating. Please come back again after you listen to more music!'
   }

   const topTracks = tracks.map(track => `${track.name} by ${track.artists.map(a => a.name).join(', ')}`)
   const topArtists = artists.map(artist => artist.name)

   const payload = buildRatingPayload(topTracks, topArtists, username)

   const res = await fetch('/api/pollinations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
   })

   if (!res.ok) {
      const errData = await res.json()
      throw new Error(errData.error || 'The service is down')
   }

   const data = await res.json()
   return data
}