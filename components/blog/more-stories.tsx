import { PostPreview } from "@/components/blog/post-preview";
import { BlogPost } from "@/lib/static-blog-data";

export function MoreStories({
  morePosts,
  title,
}: {
  morePosts: BlogPost[];
  title: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">
        {morePosts.map((post) => {
          return <PostPreview key={post._id} {...post} />;
        })}
      </div>
    </section>
  );
}
