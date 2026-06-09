import Image from "next/image";
interface AffiliateCardProps {
  name: string;
  description: string;
  href: string;
  badge?: string;
  price?: string;
  image?: string;
}

export default function AffiliateCard({
  name,
  description,
  href,
  badge,
  price,
  image,
}: AffiliateCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 my-6 flex flex-col md:flex-row items-start justify-between gap-4">
      {/* 左邊內容 */}
      <div className="flex-1 min-w-0">
        {/* 圖片 */}
        {image && (
          <Image
            src={image}
            alt={name}
            width={600}
            height={200}
            className="w-full h-32 object-cover rounded mb-2"
          />
        )}

        {/* 標題 + badge */}
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-gray-900">{name}</span>

          {badge && (
            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">
              {badge}
            </span>
          )}
        </div>

        {/* 描述 */}
        <p className="text-sm text-gray-500">{description}</p>

        {/* 價格 */}
        {price && (
          <p className="text-sm font-medium text-gray-700 mt-1">{price}</p>
        )}
      </div>

      {/* 右邊按鈕 */}
      <a
        href={href}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className="shrink-0 text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 transition-colors px-4 py-2 rounded-md"
      >
        查看優惠
      </a>
    </div>
  );
}
