import { useMemo, useState } from 'react';
import { TestimonialCard } from '../components/content/TestimonialCard';
import { Button } from '../components/ui/Button';

const allTestimonials = [
  {
    name: 'Riya Sharma',
    role: 'Investor',
    rating: 5,
    feedback:
      'The project pages gave me enough confidence to move from discovery to request submission quickly.'
  },
  {
    name: 'Arjun Menon',
    role: 'Customer',
    rating: 5,
    feedback:
      'The customer dashboard feels like a real fundraising command center instead of just another form page.'
  },
  {
    name: 'Sara Khan',
    role: 'Investor',
    rating: 4,
    feedback:
      'I especially liked having payment available only after approval. It kept the process very clear.'
  },
  {
    name: 'Naina Patel',
    role: 'Customer',
    rating: 5,
    feedback:
      'Analytics, investor reporting, and moderation all being connected saved our team a lot of manual work.'
  },
  {
    name: 'Daniel Roy',
    role: 'Investor',
    rating: 5,
    feedback:
      'Transparent equity breakdowns and engagement stats made due diligence feel much more structured.'
  }
];

export const TestimonialsPage = () => {
  const [filter, setFilter] = useState('All');

  const items = useMemo(() => {
    if (filter === 'All') {
      return allTestimonials;
    }

    return allTestimonials.filter((item) => item.role === filter);
  }, [filter]);

  return (
    <div className="page-shell py-16">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Testimonials</p>
          <h1 className="mt-3 section-title">What founders and investors say after using the platform.</h1>
        </div>
        <div className="flex gap-3">
          {['All', 'Investor', 'Customer'].map((item) => (
            <Button
              key={item}
              tone={filter === item ? 'primary' : 'slate'}
              variant={filter === item ? 'solid' : 'outline'}
              onClick={() => setFilter(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <TestimonialCard key={`${item.name}-${item.role}`} item={item} />
        ))}
      </div>
    </div>
  );
};
