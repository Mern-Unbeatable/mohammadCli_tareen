import { Suspense, lazy } from 'react';

const PageFallback = () => (
  <div className="flex min-h-[30vh] items-center justify-center text-sm text-[#64748B]">
    Loading…
  </div>
);

/**
 * Wraps a dynamic import in React.lazy + Suspense for route elements.
 * @param {() => Promise<{ default: React.ComponentType }>} factory
 */
export function lazyPage(factory) {
  const Component = lazy(factory);

  return function LazyRoutePage(props) {
    return (
      <Suspense fallback={<PageFallback />}>
        <Component {...props} />
      </Suspense>
    );
  };
}
