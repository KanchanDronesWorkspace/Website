import Link from "next/link"
import Date from "@/components/blog/date"
import CoverImage from "@/components/blog/cover-image"
import Avatar from "@/components/blog/avatar"
import { BlogPost } from "@/lib/static-blog-data"

export function HeroPost({
  _title,
  coverImage,
  date,
  excerpt,
  author,
  _slug,
}: BlogPost) {
  return (
    <section>
      <div className="mb-8 md:mb-16">
        <CoverImage
          title={_title}
          slug={_slug}
          url={coverImage.url}
          width={1500}
          height={1000}
          className="max-h-[50vh] min-h-[300px]"
          priority
        />
      </div>
      <div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 mb-20 md:mb-28">
        <div>
          <h3 className="mb-4 text-4xl lg:text-6xl leading-tight">
            <Link href={`/blog/${_slug}`} className="hover:underline">
              {_title}
            </Link>
          </h3>
          <div className="mb-4 md:mb-0 text-base dark:text-white/60 text-black/60">
            <Date dateString={date} />
          </div>
        </div>
        <div>
          <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
          {author && <Avatar title={author._title} url={author.avatar.url} />}
        </div>
      </div>
    </section>
  )
}
