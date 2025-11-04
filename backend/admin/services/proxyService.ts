import { AdminStatus } from '../models/adminModel.js';

const ALLOWLIST = [
  'testphp.vulnweb.com',
  'juice-shop.herokuapp.com',
  'juice-shop.github.io',
  'badssl.com'
];

export function getAdminStatus(): AdminStatus {
  return new AdminStatus({ allowlist: ALLOWLIST });
}

export interface ValidationResult {
  isValid: boolean;
  status: number;
  message: string;
  url?: string;
}

export function validateTargetUrl(target: string | undefined): ValidationResult {
  if (!target || typeof target !== 'string') {
    return {
      isValid: false,
      status: 400,
      message: 'Missing url param'
    };
  }

  try {
    const urlObj = new URL(target);
    if (!ALLOWLIST.includes(urlObj.hostname)) {
      return {
        isValid: false,
        status: 403,
        message: 'Domain not allowed'
      };
    }
    return { isValid: true, status: 200, message: 'ok', url: urlObj.toString() };
  } catch (error) {
    return {
      isValid: false,
      status: 400,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}

export interface ProxyResult {
  status: number;
  headers: Record<string, string>;
  body: Buffer;
  error?: ValidationResult;
}

export async function proxyRequest(targetUrl: string): Promise<ProxyResult> {
  const validation = validateTargetUrl(targetUrl);
  if (!validation.isValid) {
    return { error: validation } as ProxyResult;
  }

  const upstream = await fetch(targetUrl, { redirect: 'follow' });

  const headers: Record<string, string> = {};
  upstream.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (['x-frame-options', 'content-security-policy'].includes(lower)) {
      return;
    }
    headers[key] = value;
  });

  headers['X-Frame-Options'] = '';
  headers['Content-Security-Policy'] = "frame-ancestors 'self' *";

  const bodyBuffer = Buffer.from(await upstream.arrayBuffer());

  return {
    status: upstream.status,
    headers,
    body: bodyBuffer
  };
}

export { ALLOWLIST };