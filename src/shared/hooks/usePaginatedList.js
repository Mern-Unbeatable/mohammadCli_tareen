import { useEffect, useMemo, useState } from 'react';

export const GRID_PAGE_SIZE = 8;
export const LIST_PAGE_SIZE = 5;

export function usePaginatedList(items, pageSize = GRID_PAGE_SIZE, resetDeps = []) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [items.length, pageSize, ...resetDeps]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  return {
    page: currentPage,
    setPage,
    totalPages,
    pageItems,
  };
}
