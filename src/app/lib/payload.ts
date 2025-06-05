import { webSearchTool, Tool } from "@/app/lib/tools";

type AuditorMode = 'nice' | 'mean'

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

// interface Tool {
//    type: 'function'
//    function: {
//       name: string
//       description: string
//       parameters: {
//          type: 'object'
//          properties: {
//             query: {
//                type: 'string'
//                description: 'string'
//             }
//          }
//          required: string[]
//       }
//    }
// }

interface RatingPayload {
  model: string
  messages: Message[]
  stream: boolean
  tools: Tool[]
  tool_choice?: 'auto' | 'none' | { function: { name:string } }
}

export function buildPayload(topTracks: string[], topArtists: string[], username: string, mode: AuditorMode): RatingPayload {
   const DEFAULT_TEXT_MODEL = 'openai'

   const MEAN_SYSTEM_PROMPT = 
   `*PERSONA:
   You're a sarcastic, witty, and brutally honest music critic with a prestigious name of "The Auditor". Your job is to make 3 - 4 paragraphs of roast to people's Spotify taste in the most entertaining way possible. Be funny, clever, and offensive. Use methapor to describe the user music's taste. Be warm, nice, and welcoming at first but as the sentence goes, become more offensive! Be wild, be AS MEAN AS YOU COULD.

   *TOOL:
   You could get more real-time information from the internet using the available tool if you need. 
   
   *FORMAT:
   Always answer with markdown format so you can put emphasize on mean words (You should ALWAYS UNDERLINE ON MEAN WORDS TO EMPHASIZE YOUR JUDGEMENT). Always end your answer with 'no offense' or 'no hard feelings' or something along the line. Answer in informal English.`

   const NICE_SYSTEM_PROMPT = 
   `*PERSONA:
   You're a nice, warm, cool music connoisseur with a prestigious name of "The Auditor" that likes to listen to the user musical preferences . Your job is to tell the user to tell you their musical preferences by logging in using their Spotify account. Be funny, clever. And remember to always be NICE.
   
   *FORMAT:
   Always answer with short sentence. Not longer than 5 words. Imply that you really want to know the user's musical preferences such as, but not limited to: Greetings, sonic explorer! Log in to your Spotify—let’s judge your jams!`

   const SYSTEM_PROMPT = mode === 'nice'
   ? NICE_SYSTEM_PROMPT : MEAN_SYSTEM_PROMPT

   const USER_PROMPT = mode === 'nice' 
   ? `Say hi to a new user landing on this site. Invite them to log in using their Spotify`
   : `User Name: ${username}
      Top Tracks: ${topTracks.join(', ')}
      Top Artists: ${topArtists.join(', ')}`

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
   username: string,
   mode: AuditorMode
): Promise<string> {
   // if (tracks.length === 0 && artists.length === 0) {
   //    return 'Not enough listening data to generate a rating. Please come back again after you have listened more music.'
   // }

   // const topTracks = tracks.map(
   //    (tracks, i) => `&{i + 1}. ${tracks.name} by ${tracks.artists.map(a => a.name).join(', ')}`
   // )

   // const topArtists = artists.map(
   //    (artist, i) => `${i + 1}. ${artist.name}`
   // )

   try {
      const response = await fetch('/api/pollinations/', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            tracks,
            artists,
            username,
            mode
         })
      })

      if (!response.ok) {
         const errData = await response.json()
         throw new Error(errData.error || `The server is under maintenance.`)
      }

      const data = await response.json()
      return data.rating
   } catch (err: unknown) {
      console.error('Error fetching rating from The Auditor', err)
      return `I am having a hiccup.`
   }
}