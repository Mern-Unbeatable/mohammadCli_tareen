import { Suspense, lazy } from 'react';
<<<<<<< HEAD

const PageFallback = () => (
  <div className="flex min-h-[30vh] items-center justify-center text-sm text-[#64748B]">
    Loading…
  </div>
);
=======
import PageLoadingFallback from '@/shared/routing/PageLoadingFallback';
>>>>>>> c808644a0c9b437c860d4ddfa30cdae891b67166

/**
 * Wraps a dynamic import in React.lazy + Suspense for route elements.
 * @param {() => Promise<{ default: React.ComponentType }>} factory
 */
export function lazyPage(factory) {
  const Component = lazy(factory);

  return function LazyRoutePage(props) {
    return (
<<<<<<< HEAD
      <Suspense fallback={<PageFallback />}>
=======
      <Suspense fallback={<PageLoadingFallback />}>
>>>>>>> c808644a0c9b437c860d4ddfa30cdae891b67166
        <Component {...props} />
      </Suspense>
    );
  };
}
