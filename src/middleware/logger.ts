import morgan from 'morgan';
import { Request, Response } from 'express';

// Custom token for response time in milliseconds
morgan.token('response-time-ms', (req: Request, res: Response) => {
  const responseTime = res.getHeader('X-Response-Time');
  return responseTime ? `${responseTime}ms` : '-';
});

// Custom token for request ID (if you want to add request tracking)
morgan.token('request-id', (req: Request) => {
  return (req as any).requestId || '-';
});

// Development format - detailed logging
export const developmentLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :date[clf]',
  {
    skip: (req: Request, res: Response) => {
      // Skip logging for health check endpoints
      return req.url === '/health' || req.url === '/api/health';
    }
  }
);

// Production format - structured logging
export const productionLogger = morgan(
  JSON.stringify({
    method: ':method',
    url: ':url',
    status: ':status',
    contentLength: ':res[content-length]',
    responseTime: ':response-time',
    userAgent: ':user-agent',
    ip: ':remote-addr',
    date: ':date[iso]'
  }),
  {
    skip: (req: Request, res: Response) => {
      return req.url === '/health' || req.url === '/api/health';
    }
  }
);

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: Function) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};
