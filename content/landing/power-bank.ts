import type { LandingPage } from '@/lib/landingPages'

const powerBankPages: LandingPage[] = [
  {
    slug: 'best-power-bank-iphone-2026',
    // 靜態頁 /best-power-bank-iphone-2026 是主要版本（內容更豐富）
    // 讓此動態模板頁的 canonical 指向靜態頁，避免 Google 視為重複內容
    canonicalOverride: '/best-power-bank-iphone-2026',

    // ── Metadata：全部繁體中文，與頁面內容語言一致 ─────────────────────────
    title: 'iPhone 行動電源推薦 2026｜MagSafe 磁吸行動電源 Top 3 實測比較',
    description:
      '2026 最新 iPhone 行動電源推薦：實測 12 款以上 MagSafe 磁吸行動電源，整理出最適合出國旅行、日常通勤與追求輕薄的 Top 3。Anker MagGo、JV3C、CW 完整比較。',
    keywords: [
      'iPhone行動電源推薦2026',
      'MagSafe行動電源推薦',
      '磁吸行動電源',
      'iPhone快充行動電源',
      '行動電源推薦',
      '行動電源可以帶上飛機嗎',
      '10000mAh行動電源',
    ],

    category: '行動電源推薦',
    updatedLabel: '2026年最新版',
    heroTitle: 'iPhone 行動電源推薦 2026',
    heroSubtitle: 'MagSafe 磁吸 Top 3 實測比較',
    heroDesc:
      '我們測試了 12 款以上行動電源，篩選出 2026 年最值得入手的 iPhone 磁吸行動電源。無論你需要出國旅行、日常通勤還是極致輕薄，這裡都有對應的最佳選擇。',
    buyingGuideTitle: 'iPhone 行動電源怎麼選？',
    buyingGuideIntro:
      '選擇行動電源前，先確認你最重要的使用情境。以下四個關鍵因素幫你快速縮小選擇範圍。',
    products: [
      {
        rank: 1,
        badge: '✦ 最推薦',
        badgeColor: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
        accentColor: 'border-amber-200',
        topBarColor: 'from-amber-300 via-amber-400 to-amber-300',
        name: 'Anker MagGo 行動電源 10000',
        tagline: '2026 iPhone 首選 MagSafe 行動電源',
        description:
          'Anker MagGo 10000 是大多數 iPhone 用戶的最佳選擇。MagSafe 磁吸直接附著機背，15W 無線充電加上 20W USB-C 快充，一次可充滿 iPhone 約 2 次以上，輕薄設計方便隨身攜帶。',
        pros: ['MagSafe 15W 磁吸快充', 'USB-C PD 20W 有線快充', '10,000mAh 可充 2 次以上 iPhone', '輕薄設計（215g）', '支援邊充邊用'],
        cons: ['無電量數字顯示', '無線充電僅支援磁吸區'],
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
        badge: '✦ 出國首選',
        badgeColor: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
        accentColor: 'border-violet-200',
        topBarColor: 'from-violet-300 via-violet-400 to-violet-300',
        name: 'JV3C MAG Lite Qi2 行動電源',
        tagline: 'CCC 認證，搭機無壓力',
        description:
          '通過 CCC 認證，符合民航局規範，是長途飛行旅行者的首選。Qi2 磁吸充電相容 iPhone 12 以上機型，輕量機身搭配 LED 電量顯示，隨時掌握電量。',
        pros: ['CCC 航空認證，可安心登機', 'Qi2 磁吸 15W 快充', 'LED 電量顯示', '輕量設計（160g）', '兩組輸出'],
        cons: ['容量較小（5,000mAh）', '無 USB-A 輸出'],
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
        badge: '✦ 最高 CP 值',
        badgeColor: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
        accentColor: 'border-emerald-200',
        topBarColor: 'from-emerald-300 via-emerald-400 to-emerald-300',
        name: 'CW 極上超薄磁吸行動電源',
        tagline: '最輕薄通勤首選',
        description:
          '追求輕量日常攜帶的最佳選擇。超薄機身只有 9mm，放進小包完全無感。磁吸設計相容 MagSafe，適合通勤族與小包使用者，CP 值最高。',
        pros: ['超薄 9mm 機身', '磁吸 MagSafe 相容', '超輕量（120g）', 'CP 值極高', '日常通勤首選'],
        cons: ['容量較小（5,000mAh）', '充電速度較慢（10W）'],
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
      { icon: '⚡', title: '充電速度',             body: '確認是否支援 USB-C PD 20W 以上有線快充，或 Qi2/MagSafe 15W 無線充電。一般 Qi 無線充電只有 5–7.5W，差距很大。' },
      { icon: '🧲', title: 'MagSafe / Qi2 相容性', body: 'iPhone 12 以上用戶建議選擇 MagSafe 相容款，可磁吸附著手機背面同步使用，免插線更方便。' },
      { icon: '✈️', title: '航空法規',             body: '出國旅行必看！選擇通過 CCC 或 UN38.3 認證的產品，才能安心帶上飛機。容量不超過 100Wh（約 27,000mAh）。' },
      { icon: '⚖️', title: '容量 vs 重量',         body: '日常通勤選 5,000mAh（輕量、不佔空間），長途旅行選 10,000mAh 以上。超過 20,000mAh 的款式通常不允許上飛機。' },
    ],
    useCases: [
      { use: '日常通勤、小包族',   pick: 'CW 極上超薄',       href: 'https://s.shopee.tw/AAEiOOSC0q' },
      { use: '出國旅行、搭飛機',   pick: 'JV3C MAG Lite Qi2', href: 'https://s.shopee.tw/9fIRnNrYXJ' },
      { use: '大多數 iPhone 用戶', pick: 'Anker MagGo 10000', href: 'https://s.shopee.tw/BRMU4jbUI'  },
    ],
    midCta: {
      label: '編輯首選',
      productName: 'Anker MagGo 10000',
      body: '最適合大多數 iPhone 用戶——MagSafe 15W 無線 + 20W 有線快充，10,000mAh 撐兩天沒問題。',
      href: 'https://s.shopee.tw/BRMU4jbUI',
      ctaText: '查看 Anker MagGo 最新價格 →',
    },
    // ── FAQ：全部統一為繁體中文 ──────────────────────────────
    faqs: [
      {
        q: 'iPhone 需要幾 mAh 的行動電源？',
        a: 'iPhone 15/16 電池約 3,274–4,685mAh，5,000mAh 行動電源可充約一次電，10,000mAh 可充兩次以上。日常通勤選 5,000mAh 夠用，長途旅行建議 10,000mAh 以上。',
      },
      {
        q: '行動電源可以帶上飛機嗎？',
        a: '可以，但只能放隨身行李，不能託運。一般航空公司允許 100Wh（約 27,000mAh）以下的行動電源登機。JV3C MAG Lite 通過 CCC 認證，是符合規範的選擇。',
      },
      {
        q: 'MagSafe 行動電源值得買嗎？',
        a: '如果你使用 iPhone 12 以上，非常值得。MagSafe 行動電源可直接磁吸在手機背面邊走邊充，不需要插線。Qi2 規格保證 15W 無線充電，比一般 Qi 快很多。',
      },
      {
        q: '哪一款 iPhone 行動電源充電最快？',
        a: '有線充電選支援 USB-C PD 20W 以上的款式最快。Anker MagGo 10000 同時支援 MagSafe 15W 無線與 USB-C PD 20W 有線，是本次推薦中雙模充電速度最快的選擇。',
      },
      {
        q: '要選多大容量的行動電源？',
        a: 'iPhone 15/16 電池約 3,274–4,685mAh，5,000mAh 行動電源可充約一次電，10,000mAh 可充兩次以上。日常通勤選 5,000mAh 夠用，長途旅行建議 10,000mAh 以上。',
      },
      {
        q: 'MagSafe 與一般行動電源差在哪？',
        a: 'MagSafe 行動電源可直接磁吸在 iPhone 背面，不需要充電線即可使用，攜帶更方便，也能邊走邊充。支援 Qi2 的款式最高可達 15W 無線快充，比一般 Qi（5–7.5W）快一倍以上。',
      },
    ],
  },
]

export default powerBankPages
