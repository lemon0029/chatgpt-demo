import { createParser } from 'eventsource-parser'
import type { ParsedEvent, ReconnectInterval } from 'eventsource-parser'
import type { ChatMessage } from '@/types'

export const generatePayload = (
  apiKey: String,
  messages: ChatMessage[],
  temperature: number,
): RequestInit & { dispatcher?: any } => ({
  headers: {
    'Content-Type': 'application/json',
    // @ts-ignore
    'api-key': apiKey,
  },
  method: 'POST',
  body: JSON.stringify({
    messages,
    temperature,
    stream: true,
  }),
})

export const parseOpenAIStream = (rawResponse: Response) => {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  if (!rawResponse.ok) {
    return new Response(rawResponse.body, {
      status: rawResponse.status,
      statusText: rawResponse.statusText,
    })
  }

  const stream = new ReadableStream({
    async start(controller) {
      const streamParser = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          if (event.data === '[DONE]') {
            controller.close()
            return
          }

          const json = JSON.parse(event.data)
          if (json['id'] === '') {
            return
          }

          try {
            const text = json['choices'][0]['delta']?.content || ''
            const queue = encoder.encode(text)
            controller.enqueue(queue)
          } catch (e) {
            controller.error(e)
          }
        }
      }

      const parser = createParser(streamParser)
      for await (const chunk of rawResponse.body as any)
        parser.feed(decoder.decode(chunk))
    },
  })

  return new Response(stream)
}
