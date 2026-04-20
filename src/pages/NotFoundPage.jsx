import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => (
  <div className="page-shell flex min-h-[70vh] items-center justify-center py-20">
    <div className="surface max-w-xl p-10 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">404</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-ink">The page you requested is missing.</h1>
      <p className="mt-4 text-sm leading-7 text-slate-600">
        The route may have changed, or your current role may not have access to that part of the product.
      </p>
      <Link className="mt-8 inline-block" to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  </div>
);
