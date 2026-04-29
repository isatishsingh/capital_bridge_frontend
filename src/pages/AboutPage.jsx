export const AboutPage = () => (
  <div className="page-shell py-16">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">About the platform</p>
      <h1 className="mt-4 section-title">A better operating system for equity e-funding.</h1>
      <p className="mt-6 text-lg leading-8 text-slate-600">
        CapitalBridge is built to make startup fundraising feel accountable, measurable, and easy to
        navigate. Investors get visibility before committing capital, founders manage approvals and
        equity without losing momentum, and admins keep the platform safe.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="surface p-8">
          <h2 className="text-2xl font-bold text-ink">Mission</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Help founders raise capital responsibly while giving investors transparent, auditable
            access to opportunities that match their conviction.
          </p>
        </div>
        <div className="surface p-8">
          <h2 className="text-2xl font-bold text-ink">Vision</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Make equity e-funding as intuitive and trusted as the best modern financial software,
            without sacrificing human judgment or platform governance.
          </p>
        </div>
      </div>

      <div className="mt-12 surface p-8">
        <h2 className="text-2xl font-bold text-ink">How it works</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-4">
          {[
            'Founders create projects with goals, deadlines, and equity offered.',
            'Investors browse campaigns, review transparency signals, and submit requests.',
            'Founders approve or reject offers based on fit and cap table constraints.',
            'Approved investors complete payment, and analytics update across dashboards.'
          ].map((step, index) => (
            <div key={step} className="rounded-3xl bg-slate-50 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-sm font-bold text-white">
                {index + 1}
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="surface p-8">
          <h3 className="text-xl font-bold text-ink">Investor</h3>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Explore projects, assess traction and funding progress, request investments, track approvals,
            and complete payment after confirmation.
          </p>
        </div>
        <div className="surface p-8">
          <h3 className="text-xl font-bold text-ink">Customer (project creator)</h3>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Launch campaigns, complete verification (KYC) when your backend requires it, monitor analytics, review investor
            offers, manage equity distribution, and communicate with backers from the project workspace.
          </p>
        </div>
        <div className="surface p-8">
          <h3 className="text-xl font-bold text-ink">Admin</h3>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Oversee platform performance, moderate reports, remove non-compliant projects, and apply user
            controls when trust and safety issues appear.
          </p>
        </div>
      </div>
    </div>
  </div>
);
