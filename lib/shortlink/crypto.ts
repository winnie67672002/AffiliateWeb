import {
  createHash,
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
  type ScryptOptions,
} from 'node:crypto'
import { SHORT_CODE_ALPHABET, SHORT_CODE_LENGTH, SHORT_CODE_PATTERN } from './config'

// ============================================================================
// Short code：crypto.randomBytes + rejection sampling（避免 modulo bias）
// ============================================================================

// 62 * 4 = 248；>= 248 的 byte 丟掉重抽，讓每個字元機率完全一致。
const UNBIASED_LIMIT = Math.floor(256 / SHORT_CODE_ALPHABET.length) * SHORT_CODE_ALPHABET.length

function randomBase62(length: number): string {
  let out = ''
  while (out.length < length) {
    const bytes = randomBytes(length * 2)
    for (const b of bytes) {
      if (b >= UNBIASED_LIMIT) continue
      out += SHORT_CODE_ALPHABET[b % SHORT_CODE_ALPHABET.length]
      if (out.length === length) break
    }
  }
  return out
}

/**
 * 產生 7 碼短代碼，保證同時含大寫字母與數字。
 * （全小寫的既有路由，如 /contact，因此永遠不會被誤判為短網址。）
 * 唯一性由資料庫 unique index 保證，碰撞時由呼叫端重抽。
 */
export function generateShortCode(): string {
  for (;;) {
    const code = randomBase62(SHORT_CODE_LENGTH)
    if (SHORT_CODE_PATTERN.test(code)) return code
  }
}

// ============================================================================
// Delete token：256-bit 隨機值，DB 只存 SHA-256
// ============================================================================

export function generateDeleteToken(): string {
  return `del_${randomBytes(32).toString('base64url')}`
}

/** 256-bit 隨機 token 不需要慢雜湊；SHA-256 即可防止 DB 外洩後被還原。 */
export function sha256Hex(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex')
}

// ============================================================================
// Password：Node 內建 scrypt（memory-hard），不需額外套件
// 格式：scrypt$N$r$p$<salt base64url>$<hash base64url>
// ============================================================================

const SCRYPT_N = 32768 // 2^15
const SCRYPT_R = 8
const SCRYPT_P = 1
const SCRYPT_KEYLEN = 32
const SCRYPT_MAXMEM = 64 * 1024 * 1024

function scrypt(password: string, salt: Buffer, keylen: number, options: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, keylen, options, (err, derivedKey) => {
      if (err) reject(err)
      else resolve(derivedKey)
    })
  })
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const hash = await scrypt(password.normalize('NFKC'), salt, SCRYPT_KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: SCRYPT_MAXMEM,
  })
  return ['scrypt', SCRYPT_N, SCRYPT_R, SCRYPT_P, salt.toString('base64url'), hash.toString('base64url')].join('$')
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$')
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false
  const N = Number(parts[1])
  const r = Number(parts[2])
  const p = Number(parts[3])
  if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p)) return false
  if (N < 2 || N > 1 << 20 || r < 1 || r > 32 || p < 1 || p > 16) return false

  const salt = Buffer.from(parts[4], 'base64url')
  const expected = Buffer.from(parts[5], 'base64url')
  if (salt.length < 16 || expected.length < 16) return false

  const actual = await scrypt(password.normalize('NFKC'), salt, expected.length, {
    N,
    r,
    p,
    maxmem: SCRYPT_MAXMEM,
  })
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

// ============================================================================
// Rate limit 用的 IP 雜湊：HMAC-SHA256，金鑰為 server-only secret，
// 讓資料庫裡看不出原始 IP（IPv4 只有 2^32 種，單純 SHA-256 可被暴力還原）。
// ============================================================================

export function hmacIp(ip: string, secret: string): string {
  return createHmac('sha256', secret).update(`shortlink-rl:${ip}`, 'utf8').digest('base64url')
}
