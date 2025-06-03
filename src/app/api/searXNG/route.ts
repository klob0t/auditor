import * as cheerio from 'cheerio'

export async function PerformSearch(query: string) {
   const params = new URLSearchParams({
      q: query,
      category_general: '1',
      language: 'auto',
      time_range: '',
      safesearch: '0',
      theme: 'simple',
   })

   const SEARXNG_BASE_URL = 'https://searx.tiekoetter.com'

   const searchUrl = `${SEARXNG_BASE_URL}/search?${params.toString()}`
   const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'

   try {
      const response = await fetch(searchUrl, {
         headers: {
            'User-Agent': userAgent
         }
      })

      if (!response.ok) {
         const errText = await response.text()
         return Response.json({ error: 'Search failed', detail: errText }, { status: response.status })
      }

      const html = await response.text()

      const $ = cheerio.load(html)
      const results: { title: string; url: string; snippet: string }[] = []

      $('article.result').each((i, elem) => {
         const title = $(elem).find('h3 > a').text().trim()
         const url = $(elem).find('h3 > a').attr('href') ?? ''
         const snippet = $(elem).find('p.content').text().trim()

         if (title && url) {
            results.push({ title, url, snippet })
         }
      })

      return { results: results.slice(0, 5) }
   } catch (error: any) {
      return { error: 'Failed to perform web search due to an unexpected error.', details: error.message }
   }
}

export async function POST(request: Request) {
   try {
      const body = await request.json()

      const { tool_name, tool_input } = body

      if (tool_name === 'web_search') {
         const query = tool_input?.query

         if (!query || typeof query !== 'string') {
            return Response.json({ error: 'Missing or invalid query' }, { status: 400 })
         }

         const searchResults = await PerformSearch(query)

         const responsePayload = {
            tool_name: tool_name,
            tool_output: searchResults
         }

         return Response.json(responsePayload, { status: 200 })
      }

      return Response.json({ error: 'Unsupported tool' }, { status: 400 })
   } catch (err: any) {
      return Response.json({ error: err, details: err.message }, { status: 500 })
   }
}