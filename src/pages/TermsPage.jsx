import { Card } from '../components/ui/Card';

const sections = [
  {
    title: 'Platform use',
    body: 'CapitalBridge provides software for discovering campaigns, managing investment requests, and coordinating payments. It does not provide investment advice.'
  },
  {
    title: 'Investor responsibilities',
    body: 'Investors are responsible for conducting their own diligence. All offers remain subject to founder approval and available equity on each campaign.'
  },
  {
    title: 'Customer (creator) responsibilities',
    body: 'Creators must supply accurate project information, respond to investors in good faith, and comply with applicable regulations for their jurisdiction.'
  },
  {
    title: 'Administration',
    body: 'Administrators may remove content or restrict accounts that violate platform rules or present safety risks, using tools exposed by the admin API.'
  }
];

export const TermsPage = () => (
  <div className="page-shell py-16">
    <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Terms & policies</p>
    <h1 className="mt-3 section-title">Transparent rules for every role.</h1>
    <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
      These summaries describe how the CapitalBridge product is intended to be used. Replace or extend this copy with
      counsel-reviewed legal text for your production launch.
    </p>
    <div className="mt-10 grid gap-6">
      {sections.map((section) => (
        <Card key={section.title} className="p-8">
          <h2 className="text-xl font-bold text-ink">{section.title}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{section.body}</p>
        </Card>
      ))}
    </div>
  </div>
);
