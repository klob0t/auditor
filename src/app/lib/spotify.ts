export interface Artist {
   name: string
   external_urls: { spotify: string }
   images?: { url: string }[]
}

export interface Track {
   name: string
   artists: Artist[]
   album: {
      image: { url: string }[]
   }
   external_urls: { spotify: string }
}

export interface User {
  display_name: string | null
  email?: string
  id: string
  images?: { url: string }[]
  external_urls: { spotify: string }
  country?: string
}


export async function fetchSpotifyProfile(accessToken: string) {
   const res = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}`}
   })

   if (!res.ok) {
      throw new Error(`Failed to fetch Spotify profile. Status: ${res.status}`)
   }

   return res.json()
}

export async function fetchTopSpotifyItems(
   accessToken: string,
   type: 'tracks' | 'artists',
   limit: number = 10,
   time_range = 'long_term'
) {
   const res = await fetch(`https://api.spotify.com/v1/me/top/${type}?time_range=${time_range}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
   })

   if (!res.ok) {
      throw new Error(`Failed to fetch top ${type}. Status ${res.status}`)
   }

   const data = await res.json()
   return data.items
}

export async function getUserSpotifyData(accessToken: string) {
   const profileData = await fetchSpotifyProfile(accessToken)

   const [topTracks, topArtists] = await Promise.all([
      fetchTopSpotifyItems(accessToken, 'tracks'),
      fetchTopSpotifyItems(accessToken, 'artists')
   ])
   return { profileData, topTracks, topArtists}
}