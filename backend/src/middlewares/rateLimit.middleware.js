// middlewares/rateLimit.middleware.js
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

const rateLimitHandler = (req, res) => {
  res.status(429).json({
    error: 'Demasiadas solicitudes. Por favor esperá unos minutos e intentá de nuevo.'
  });
};

export const generalLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             200,
  standardHeaders: true,
  legacyHeaders:   false,
  handler:         rateLimitHandler
});

export const authLimiter = rateLimit({
  windowMs:        30 * 60 * 1000,
  max:             5,
  standardHeaders: true,
  legacyHeaders:   false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Demasiados intentos. Por favor esperá 30 minutos antes de intentar de nuevo.'
    });
  }
});

export const passwordResetLimiter = rateLimit({
  windowMs:        30 * 60 * 1000,
  max:             2,
  standardHeaders: true,
  legacyHeaders:   false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Demasiadas solicitudes de recuperación. Intentá en 30 minutos.'
    });
  }
});

// Helper para keyGenerator con soporte IPv6
const userOrIpKey = (req) => req.user?.id?.toString() ?? ipKeyGenerator(req);

export const uploadLimiter = rateLimit({
  windowMs:        30 * 60 * 1000,
  max:             5,
  standardHeaders: true,
  legacyHeaders:   false,
  keyGenerator:    userOrIpKey,
  handler:         rateLimitHandler
});

export const resendLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             2,
  standardHeaders: true,
  legacyHeaders:   false,
  keyGenerator:    userOrIpKey,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Demasiadas solicitudes. Intentá en 15 minutos.'
    });
  }
});

export const orderLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             2,
  standardHeaders: true,
  legacyHeaders:   false,
  keyGenerator:    userOrIpKey,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Demasiadas compras. Intentá en 15 minutos.'
    });
  }
});


// ADMIN
export const uploadAdminLimiter = rateLimit({
  windowMs:        30 * 60 * 1000,
  max:             20,
  standardHeaders: true,
  legacyHeaders:   false,
  keyGenerator:    userOrIpKey,
  handler:         rateLimitHandler
});

export const resendAdminLimiter = rateLimit({
  windowMs:        30 * 60 * 1000,
  max:             10,
  standardHeaders: true,
  legacyHeaders:   false,
  keyGenerator:    userOrIpKey,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Demasiadas solicitudes. Intentá en 30 minutos.'
    });
  }
});