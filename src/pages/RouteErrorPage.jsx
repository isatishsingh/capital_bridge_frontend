import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const RouteErrorPage = () => {
  const error = useRouteError();

  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went wrong';

  const description = isRouteErrorResponse(error)
    ? error.data?.message || 'The page could not be rendered.'
    : error?.message || 'An unexpected application error occurred.';

  return (
    <div className="page-shell flex min-h-[70vh] items-center justify-center py-20">
      <div className="surface max-w-2xl p-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Application error</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-ink">{title}</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/">
            <Button>Back to home</Button>
          </Link>
          <Button tone="slate" variant="outline" onClick={() => window.location.reload()}>
            Reload page
          </Button>
        </div>
      </div>
    </div>
  );
};
