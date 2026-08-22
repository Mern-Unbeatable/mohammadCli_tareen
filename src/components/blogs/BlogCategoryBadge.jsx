import { categoryStyles } from '../../data/blogs';

const BlogCategoryBadge = ({ category }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
      categoryStyles[category] || 'bg-[#F3F4F6] text-[#64748B]'
    }`}
  >
    {category}
  </span>
);

export default BlogCategoryBadge;
