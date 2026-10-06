// ============================================================================
// 個人作品（Artwork）設定 —— 內容警示頁隨機展示其中一張
//
// 新增作品：
//   1. 把圖片放到 public/artworks/（建議 webp，寬度 1200px 左右、500KB 以內）
//   2. 檔名建議：artwork-04.webp、artwork-05.webp…（只用小寫英數與 -）
//   3. 在下面 ARTWORKS 陣列加一行
// 刪除作品：刪掉陣列中那一行（圖片檔可留可刪）
// 更換作品：覆蓋同名圖片，或修改 src
//
// 這裡完全不影響短網址 / 密碼 / redirect 邏輯。陣列為空時頁面會自動隱藏作品區。
// src 只能是本站路徑（以 / 開頭），頁面的 CSP 只允許載入本站圖片。
// ============================================================================

export interface Artwork {
  /** 本站路徑，例如 /artworks/artwork-01.webp */
  src: string
  /** 作品名稱（顯示在圖片下方） */
  title: string
  /** 替代文字（無障礙用） */
  alt: string
  /** 選填：年份或媒材，例如 "2026 · Digital" */
  caption?: string
}

export const ARTWORKS: Artwork[] = [
  {
    src: '/artworks/artwork-01.svg',
    title: 'Morning Tide',
    alt: '藍綠色調的抽象波浪構圖',
    caption: '範例作品 · 請替換成你的作品',
  },
  {
    src: '/artworks/artwork-02.svg',
    title: 'Paper Sun',
    alt: '暖橘色圓形與層疊色塊的抽象構圖',
    caption: '範例作品 · 請替換成你的作品',
  },
  {
    src: '/artworks/artwork-03.svg',
    title: 'Quiet Grid',
    alt: '柔和色塊排列成的幾何格線',
    caption: '範例作品 · 請替換成你的作品',
  },
]
