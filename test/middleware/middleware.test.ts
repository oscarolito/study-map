import { NextRequest, NextResponse } from 'next/server';
import { middleware } from '@/middleware';

// Mock NextResponse
const mockRedirect = vi.fn();
const mockNext = vi.fn();

vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server');
  return {
    ...actual,
    NextResponse: {
      redirect: mockRedirect,
      next: mockNext,
    },
  };
});

describe('Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNext.mockReturnValue({ type: 'next' });
    mockRedirect.mockReturnValue({ type: 'redirect' });
  });

  const createRequest = (pathname: string, sessionCookie?: string) => {
    const url = `https://example.com${pathname}`;
    const request = {
      nextUrl: { pathname, searchParams: new URLSearchParams() },
      url,
      cookies: {
        get: vi.fn((name: string) => 
          name === 'session' && sessionCookie ? { value: sessionCookie } : undefined
        ),
      },
    } as unknown as NextRequest;
    return request;
  };

  it('should allow access to API routes without authentication', async () => {
    const request = createRequest('/api/auth/session');
    
    const response = await middleware(request);
    
    expect(mockNext).toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('should allow access to static files without authentication', async () => {
    const request = createRequest('/_next/static/css/app.css');
    
    const response = await middleware(request);
    
    expect(mockNext).toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('should redirect unauthenticated users from protected routes', async () => {
    const request = createRequest('/map');
    
    await middleware(request);
    
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.objectContaining({
        href: 'https://example.com/login?redirect=%2Fmap'
      })
    );
  });

  it('should allow authenticated users to access protected routes', async () => {
    const request = createRequest('/map', 'valid-session-token');
    
    await middleware(request);
    
    expect(mockNext).toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('should redirect authenticated users from auth routes to map', async () => {
    const request = createRequest('/login', 'valid-session-token');
    
    await middleware(request);
    
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.objectContaining({
        href: 'https://example.com/map'
      })
    );
  });

  it('should redirect authenticated users from auth routes to specified redirect URL', async () => {
    const request = createRequest('/login', 'valid-session-token');
    request.nextUrl.searchParams.set('redirect', '/account');
    
    await middleware(request);
    
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.objectContaining({
        href: 'https://example.com/account'
      })
    );
  });

  it('should allow unauthenticated users to access auth routes', async () => {
    const request = createRequest('/login');
    
    await middleware(request);
    
    expect(mockNext).toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('should allow access to public routes without authentication', async () => {
    const request = createRequest('/');
    
    await middleware(request);
    
    expect(mockNext).toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('should handle account route protection', async () => {
    const request = createRequest('/account');
    
    await middleware(request);
    
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.objectContaining({
        href: 'https://example.com/login?redirect=%2Faccount'
      })
    );
  });

  it('should handle pricing route protection', async () => {
    const request = createRequest('/pricing');
    
    await middleware(request);
    
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.objectContaining({
        href: 'https://example.com/login?redirect=%2Fpricing'
      })
    );
  });
});