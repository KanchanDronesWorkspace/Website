import Link from "next/link"
import Image from "next/image"
import { clsx } from "clsx"

export default function CoverImage({
  title,
  url,
  slug,
  width,
  height,
  priority,
  className,
}: {
  title: string
  url: string
  slug?: string
  width: number
  height: number
  priority?: boolean
  className?: string
}) {
  const image = (
    <Image
      alt={`Cover Image for ${title}`}
      width={width}
      height={height}
      priority={priority}
      className={clsx("shadow-sm rounded-lg object-cover", className, {
        "hover:shadow-md transition-shadow duration-200": slug,
      })}
      src={url}
    />
  )

  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={`/blog/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  )
}
