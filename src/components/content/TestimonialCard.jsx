import { Card } from '../ui/Card';

export const TestimonialCard = ({ item }) => (
  <Card className="h-full">
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-bold text-ink">{item.name}</h3>
        <p className="text-sm text-slate-500">{item.role}</p>
      </div>
      {item.rating ? <div className="text-sm font-semibold text-amber-500">{'★'.repeat(item.rating)}</div> : null}
    </div>
    <p className="text-sm leading-7 text-slate-600">{item.feedback}</p>
  </Card>
);
