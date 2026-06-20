// Maps search keywords (normalized, lowercase) to landing page slugs.
// Used for internal linking and keyword-driven navigation.
export const KEYWORD_MAP: Record<string, string> = {
  // power bank — iphone
  'best power bank for iphone':        'best-power-bank-iphone-2026',
  'best power bank for iphone 2026':   'best-power-bank-iphone-2026',
  'magsafe power bank':                'best-power-bank-iphone-2026',
  'iphone portable charger':           'best-power-bank-iphone-2026',
  'best portable charger iphone':      'best-power-bank-iphone-2026',
  'iphone power bank fast charging':   'best-power-bank-iphone-2026',
  'qi2 power bank iphone':             'best-power-bank-iphone-2026',
}

export function getSlugForKeyword(keyword: string): string | undefined {
  return KEYWORD_MAP[keyword.toLowerCase().trim()]
}
