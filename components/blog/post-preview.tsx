import Link from "next/link"
import Avatar from "@/components/blog/avatar"
import Date from "@/components/blog/date"
import CoverImage from "@/components/blog/cover-image"
import { Blog } from "@/lib/types/blog-management"

export function PostPreview({
  title,
  cover_image_url,
  created_at,
  excerpt,
  author,
  slug,
}: Blog) {
  return (
    <div>
      <div className="mb-5">
        <CoverImage
          title={title}
          slug={slug}
          url={cover_image_url}
          width={700}
          height={700}
          className="aspect-video"
        />
      </div>
      <h3 className="text-3xl mb-3 leading-snug">
        <Link href={`/blog/${slug}`} className="hover:underline">
          {title}
        </Link>
      </h3>
      <div className="text-base dark:text-white/60 text-black/60 mb-4">
        <Date dateString={created_at} />
      </div>
      <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
      {author && <Avatar title={author.full_name || 'Unknown'} url={author.profile_picture_url || ''} />}
    </div>
  )
}
