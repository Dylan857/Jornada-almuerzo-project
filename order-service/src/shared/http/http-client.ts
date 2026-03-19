export async function httpRequest(
  method: string,
  url: string,
  body?: any
) {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  })

  return response.json()
}