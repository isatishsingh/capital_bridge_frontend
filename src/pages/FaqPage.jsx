import { FaqAccordion } from '../components/content/FaqAccordion';

const items = [
  {
    question: 'How do I invest?',
    answer:
      'Create an investor account, browse projects, open a campaign, enter your amount and equity request, then wait for founder approval before payment.'
  },
  {
    question: 'How does approval work?',
    answer:
      'Customers see every incoming offer in their dashboard and can approve or reject based on strategy, available equity, and communication.'
  },
  {
    question: 'Is investment safe?',
    answer:
      'The frontend is designed around protected actions, payment verification, moderation workflows, and clear status tracking to reduce ambiguity for users.'
  },
  {
    question: 'How does equity work?',
    answer:
      'Each project shows total equity offered, investor requests specify desired ownership, and customer analytics track sold versus remaining equity.'
  }
];

export const FaqPage = () => (
  <div className="page-shell py-16">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">FAQ</p>
      <h1 className="mt-3 section-title">Everything users usually ask before getting started.</h1>
      <p className="mt-4 section-copy">
        The platform supports investor workflows, founder approvals, admin moderation, and verified
        payments, so the common questions are mostly about transparency and process.
      </p>
      <div className="mt-10">
        <FaqAccordion items={items} />
      </div>
    </div>
  </div>
);
