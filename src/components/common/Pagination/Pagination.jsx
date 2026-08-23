function buildPageList(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  if (currentPage <= 3) {
    return [1, 2, 3, 'ellipsis', totalPages];
  }
  if (currentPage >= totalPages - 2) {
    return [1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
}

function PaginationButton({ children, ariaLabel, disabled = false, active = false, onClick }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-current={active ? 'page' : undefined}
      disabled={disabled}
      onClick={onClick}
      className={[
        'inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors sm:h-10 sm:w-10',
        active
          ? 'bg-primary text-white'
          : 'border border-[#E4E7EC] bg-white text-deep-blue hover:bg-[#F9FAFB]',
        disabled ? 'cursor-default opacity-50' : '',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

const Pagination = ({ page = 1, totalPages = 1, onPageChange, className = '' }) => {
  if (totalPages <= 1) return null;

  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const items = buildPageList(currentPage, totalPages);

  const goTo = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) return;
    onPageChange?.(nextPage);
  };

  return (
    <nav
      className={`flex flex-wrap items-center justify-center gap-2 ${className}`}
      aria-label="Pagination"
    >
      <PaginationButton ariaLabel="First page" disabled={currentPage === 1} onClick={() => goTo(1)}>
        «
      </PaginationButton>
      <PaginationButton
        ariaLabel="Previous page"
        disabled={currentPage === 1}
        onClick={() => goTo(currentPage - 1)}
      >
        ‹
      </PaginationButton>

      {items.map((item, index) =>
        item === 'ellipsis' ? (
          <PaginationButton key={`ellipsis-${index}`} ariaLabel="More pages" disabled>
            …
          </PaginationButton>
        ) : (
          <PaginationButton
            key={item}
            ariaLabel={`Page ${item}`}
            active={item === currentPage}
            onClick={() => goTo(item)}
          >
            {item}
          </PaginationButton>
        )
      )}

      <PaginationButton
        ariaLabel="Next page"
        disabled={currentPage === totalPages}
        onClick={() => goTo(currentPage + 1)}
      >
        ›
      </PaginationButton>
      <PaginationButton
        ariaLabel="Last page"
        disabled={currentPage === totalPages}
        onClick={() => goTo(totalPages)}
      >
        »
      </PaginationButton>
    </nav>
  );
};

export default Pagination;
