import type { Post } from "@/lib/types";

interface LatestPostProps {
  post: Post;
  platform: "instagram" | "youtube" | "tiktok";
}

const badgeColors: Record<string, string> = {
  reel: "bg-terracotta",
  carousel: "bg-terracotta",
  photo: "bg-[#555]",
  video: "bg-[#555]",
};

const platformIcons: Record<string, { bg: string; content: React.ReactNode }> = {
  instagram: {
    bg: "bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888]",
    content: null,
  },
  youtube: {
    bg: "bg-[#ff0000]",
    content: (
      <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-[2px]" />
    ),
  },
  tiktok: {
    bg: "bg-[#010101]",
    content: <span className="text-[10px] text-white font-bold">T</span>,
  },
};

export function LatestPost({ post, platform }: LatestPostProps) {
  const icon = platformIcons[platform];
  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="border-t border-[--border] px-9 py-7">
      <div className="text-[10px] tracking-[2px] uppercase text-[--text-secondary] mb-4">
        Latest Post
      </div>
      <div className="flex gap-5 items-start">
        {post.thumbnailUrl ? (
          <img
            src={post.thumbnailUrl}
            alt=""
            className="w-[120px] h-[120px] rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-[120px] h-[120px] bg-linen-dark rounded-lg flex-shrink-0 flex items-center justify-center text-[11px] text-[--text-secondary]">
            Thumbnail
          </div>
        )}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-5 h-5 rounded-[5px] flex items-center justify-center ${icon.bg}`}
            >
              {icon.content}
            </div>
            <span className="text-xs font-semibold capitalize">{platform}</span>
            <span
              className={`inline-block px-[7px] py-[2px] text-[9px] tracking-[1px] uppercase font-semibold text-white rounded-[3px] ${badgeColors[post.type]}`}
            >
              {post.type}
            </span>
            <span className="text-[11px] text-[--text-secondary]">{date}</span>
          </div>
          <p className="text-sm text-[#444] leading-relaxed line-clamp-2 mb-3">
            {post.caption}
          </p>
          <div className="flex gap-5 text-[13px] text-[--text-muted]">
            <span>
              <strong className="text-[--text-primary]">
                {post.likes.toLocaleString()}
              </strong>{" "}
              likes
            </span>
            <span>
              <strong className="text-[--text-primary]">
                {post.comments.toLocaleString()}
              </strong>{" "}
              comments
            </span>
            {post.views !== undefined && (
              <span>
                <strong className="text-[--text-primary]">
                  {post.views.toLocaleString()}
                </strong>{" "}
                views
              </span>
            )}
            <span className="font-semibold text-terracotta">
              {post.engagementRate.toFixed(2)}%
            </span>
          </div>
          {post.recentComments.length > 0 && (
            <div className="mt-3 text-xs text-[--text-muted] leading-relaxed space-y-1">
              {post.recentComments.slice(0, 3).map((comment, i) => (
                <div key={i}>
                  <strong className="text-[#666]">@{comment.username}</strong>{" "}
                  {comment.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
