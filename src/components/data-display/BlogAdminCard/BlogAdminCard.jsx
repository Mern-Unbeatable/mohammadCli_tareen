import Card from '@/components/ui/Card';

const BlogAdminCard = ({ article, onEdit, onDelete }) => (
  <Card className="flex h-full flex-col overflow-hidden">
    <div className="aspect-[16/10] overflow-hidden bg-[#F9FAFB]">
      <img src={article.image} alt="" className="h-full w-full object-cover" />
    </div>

    <div className="flex flex-1 flex-col p-4 lg:p-5">
      <h3 className="line-clamp-2 text-[14px] font-bold leading-snug text-deep-blue sm:text-[15px] lg:text-[16px]">
        {article.title}
      </h3>
      <p className="mt-2 line-clamp-2 flex-1 text-[12px] leading-relaxed text-[#64748B] sm:text-[13px] lg:text-[14px]">
        {article.excerpt}
      </p>
      <p className="mt-3 text-[11px] text-[#98A2B3] sm:text-[12px] lg:text-[13px]">
        {article.readTime} — {article.author}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onEdit?.(article.id)}
          className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-[12px] font-semibold text-white hover:bg-[#066BB0] sm:text-[13px]"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(article.id)}
          className="inline-flex items-center justify-center rounded-md border border-[#E4E7EC] bg-white px-3 py-2 text-[12px] font-semibold text-deep-blue hover:bg-[#F9FAFB] sm:text-[13px]"
        >
          Delete
        </button>
      </div>
    </div>
  </Card>
);

export default BlogAdminCard;
