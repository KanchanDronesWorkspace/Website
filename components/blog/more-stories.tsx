import { PostPreview } from "@/components/blog/post-preview";
import { Blog } from "@/lib/types/blog-management";

export function MoreStories({
  morePosts,
  title,
}: {
  morePosts: Blog[];
  title: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">
        {morePosts.map((post) => {
          return <PostPreview key={post.id} {...post} />;
        })}
      </div>
    </section>
  );
}
