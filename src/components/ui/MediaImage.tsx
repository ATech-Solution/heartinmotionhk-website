import Image from 'next/image'

interface MediaImageProps {
  media?: {
    url?: string | null
    alt?: string | null
    width?: number | null
    height?: number | null
    filename?: string | null
    sizes?: {
      thumbnail?: { url?: string | null }
      card?: { url?: string | null }
      hero?: { url?: string | null }
    }
  } | null
  className?: string
  priority?: boolean
  unoptimized?: boolean
  size?: 'thumbnail' | 'card' | 'hero'
}

export function MediaImage({ media, className, priority, unoptimized, size }: MediaImageProps) {
  if (!media?.url) return null

  const url = size && media.sizes?.[size]?.url ? media.sizes[size]!.url! : media.url

  return (
    <Image
      src={url}
      alt={media.alt ?? ''}
      width={media.width ?? 800}
      height={media.height ?? 600}
      className={className}
      priority={priority}
      unoptimized={unoptimized}
    />
  )
}
