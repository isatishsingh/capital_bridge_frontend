import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useProjectStore } from '../store/projectStore';
import { ProjectCard } from '../components/projects/ProjectCard';
import { TestimonialCard } from '../components/content/TestimonialCard';
import { FaqAccordion } from '../components/content/FaqAccordion';

const testimonials = [
  {
    name: 'Riya Sharma',
    role: 'Investor',
    rating: 5,
    feedback:
      'The transparency around traction, equity, and founder communication made my decision much faster.'
  },
  {
    name: 'Arjun Menon',
    role: 'Customer',
    rating: 5,
    feedback:
      'I launched, reviewed incoming offers, and closed funding with a workflow that felt enterprise-ready.'
  },
  {
    name: 'Sara Khan',
    role: 'Investor',
    rating: 4,
    feedback:
      'Approval-to-payment is smooth, and the dashboards make it easy to track the portfolio in one place.'
  },
  {
    name: 'Vikram Iyer',
    role: 'Customer',
    rating: 5,
    feedback: 'Admin moderation gave our investors confidence while we scaled visibility for our campaign.'
  }
];

const faqs = [
  {
    question: 'How do I invest in a project?',
    answer:
      'Browse active campaigns, open a project, submit your amount and equity request, then complete payment only after the founder approves.'
  },
  {
    question: 'How does approval work?',
    answer:
      'Founders receive every investor request in their dashboard, compare the offer, and either approve or reject based on fit and remaining equity.'
  },
  {
    question: 'Is investment safe on the platform?',
    answer:
      'The platform centralizes reports, moderation, and payment verification so users get a transparent audit trail before money moves.'
  },
  {
    question: 'How is equity tracked?',
    answer:
      'Project analytics show equity offered, sold, and remaining while investor dashboards reflect approved and completed ownership positions.'
  }
];

export const HomePage = () => {
  const navigate = useNavigate();
  const { projects, fetchProjects, loading } = useProjectStore();
  const featuredProjects = Array.isArray(projects) ? projects.slice(0, 3) : [];

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="page-shell grid gap-12 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:py-28">
          <div className="relative z-10">
            <div className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">
              Built for modern equity e-funding
            </div>
            <h1 className="mt-8 max-w-3xl font-display text-5xl font-bold leading-[1.04] text-ink sm:text-6xl">
              Back breakout founders with the same clarity you expect from world-class SaaS.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              CapitalBridge connects investors, startup creators, and admins in one transparent flow:
              discover projects, manage approvals, process payments, and monitor performance.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/projects">
                <Button className="min-w-44">Explore Projects</Button>
              </Link>
              <Button
                className="min-w-44"
                tone="slate"
                variant="outline"
                type="button"
                onClick={() => navigate('/register', { state: { defaultRole: 'CREATOR' } })}
              >
                Start Your Project
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="glass-panel relative overflow-hidden p-8">
              <div className="absolute inset-0 bg-grid-fade bg-[size:36px_36px] opacity-30" />
              <div className="relative z-10">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white/10 p-5">
                    <p className="text-sm text-white/70">Platform funding</p>
                    <p className="mt-3 font-display text-4xl font-bold">Rs. 12.4Cr</p>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-5">
                    <p className="text-sm text-white/70">Active investors</p>
                    <p className="mt-3 font-display text-4xl font-bold">4,280</p>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-5 sm:col-span-2">
                    <p className="text-sm text-white/70">Average campaign completion</p>
                    <p className="mt-3 font-display text-4xl font-bold">71 days</p>
                    <p className="mt-3 text-sm leading-7 text-white/70">
                      Dashboards, approvals, and payment verification live in one workflow for every role.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-10">
        <div className="surface grid gap-8 p-8 lg:grid-cols-[0.8fr_1.2fr] lg:p-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">About CapitalBridge</p>
            <h2 className="mt-4 section-title">A platform designed for trust from day one.</h2>
          </div>
          <div>
            <p className="section-copy">
              CapitalBridge helps founders raise capital responsibly and gives investors a transparent
              path from discovery to verified payment. Every role gets the tools they need without
              losing the human side of fundraising.
            </p>
            <Link className="mt-6 inline-block" to="/about">
              <Button tone="slate" variant="outline">
                Know More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="page-shell py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Featured projects</p>
            <h2 className="section-title mt-3">Funding opportunities with visible momentum.</h2>
          </div>
          <Link to="/projects">
            <Button tone="slate" variant="outline">
              See all projects
            </Button>
          </Link>
        </div>
        {loading && !featuredProjects.length ? (
          <p className="text-sm text-slate-500">Loading featured campaigns…</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} fillHeight project={project} />
            ))}
          </div>
        )}
      </section>

      <section className="page-shell py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Testimonials</p>
            <h2 className="section-title mt-3">People trust products that respect their time.</h2>
          </div>
          <Link to="/testimonials">
            <Button tone="slate" variant="outline">
              View All Testimonials
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {testimonials.slice(0, 4).map((item) => (
            <TestimonialCard key={item.name} item={item} />
          ))}
        </div>
      </section>

      <section className="page-shell py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">FAQ</p>
            <h2 className="section-title mt-3">The most common platform questions, answered clearly.</h2>
          </div>
          <Link to="/faq">
            <Button tone="slate" variant="outline">
              View All FAQs
            </Button>
          </Link>
        </div>
        <FaqAccordion items={faqs.slice(0, 4)} />
      </section>
    </div>
  );
};
