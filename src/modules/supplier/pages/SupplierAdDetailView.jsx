import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import { AlertTriangle, ChevronLeft } from 'lucide-react';
import AdDetailCard from '@/modules/supplier/components/AdDetailCard';
import PostComments from '@/modules/user/components/feed/PostComments';
import {
  DEMO_AD_COMMENTS,
  getSupplierAdById,
  REJECTION_MESSAGE,
} from '@/modules/supplier/data/advertisements';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';

const SupplierAdDetailView = () => {
  const { adId } = useParams();
  const ad = getSupplierAdById(adId);

  const [comments, setComments] = useState(DEMO_AD_COMMENTS);
  const [reactionId, setReactionId] = useState(null);
  const [commentsOpen, setCommentsOpen] = useState(true);
  const [shared, setShared] = useState(false);

  if (!ad) return <Navigate to="/supplier/ads" replace />;

  const isRejected = ad.status === 'Rejected';

  const handleAddComment = (text) => {
    setComments((prev) => [
      {
        id: `c-${Date.now()}`,
        author: {
          name: 'Atik Adnan',
          initials: 'AA',
          subtitle: 'Admin · Lab Unity',
          avatar: null,
        },
        content: text,
        time: 'now',
        liked: false,
        replies: 0,
      },
      ...prev,
    ]);
  };

  const handleLikeComment = (commentId) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId ? { ...comment, liked: !comment.liked } : comment
      )
    );
  };

  return (
    <PanelPage>
      <PanelPageHeader title="My Advertisement Details" />

      <Link
        to="/supplier/ads"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary sm:text-[14px]"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Selection
      </Link>

      {isRejected ? (
        <div className="flex gap-3 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3.5 sm:px-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#DC2626]" />
          <p className="text-[13px] leading-relaxed text-[#991B1B] sm:text-[14px]">
            {ad.rejectionReason || REJECTION_MESSAGE}
          </p>
        </div>
      ) : null}

      <AdDetailCard
        ad={ad}
        reactionId={reactionId}
        commentsOpen={commentsOpen}
        shared={shared}
        onReact={setReactionId}
        onToggleComments={() => setCommentsOpen((open) => !open)}
        onShare={() => setShared(true)}
      />

      {commentsOpen ? (
        <div className="overflow-hidden rounded-xl border border-[#E4E7EC] bg-white">
          <PostComments
            comments={comments}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
          />
        </div>
      ) : null}
    </PanelPage>
  );
};

export default SupplierAdDetailView;
