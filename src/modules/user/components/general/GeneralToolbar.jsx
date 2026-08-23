import { Link } from 'react-router';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';
import { panelPrimaryBtn } from '@/shared/layout/PanelLayout/panelPageTheme';
import { generalCategories } from '@/modules/user/data/general';

const actionBtn =
  'inline-flex items-center justify-center rounded-md px-3 py-2 text-[12px] font-semibold transition-colors';

const GeneralToolbar = ({
  category,
  onCategoryChange,
  activeView = 'browse',
  onCreatePost,
  showMyPost = true,
  showCreatePost = true,
  myPostHref = '/general/my-posts',
}) => (
  <div className="space-y-3">
    <PanelPageHeader
      title="General"
      subtitle="Events, training, industry news, and documentation for the laboratory community."
      action={
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          {showMyPost ? (
            <Link
              to={myPostHref}
              className={`${actionBtn} w-full sm:w-auto ${
                activeView === 'mine'
                  ? 'bg-green-secondary text-green-primary'
                  : 'border border-green-primary/30 text-green-primary hover:bg-green-secondary'
              }`}
            >
              My Post
            </Link>
          ) : null}
          {showCreatePost ? (
            <button type="button" onClick={onCreatePost} className={`${panelPrimaryBtn} w-full sm:w-auto`}>
              Create Post
            </button>
          ) : null}
        </div>
      }
    />

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
