import { Link } from 'react-router';
import { List, Plus } from 'lucide-react';
import { generalCategories } from '../../data/general';

const actionBtn =
  'inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[12px] font-semibold transition-colors';

const GeneralToolbar = ({ category, onCategoryChange, activeView = 'browse', onCreatePost }) => (
  <div className="space-y-4">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="text-[28px] font-bold text-deep-blue sm:text-[32px]">General</h1>
        <p className="mt-1 text-[14px] text-[#64748B] sm:text-[15px]">
          Events, training, industry news, and documentation for the laboratory community.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          to="/general/my-posts"
          className={`${actionBtn} ${
            activeView === 'mine'
              ? 'bg-green-secondary text-green-primary'
              : 'border border-green-primary/30 text-green-primary hover:bg-green-secondary'
          }`}
        >
          <List className="h-3.5 w-3.5" />
          My Post
        </Link>
        <button
          type="button"
          onClick={onCreatePost}
          className={`${actionBtn} bg-primary text-white hover:bg-[#066BB0]`}
        >
          <Plus className="h-3.5 w-3.5" />
          Create Post
        </button>
      </div>
    </div>

    <div className="flex flex-wrap gap-2">
      {generalCategories.map((item) => {
        const isActive = category === item;
        return (
          <button
            key={item}
            type="button"
            onClick={() => onCategoryChange(item)}
            className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
              isActive
                ? 'bg-[#E67E22] text-white'
                : 'border border-[#E4E7EC] bg-white text-[#475467] hover:border-[#D0D5DD] hover:text-deep-blue'
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  </div>
);

export default GeneralToolbar;
