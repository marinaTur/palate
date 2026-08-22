// Yandex Cloud Function equivalent of netlify/functions/ask-sommelier.js.
// Runs on Yandex's servers, never in the visitor's browser — the API key
// lives only here, as an environment variable set on the Cloud Function.
// Entry point to configure in the Yandex Cloud console: index.handler

exports.handler = async (event) => {
  const jsonResponse = (statusCode, payload) => ({
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    isBase64Encoded: false,
    body: JSON.stringify(payload),
  })

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return jsonResponse(500, { error: 'Server is missing ANTHROPIC_API_KEY. Add it in Yandex Cloud Console → Cloud Functions → ask-sommelier → Environment variables.' })
  }

  let body
  try {
    body = JSON.parse(event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf-8') : event.body)
  } catch {
    return jsonResponse(400, { error: 'Invalid request body' })
  }

  const { system, message, maxTokens = 1000 } = body
  if (!message) {
    return jsonResponse(400, { error: 'Missing "message" field' })
  }

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: maxTokens,
        system: system || undefined,
        messages: [{ role: 'user', content: message }],
      }),
    })

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text()
      return jsonResponse(anthropicRes.status, { error: `Anthropic API error: ${anthropicRes.status}`, detail: errText })
    }

    const data = await anthropicRes.json()
    const text = data.content.map((b) => b.text || '').join('')

    return jsonResponse(200, { text })
  } catch (err) {
    return jsonResponse(502, { error: 'Failed to reach Anthropic API', detail: String(err) })
  }
}
