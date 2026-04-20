import { Outlet } from 'react-router-dom';

export const AuthLayout = () => (
  <div className="grid min-h-screen bg-slate-950 lg:grid-cols-[1.2fr_0.8fr]">
    <div className="hidden flex-col justify-between bg-[linear-gradient(135deg,_rgba(15,118,110,0.96),_rgba(7,17,31,1))] p-12 text-white lg:flex">
      <div>
        <div className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
          CrowdSpring
        </div>
        <h1 className="mt-8 max-w-xl font-display text-6xl font-bold leading-tight">
          Fund ambitious ideas with trust, transparency, and clean execution.
        </h1>
      </div>
      <div className="glass-panel max-w-xl p-8">
        <p className="text-sm uppercase tracking-[0.18em] text-white/60">What you can do</p>
        <ul className="mt-4 space-y-4 text-sm leading-7 text-white/80">
          <li>Investors discover vetted projects and complete payments after approval.</li>
          <li>Customers launch projects, manage requests, and track live performance.</li>
          <li>Admins moderate reports, project quality, and user safety.</li>
        </ul>
      </div>
    </div>
    <div className="flex items-center justify-center bg-canvas p-6 sm:p-10">
      <div className="w-full max-w-xl">
        <Outlet />
      </div>
    </div>
  </div>
);
