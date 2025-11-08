// Simple in-memory rate limiting (use Redis in production)

const rateLimit = new Map();

export function checkRateLimit(identifier, maxRequests = 100, windowMs = 60000) {
  const now = Date.now();
  const userRequests = rateLimit.get(identifier) || [];
  
  // Remove old requests outside the time window
  const recentRequests = userRequests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }
  
  recentRequests.push(now);
  rateLimit.set(identifier, recentRequests);
  
  return { allowed: true, remaining: maxRequests - recentRequests.length };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, requests] of rateLimit.entries()) {
    const recent = requests.filter(time => now - time < 60000);
    if (recent.length === 0) {
      rateLimit.delete(key);
    } else {
      rateLimit.set(key, recent);
    }
  }
}, 60000);
