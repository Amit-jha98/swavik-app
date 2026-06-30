import { json, requireMethod } from '../_utils/http.js';

export default function handler(req, res) {
  if (!requireMethod(req, res, 'GET')) {
    return;
  }

  json(res, 200, {
    status: 'ready',
    message: 'Protected order management will be connected in Phase 6.'
  });
}
