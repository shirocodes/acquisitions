import aj from '../config/arcjet.js';
// Arcjet security middleware for Express.js
// This middleware applies rate limiting and bot detection based on user roles
// It uses the Arcjet library to enforce security policies
// and logs security events for monitoring purposes.
// The middleware checks the user's role and applies different rate limits accordingly.
// It also handles bot detection and shields against unwanted requests.
// If a request is blocked, it responds with a 403 Forbidden status and an appropriate message.
// If an error occurs during processing, it logs the error and responds with a 500 Internal Server Error status.
// This middleware should be used in the Express.js application to protect routes from abuse and ensure security compliance.
import logger from '../config/logger.js';
import { slidingWindow } from '@arcjet/node';

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';

    let limit;

    switch (role) {
      case 'admin':
        limit = 20;
        break;
      case 'user':
        limit = 10;
        break;
      case 'guest':
        limit = 5;
        break;
    }

    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: limit,
        name: `${role}-rate-limit`,
      })
    );

    const decision = await client.protect(req);

    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn('Bot request blocked', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });

      return res
        .status(403)
        .json({
          error: 'Forbidden',
          message: 'Automated requests are not allowed',
        });
    }

    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Shield Blocked request', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });

      return res
        .status(403)
        .json({
          error: 'Forbidden',
          message: 'Request blocked by security policy',
        });
    }

    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });

      return res
        .status(403)
        .json({ error: 'Forbidden', message: 'Too many requests' });
    }

    next();
  } catch (e) {
    console.error('Arcjet middleware error:', e);
    res
      .status(500)
      .json({
        error: 'Internal server error',
        message: 'Something went wrong with security middleware',
      });
  }
};
export default securityMiddleware;