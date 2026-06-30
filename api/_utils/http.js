export function json(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

export function requireMethod(req, res, method) {
  if (req.method === method) {
    return true;
  }

  res.setHeader('Allow', method);
  json(res, 405, { error: `Method ${req.method} is not allowed.` });
  return false;
}

export async function readJson(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const body = Buffer.concat(chunks).toString('utf8');
  return body ? JSON.parse(body) : {};
}
