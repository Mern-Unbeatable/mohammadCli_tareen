import { Link, useParams } from 'react-router';
import { Calendar, ChevronLeft, MapPin, Share2 } from 'lucide-react';
import Container from '../../components/ui/Container';
import { getGeneralPostById } from '../../data/general';
import NotFound from '../error/NotFound';

const typeStyles = {
  news: 'bg-[#FEF3E8] text-[#E67E22]',
  document: 'bg-pink-secondary text-pink-light',
};

const GeneralPostDetailView = () => {
  const { postId } = useParams();
  const post = getGeneralPostById(postId);

  if (!post) return <NotFound />;

  return (
    <main className="pt-6 pb-8 sm:pt-8">
      <Container className="max-w-[760px]">
        <Link
          to="/general"
          className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to General
        </Link>

        <img
          src={post.image}
          alt=""
          className="aspect-[21/9] w-full rounded-2xl object-cover sm:aspect-[16/7]"
        />

        <span
          className={`mt-5 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            typeStyles[post.type]
          }`}
        >
          {post.type === 'news' ? 'News' : 'Document'}
        </span>

        <h1 className="mt-3 text-[24px] font-bold leading-tight text-deep-blue sm:text-[28px]">
          {post.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-[12px] text-[#98A2B3]">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {post.displayDate}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {post.category}
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {post.body.map((paragraph) => (
            <p key={paragraph} className="text-[14px] leading-[1.75] text-[#475467]">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {post.type === 'document' && (
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#066BB0] sm:flex-none sm:min-w-[200px]"
            >
              Download
            </button>
          )}
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E4E7EC] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#475467] hover:bg-[#F9FAFB]"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </Container>
    </main>
  );
};

export default GeneralPostDetailView;
