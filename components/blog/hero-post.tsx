import Link from "next/link"
import Date from "@/components/blog/date"
import CoverImage from "@/components/blog/cover-image"
import Avatar from "@/components/blog/avatar"
import { Blog } from "@/lib/types/blog-management"

export function HeroPost({
  title,
  cover_image_url,
  created_at,
  excerpt,
  author,
  slug,
}: Blog) {
  return (
    <section>
      <div className="mb-8 md:mb-16">
        <CoverImage
          title={title}
          slug={slug}
          url={cover_image_url}
          width={1500}
          height={1000}
          className="max-h-[50vh] min-h-[300px]"
          priority
        />
      </div>
      <div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 mb-20 md:mb-28">
        <div>
          <h3 className="mb-4 text-4xl lg:text-6xl leading-tight">
            <Link href={`/blog-resources/${slug}`} className="hover:underline">
              {title}
            </Link>
          </h3>
          <div className="mb-4 md:mb-0 text-base dark:text-white/60 text-black/60">
            <Date dateString={created_at} />
          </div>
        </div>
        <div>
          <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
          {author && <Avatar title={author.full_name || 'Unknown'} url={author.profile_picture_url || ''} />}
        </div>
      </div>
    </section>
  )
}
