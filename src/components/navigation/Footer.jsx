import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className="mt-24 border-t border-slate-200 bg-white">
    <div className="page-shell grid gap-10 py-14 md:grid-cols-[1.2fr_repeat(3,1fr)]">
      <div className="max-w-md">
        <div className="font-display text-2xl font-bold text-ink">CrowdSpring</div>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          A modern equity crowdfunding experience built for startup founders, investors, and
          platform operators who need clarity at every stage.
        </p>
      </div>
      <div>
        <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">About</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <Link className="block hover:text-accent" to="/about">
            Company
          </Link>
          <Link className="block hover:text-accent" to="/testimonials">
            Testimonials
          </Link>
          <Link className="block hover:text-accent" to="/faq">
            FAQ
          </Link>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Contact</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <Link className="block hover:text-accent" to="/contact">
            Contact page
          </Link>
          <p>help@crowdspring.app</p>
          <p>+91 80 4040 9090</p>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Terms</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <Link className="block hover:text-accent" to="/terms">
            Terms & policies
          </Link>
          <Link className="block hover:text-accent" to="/terms">
            Investor responsibilities
          </Link>
          <Link className="block hover:text-accent" to="/terms">
            Platform rules
          </Link>
        </div>
      </div>
    </div>
  </footer>
);
