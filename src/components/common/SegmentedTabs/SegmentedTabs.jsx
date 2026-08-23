/** Pill-style segmented tabs — matches DataTable toolbar tabs. */
const SegmentedTabs = ({
  tabs = [],
  activeTab,
  onTabChange,
  standalone = false,
  className = '',
  ariaLabel,
}) => (
  <div
    className={`inline-flex w-fit max-w-full shrink-0 flex-wrap items-center rounded-lg p-1 ${
      standalone ? 'bg-white' : 'bg-[#F3F4F6]'
    } ${className}`}
    role="tablist"
    aria-label={ariaLabel}
  >
    {tabs.map((tab) => {
      const isActive = tab.id === activeTab;
      return (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onTabChange?.(tab.id)}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
            isActive
              ? 'bg-primary text-white'
              : 'bg-transparent text-deep-blue hover:bg-white/80'
          }`}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);

export default SegmentedTabs;
