import { Card } from '../components/ui/Card';

export const ContactPage = () => (
  <div className="page-shell py-16">
    <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Contact</p>
    <h1 className="mt-3 section-title">We are here to help.</h1>
    <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
      For platform support, trust and safety, or partnership enquiries, reach the CapitalBridge operations desk using the
      channels below.
    </p>
    <div className="mt-10 grid gap-6 md:grid-cols-2">
      <Card className="p-8">
        <h2 className="text-xl font-bold text-ink">Support</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">help@CapitalBridge.app</p>
        <p className="mt-2 text-sm leading-7 text-slate-600">+91 80 4040 9090</p>
      </Card>
      <Card className="p-8">
        <h2 className="text-xl font-bold text-ink">Office</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">Bengaluru, India</p>
        <p className="mt-2 text-sm leading-7 text-slate-600">Business hours: 9:00–18:00 IST, Monday–Friday</p>
      </Card>
    </div>
  </div>
);
