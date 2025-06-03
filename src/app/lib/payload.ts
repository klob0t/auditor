import { webSearchTool } from "@/app/lib/tools";

interface Artist {
   name: string
   external_urls: { spotify: string }
   images?: { url: string }[]
}

interface Track {
   name: string
   artists: Artist[]
   album: {
      images: { url: string }[]
   }
   external_urls: { spotify: string }
}

interface Message {
  role: 'system' | 'user'
  content: string
}

interface RatingPayload {
  model: string
  messages: Message[]
  stream: boolean
  tools: any[]
  tool_choice?: 'auto' | 'none' | { function: { name:string } }
}

export function buildRatingPayload(topTracks: string[], topArtists: string[], username: string): RatingPayload {
   const DEFAULT_TEXT_MODEL = 'openai-large'

   const SYSTEM_PROMPT = 
   `*PERSONA:
   You're a sarcastic, witty, and brutally honest music critic with a prestigious name of "The Auditor". Your job is to make paragraphs of roast to people's Spotify taste in the most entertaining way possible. Be funny, clever, and offensive. Use methapor to describe the user music's taste. Be warm, nice, and welcoming at first but as the sentence goes, become more offensive! Be wild, be AS MEAN AS YOU COULD. 

   *TOOL:
   You could get more real-time information from the internet using the available tool if you need. 
   
   *FORMAT:
   Always answer with markdown format so you can put emphasize on mean words (You should always prefer to underline your word instead of bold to emphasize your answer). Always end your answer with 'no offense' or 'no hard feelings' or something along the line.`

   const USER_PROMPT = `
      User Name: ${username}
      Top Tracks: ${topTracks.join(', ')}
      Top Artists: ${topArtists.join(', ')}
   `

   const messages: Message[] = [
      {
         role: 'system',
         content: SYSTEM_PROMPT,
      },
      {
         role: 'user',
         content: USER_PROMPT,
      },
   ]

   return {
      model: DEFAULT_TEXT_MODEL,
      messages,
      stream: false,
      tools: [webSearchTool],
      tool_choice: 'auto'
   }
}

export async function getRating(
   tracks: Track[],
   artists: Artist[],
   username: string
): Promise<string> {
   if (tracks.length === 0 && artists.length === 0) {
      return 'Not enough listening data to generate a rating. Please come back again after you have listened more music.'
   }

   const topTracks = tracks.map(
      (tracks, i) => `&{i + 1}. ${tracks.name} by ${tracks.artists.map(a => a.name).join(', ')}`
   )

   const topArtists = artists.map(
      (artist, i) => `${i + 1}. ${artist.name}`
   )

   const payload = buildRatingPayload(topTracks, topArtists, username)

   try {
      const response = await fetch('/api/pollinations/', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            tracks,
            artists,
            username
         })
      })

      if (!response.ok) {
         const errData = await response.json()
         throw new Error(errData.error || `The server is under maintenance.`)
      }

      const data = await response.json()
      return data.rating
   } catch (err: any) {
      console.error('Error fetching rating from The Auditor', err)
      return `I am having a hiccup.`
   }
}