import { buildRatingPayload } from "@/app/lib/payload"
import { PerformSearch } from '@/app/api/searXNG/route'

export async function POST(req: Request) {
   const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY

   if (!POLLINATIONS_API_KEY) {
      return Response.json({ error: 'Backend error occurred' }, { status: 500 })
   }

   try {
      const { tracks, artists, username } = await req.json()

      if (!tracks || !artists || !username) {
         return Response.json({ error: 'Missing data' }, { status: 400 })
      }

      const topTracks = tracks.map((t: any) => t.name)
      const topArtists = artists.map((a: any) => a.name)
      const payload = buildRatingPayload(topTracks, topArtists, username)


      const initialRes = await fetch('https://text.pollinations.ai/openai', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${POLLINATIONS_API_KEY}`
         },
         body: JSON.stringify(payload)
      })

      if (!initialRes.ok) {
         const err = await initialRes.text()
         return Response.json({ error: 'LLM error', detail: err }, { status: 500 })
      }

      const initialData = await initialRes.json()

      //-----TOOL CALL HANDLING START-----

      const toolCall = initialData.choices[0].message.tool_calls?.[0]
      const finishReason = initialData?.choices?.[0]?.finish_reason

      if (toolCall && finishReason === "tool_calls") {
         const toolName = toolCall.function.name
         const toolArgs = JSON.parse(toolCall.function.arguments)

         if (!toolCall.id) {
            return Response.json({ error: 'Missing tool_call_id' }, { status: 500 })
         }

         let toolResult: any

         if (toolName === "web_search") {
            toolResult = await PerformSearch(toolArgs.query)
         } else {
            return Response.json({ error: `Unsupported tool: ${toolName}` }, { status: 400 })
         }

         const toolResponse = await fetch('https://text.pollinations.ai/openai', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${POLLINATIONS_API_KEY}`
            },
            body: JSON.stringify({
               model: payload.model,
               stream: false,
               messages: [
                  ...payload.messages,
                  {
                     role: 'assistant',
                     tool_calls: [toolCall]
                  },
                  {
                     role: 'tool',
                     tool_call_id: toolCall.id,
                     name: toolName,
                     content: JSON.stringify(toolResult)
                  }
               ]
            })
         })

         if (!toolResponse.ok) {
            const errText = await toolResponse.text()
            return Response.json({ error: 'Tool response failed', detail: errText }, { status: 502 })
         }

         const finalData = await toolResponse.json()
         return Response.json({
            rating: finalData.choices?.[0]?.message?.content || 'No final content returned',
         })

         //-----TOOL CALL HANDLING END-----
      }

      //-----NO TOOL CALL-----

      return Response.json({
         rating: initialData.choices?.[0]?.message?.content || 'No content returned',
      })
   } catch (error: any) {
      return Response.json({ error: 'Internal Server Error', detail: error.message }, { status: 500 })
   }
}