import Link from "next/link"
import Avatar from "@/components/blog/avatar"
import Date from "@/components/blog/date"
import CoverImage from "@/components/blog/cover-image"
import { BlogPost } from "@/lib/static-blog-data"

export function PostPreview({
  _title,
  coverImage,
  date,
  excerpt,
  author,
  _slug,
}: BlogPost) {
  return (
    <div>
      <div className="mb-5">
        <CoverImage
          title={_title}
          slug={_slug}
          url={coverImage.url}
          width={700}
          height={700}
          className="aspect-video"
        />
      </div>
      <h3 className="text-3xl mb-3 leading-snug">
        <Link href={`/blog/${_slug}`} className="hover:underline">
          {_title}
        </Link>
      </h3>
      <div className="text-base dark:text-white/60 text-black/60 mb-4">
        <Date dateString={date} />
      </div>
      <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
      {author && <Avatar title={author._title} url={author.avatar.url} />}
    </div>
  )
}
