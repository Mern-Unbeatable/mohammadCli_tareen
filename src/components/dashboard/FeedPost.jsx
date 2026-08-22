import { memo } from 'react';
import { MoreHorizontal, Tag } from 'lucide-react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { AttachmentCard, PostActions, PostStats } from './FeedShared';

const badgeByType = {
  question: { variant: 'question', label: 'Question' },
  information: { variant: 'information', label: 'Information' },
  sponsored: { variant: 'sponsored', label: '• Sponsored' },
  promo: { variant: 'sponsored', label: '• Sponsored' },
};

const PostHeader = ({ post, onReport }) => {
  const badge = badgeByType[post.type];

  return (
    <div className="flex items-start gap-3 p-4 pb-0">
      <Avatar initials={post.author.initials} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[14px] font-bold text-deep-blue">{post.author.name}</h3>
          {badge && (
            <Badge variant={badge.variant}>{badge.label}</Badge>
          )}
          {post.type === 'promo' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-pink-secondary px-2 py-0.5 text-[10px] font-semibold text-pink-light">
              <Tag className="h-3 w-3" />
              Promotional Offer
            </span>
          )}
        </div>
        <p className="text-[12px] text-[#64748B]">{post.author.subtitle}</p>
        <p className="text-[12px] text-[#98A2B3]">{post.author.meta}</p>
      </div>
      <button
        type="button"
        onClick={() => onReport(post)}
        className="rounded-md p-1 text-[#98A2B3] hover:bg-[#F9FAFB] hover:text-deep-blue"
        aria-label="Post options"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>
    </div>
  );
};

const PromoPricing = ({ post }) => (
  <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
    <div className="flex items-baseline gap-2">
      <span className="text-[28px] font-bold text-green-primary">{post.price}</span>
      {post.originalPrice && (
        <span className="text-[14px] text-[#98A2B3] line-through">{post.originalPrice}</span>
      )}
    </div>
    <div className="text-right">
      {post.discount && (
        <span className="inline-block rounded-md bg-[#FEF3E8] px-2 py-0.5 text-[11px] font-semibold text-[#E67E22]">
          {post.discount}
        </span>
      )}
      {post.validUntil && (
        <p className="mt-1 text-[11px] text-[#64748B]">{post.validUntil}</p>
      )}
    </div>
  </div>
);

const FeedPost = ({ post, onReport }) => (
  <Card>
    <PostHeader post={post} onReport={onReport} />

    <div className="p-4">
      {post.title && (
        <h4 className="mb-2 text-[16px] font-bold text-deep-blue">{post.title}</h4>
      )}
      <p className="text-[14px] leading-relaxed text-[#475467]">{post.content}</p>

      {post.attachment && <AttachmentCard attachment={post.attachment} />}

      {post.image && (
        <div className="relative mt-3 overflow-hidden rounded-lg">
          <img
            src={post.image}
            alt=""
            className="aspect-[16/9] w-full object-cover"
            loading="lazy"
          />
          {post.discount && post.type === 'promo' && (
            <>
              <span className="absolute left-3 top-3 rounded-md bg-[#E67E22] px-2 py-1 text-[11px] font-bold text-white">
                {post.discount}
              </span>
              <span className="absolute bottom-3 left-3 rounded-md bg-[#E67E22] px-2 py-1 text-[11px] font-bold text-white">
                Ends in 29 days
              </span>
            </>
          )}
        </div>
      )}

      {post.type === 'sponsored' && post.price && (
        <p className="mt-3 text-[22px] font-bold text-green-primary">{post.price}</p>
      )}

      {post.type === 'promo' && <PromoPricing post={post} />}

      {post.cta && (
        <button
          type="button"
          className="mt-4 w-full rounded-md bg-pink-light py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          {post.cta}
        </button>
      )}
    </div>

    <PostStats stats={post.stats} />
    <PostActions />
  </Card>
);

export default memo(FeedPost);
