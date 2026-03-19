export function readBody<T>(req: NodeJS.ReadableStream): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const parsed = JSON.parse(body || "{}");
        resolve(parsed as T);
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}
