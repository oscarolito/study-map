/**
 * Monitoring and error handling utilities for the authentication system
 */

export interface ErrorLog {
  timestamp: string;
  level: 'error' | 'warn' | 'info';
  category: 'auth' | 'payment' | 'database' | 'api';
  message: string;
  details?: any;
  userId?: string;
  sessionId?: string;
}

export interface ConversionEvent {
  timestamp: string;
  userId: string;
  event: 'registration' | 'login' | 'upgrade_attempt' | 'upgrade_success' | 'upgrade_failed';
  metadata?: any;
}

/**
 * Log authentication errors
 */
export function logAuthError(
  message: string,
  details?: any,
  userId?: string,
  sessionId?: string
): void {
  const errorLog: ErrorLog = {
    timestamp: new Date().toISOString(),
    level: 'error',
    category: 'auth',
    message,
    details,
    userId,
    sessionId,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[AUTH ERROR]', errorLog);
  }

  // In production, you would send this to your monitoring service
  // Examples: Sentry, LogRocket, DataDog, etc.
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(new Error(message), { extra: errorLog });
    // Example: fetch('/api/monitoring/error', { method: 'POST', body: JSON.stringify(errorLog) });
  }
}

/**
 * Log payment processing errors
 */
export function logPaymentError(
  message: string,
  details?: any,
  userId?: string,
  stripeSessionId?: string
): void {
  const errorLog: ErrorLog = {
    timestamp: new Date().toISOString(),
    level: 'error',
    category: 'payment',
    message,
    details: {
      ...details,
      stripeSessionId,
    },
    userId,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[PAYMENT ERROR]', errorLog);
  }

  // In production, send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Critical payment errors should be alerted immediately
    // Example: alerting.sendCriticalAlert('Payment processing failed', errorLog);
  }
}

/**
 * Log database errors
 */
export function logDatabaseError(
  message: string,
  details?: any,
  userId?: string
): void {
  const errorLog: ErrorLog = {
    timestamp: new Date().toISOString(),
    level: 'error',
    category: 'database',
    message,
    details,
    userId,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[DATABASE ERROR]', errorLog);
  }

  // In production, send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Database errors might indicate infrastructure issues
    // Example: monitoring.trackDatabaseError(errorLog);
  }
}

/**
 * Log API errors
 */
export function logApiError(
  message: string,
  details?: any,
  userId?: string,
  endpoint?: string
): void {
  const errorLog: ErrorLog = {
    timestamp: new Date().toISOString(),
    level: 'error',
    category: 'api',
    message,
    details: {
      ...details,
      endpoint,
    },
    userId,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[API ERROR]', errorLog);
  }

  // In production, send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Track API error rates and patterns
    // Example: analytics.trackApiError(errorLog);
  }
}

/**
 * Track user conversion events
 */
export function trackConversionEvent(
  userId: string,
  event: ConversionEvent['event'],
  metadata?: any
): void {
  const conversionEvent: ConversionEvent = {
    timestamp: new Date().toISOString(),
    userId,
    event,
    metadata,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.info('[CONVERSION]', conversionEvent);
  }

  // In production, send to analytics service
  if (process.env.NODE_ENV === 'production') {
    // Track conversion funnel and user behavior
    // Example: analytics.track(event, { userId, ...metadata });
    // Example: mixpanel.track(event, conversionEvent);
  }
}

/**
 * Track authentication metrics
 */
export function trackAuthMetrics(
  event: 'login_attempt' | 'login_success' | 'login_failure' | 'registration_attempt' | 'registration_success' | 'registration_failure',
  metadata?: any
): void {
  const timestamp = new Date().toISOString();

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.info('[AUTH METRICS]', { timestamp, event, metadata });
  }

  // In production, send to analytics service
  if (process.env.NODE_ENV === 'production') {
    // Track authentication success rates and patterns
    // Example: analytics.track('auth_event', { event, timestamp, ...metadata });
  }
}

/**
 * Track payment metrics
 */
export function trackPaymentMetrics(
  event: 'checkout_initiated' | 'checkout_completed' | 'checkout_failed' | 'webhook_received' | 'webhook_processed',
  amount?: number,
  currency?: string,
  metadata?: any
): void {
  const timestamp = new Date().toISOString();

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.info('[PAYMENT METRICS]', { timestamp, event, amount, currency, metadata });
  }

  // In production, send to analytics service
  if (process.env.NODE_ENV === 'production') {
    // Track payment conversion rates and revenue
    // Example: analytics.track('payment_event', { event, amount, currency, timestamp, ...metadata });
  }
}

/**
 * Health check for critical system components
 */
export async function performHealthCheck(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, boolean>;
  timestamp: string;
}> {
  const checks: Record<string, boolean> = {};
  const timestamp = new Date().toISOString();

  try {
    // Check database connectivity
    // This would be implemented based on your database setup
    checks.database = true; // Placeholder

    // Check Firebase Auth
    checks.firebase = true; // Placeholder

    // Check Stripe API
    checks.stripe = true; // Placeholder

    // Check external dependencies
    checks.external_apis = true; // Placeholder

    const failedChecks = Object.values(checks).filter(check => !check).length;
    const status = failedChecks === 0 ? 'healthy' : failedChecks <= 1 ? 'degraded' : 'unhealthy';

    return {
      status,
      checks,
      timestamp,
    };
  } catch (error) {
    logApiError('Health check failed', { error: error instanceof Error ? error.message : error });
    
    return {
      status: 'unhealthy',
      checks,
      timestamp,
    };
  }
}

/**
 * Alert for critical system failures
 */
export function sendCriticalAlert(
  title: string,
  message: string,
  details?: any
): void {
  const alert = {
    timestamp: new Date().toISOString(),
    title,
    message,
    details,
    severity: 'critical',
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[CRITICAL ALERT]', alert);
  }

  // In production, send to alerting service
  if (process.env.NODE_ENV === 'production') {
    // Send to PagerDuty, Slack, email, etc.
    // Example: pagerduty.sendAlert(alert);
    // Example: slack.sendMessage('#alerts', `🚨 ${title}: ${message}`);
  }
}

/**
 * Rate limiting and abuse detection
 */
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record || now > record.resetTime) {
      // Reset or create new record
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (record.count >= this.maxAttempts) {
      // Rate limit exceeded
      logAuthError('Rate limit exceeded', { identifier, attempts: record.count });
      return false;
    }

    // Increment attempt count
    record.count++;
    return true;
  }

  getRemainingAttempts(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record || Date.now() > record.resetTime) {
      return this.maxAttempts;
    }
    return Math.max(0, this.maxAttempts - record.count);
  }

  getResetTime(identifier: string): number | null {
    const record = this.attempts.get(identifier);
    if (!record || Date.now() > record.resetTime) {
      return null;
    }
    return record.resetTime;
  }
}

// Global rate limiter instances
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
export const paymentRateLimiter = new RateLimiter(3, 60 * 60 * 1000); // 3 attempts per hour