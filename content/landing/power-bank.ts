import type { LandingPage } from '@/lib/landingPages'

const powerBankPages: LandingPage[] = [
  {
    slug: 'best-power-bank-iphone-2026',
    title: 'Best Power Bank for iPhone 2026 — Top 3 Picks Tested',
    description:
      'Looking for the best power bank for iPhone in 2026? We tested 12+ options. Here are the top 3 MagSafe-compatible picks for travel, daily carry, and fast charging.',
    keywords: [
      'best power bank for iphone 2026',
      'magsafe power bank',
      'iphone portable charger',
      'best portable charger iphone',
    ],
    category: '行動電源推薦',
    updatedLabel: '2026年最新版',
    heroTitle: 'Best Power Bank for iPhone 2026',
    heroSubtitle: 'Top 3 實測推薦',
    heroDesc:
      '我們測試了 12 款以上行動電源，篩選出 2026 年最值得入手的 iPhone 磁吸行動電源。無論你需要出國旅行、日常通勤還是極致輕薄，這裡都有對應的最佳選擇。',
    buyingGuideTitle: 'iPhone 行動電源怎麼選？',
    buyingGuideIntro:
      '選擇行動電源前，先確認你最重要的使用情境。以下四個關鍵因素幫你快速縮小選擇範圍。',
    products: [
      {
        rank: 1,
        badge: '✦ Best Overall',
        badgeColor: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
        accentColor: 'border-amber-200',
        topBarColor: 'from-amber-300 via-amber-400 to-amber-300',
        name: 'Anker MagGo Power Bank 10000',
        tagline: 'Best MagSafe Power Bank for iPhone in 2026',
        description:
          'The Anker MagGo 10000 is our top pick for most iPhone users. It snaps magnetically to your iPhone 12–16 via MagSafe, delivers 15W wireless + 20W USB-C fast charge, and packs enough juice for 2+ full iPhone charges.',
        pros: ['MagSafe 15W wireless', '20W USB-C PD', '10,000mAh — 2+ iPhone charges', 'Slim & lightweight (215g)', 'Pass-through charging'],
        cons: ['No display', 'Wireless charging only on MagSafe side'],
        specs: {
          capacity: '10,000mAh',
          weight: '215g',
          maxOutput: '20W',
          magsafe: true,
          price: 'NT$1,800–2,200',
        },
        price: 'NT$1,800–2,200',
        image: '/images/anker-maggo.jpg',
        href: 'https://s.shopee.tw/BRMU4jbUI',
        ctaText: '查看最新價格 →',
      },
      {
        rank: 2,
        badge: '✦ Best for Travel',
        badgeColor: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
        accentColor: 'border-violet-200',
        topBarColor: 'from-violet-300 via-violet-400 to-violet-300',
        name: 'JV3C MAG Lite Qi2 行動電源',
        tagline: 'CCC 認證，搭機無壓力',
        description:
          '通過 CCC 認證，符合民航局規範，是長途飛行旅行者的首選。Qi2 磁吸充電相容 iPhone 12 以上機型，輕量機身搭配 LED 電量顯示，隨時掌握電量。',
        pros: ['CCC 航空認證', 'Qi2 磁吸 15W', 'LED 電量顯示', '輕量設計', '兩組輸出'],
        cons: ['容量較小', '無 USB-A 輸出'],
        specs: {
          capacity: '5,000mAh',
          weight: '160g',
          maxOutput: '15W',
          magsafe: true,
          price: 'NT$1,100–1,300',
        },
        price: 'NT$1,100–1,300',
        image: '/images/jv3c.jpg',
        href: 'https://s.shopee.tw/9fIRnNrYXJ',
        ctaText: '查看最新價格 →',
      },
      {
        rank: 3,
        badge: '✦ Best Value',
        badgeColor: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
        accentColor: 'border-emerald-200',
        topBarColor: 'from-emerald-300 via-emerald-400 to-emerald-300',
        name: 'CW 極上超薄磁吸行動電源',
        tagline: '最輕薄 CP 值選擇',
        description:
          '追求輕量日常攜帶的最佳選擇。超薄機身只有 9mm，放進小包完全無感。磁吸設計相容 MagSafe，適合通勤族與小包使用者。',
        pros: ['超薄 9mm 機身', '磁吸 MagSafe 相容', '輕量 120g', 'CP 值極高', '日常通勤首選'],
        cons: ['容量較小', '充電速度較慢'],
        specs: {
          capacity: '5,000mAh',
          weight: '120g',
          maxOutput: '10W',
          magsafe: true,
          price: 'NT$800–1,000',
        },
        price: 'NT$800–1,000',
        image: '/images/cw-slim.jpg',
        href: 'https://s.shopee.tw/AAEiOOSC0q',
        ctaText: '查看最新價格 →',
      },
    ],
    comparisonColumns: [
      { label: '容量',    key: 'capacity'  },
      { label: '重量',    key: 'weight'    },
      { label: '最大輸出', key: 'maxOutput' },
      { label: 'MagSafe', key: 'magsafe'  },
      { label: '參考售價', key: 'price'    },
    ],
    buyingGuide: [
      { icon: '⚡', title: '充電速度',         body: '確認是否支援 USB-C PD 20W 以上有線快充，或 Qi2/MagSafe 15W 無線充電。一般 Qi 無線充電只有 5–7.5W，差距很大。' },
      { icon: '🧲', title: 'MagSafe / Qi2 相容性', body: 'iPhone 12 以上用戶建議選擇 MagSafe 相容款，可磁吸附著手機背面同步使用，免插線更方便。' },
      { icon: '✈️', title: '航空法規',         body: '出國旅行必看！選擇通過 CCC 或 UN38.3 認證的產品，才能安心帶上飛機。容量不超過 100Wh（約 27,000mAh）。' },
      { icon: '⚖️', title: '容量 vs 重量',     body: '日常通勤選 5,000mAh（輕量、不佔空間），長途旅行選 10,000mAh 以上。超過 20,000mAh 的款式通常不允許上飛機。' },
    ],
    useCases: [
      { use: '日常通勤、小包族',   pick: 'CW 極上超薄',    href: 'https://s.shopee.tw/AAEiOOSC0q' },
      { use: '出國旅行、搭飛機',   pick: 'JV3C MAG Lite', href: 'https://s.shopee.tw/9fIRnNrYXJ' },
      { use: '大多數 iPhone 用戶', pick: 'Anker MagGo 10000', href: 'https://s.shopee.tw/BRMU4jbUI' },
    ],
    midCta: {
      label: '編輯首選',
      productName: 'Anker MagGo 10000',
      body: '最適合大多數 iPhone 用戶——MagSafe 15W 無線 + 20W 有線快充，10,000mAh 撐兩天沒問題。',
      href: 'https://s.shopee.tw/BRMU4jbUI',
      ctaText: '查看 Anker MagGo 最新價格 →',
    },
    faqs: [
      {
        q: 'How many mAh do I need for an iPhone?',
        a: 'For iPhone 15/16 (3,274–4,685mAh battery), a 5,000mAh power bank gives roughly 1 full charge. 10,000mAh gives 2+ charges. For travel or multi-day trips, we recommend at least 10,000mAh.',
      },
      {
        q: 'Can I bring a power bank on a plane?',
        a: 'Yes, but only in carry-on luggage — never checked bags. Most airlines allow power banks up to 100Wh (roughly 27,000mAh at 3.7V). The JV3C MAG Lite in our list is CCC-certified and compliant with airline regulations.',
      },
      {
        q: 'Is MagSafe worth it for power banks?',
        a: 'Yes, if you use iPhone 12 or later. MagSafe power banks snap on magnetically so you can keep using your phone while charging — no cable needed. Qi2 standard also guarantees 15W wireless charging, significantly faster than standard Qi.',
      },
      {
        q: 'What is the fastest charging power bank for iPhone?',
        a: 'For wired charging, look for USB-C Power Delivery (PD) 20W or higher. The Anker MagGo 10000 supports both 15W MagSafe wireless and 20W USB-C PD — the fastest dual-mode option in our list.',
      },
      {
        q: '行動電源可以帶上飛機嗎？',
        a: '可以，但只能放隨身行李，不能託運。一般航空公司允許 100Wh（約 27,000mAh）以下的行動電源登機。JV3C MAG Lite 通過 CCC 認證，是符合規範的選擇。',
      },
      {
        q: '要選多大容量的行動電源？',
        a: 'iPhone 15/16 電池約 3,274–4,685mAh，5,000mAh 行動電源可充約一次電，10,000mAh 可充兩次以上。日常通勤選 5,000mAh 夠用，長途旅行建議 10,000mAh 以上。',
      },
    ],
  },
]

export default powerBankPages
