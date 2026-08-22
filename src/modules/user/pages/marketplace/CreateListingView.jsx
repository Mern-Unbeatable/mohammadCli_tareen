import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ChevronLeft, ImagePlus } from 'lucide-react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import { categories, conditions, years } from '@/modules/user/data/marketplace';
import { currentUser } from '@/modules/user/data/dashboard';

const fieldClass =
  'w-full rounded-lg border border-[#E4E7EC] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10';

const labelClass = 'mb-1.5 block text-[13px] font-semibold text-deep-blue';

const CreateListingView = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: categories[1],
    condition: conditions[2],
    year: years[5],
    price: '',
  });

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/marketplace/my-listings');
  };

  return (
    <main className="pt-6 pb-5 sm:pt-8 sm:pb-8">
      <Container className="max-w-[760px]">
        <Link
          to="/marketplace"
          className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to marketplace
        </Link>

        <Card>
          <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
            <h1 className="text-[22px] font-bold text-deep-blue sm:text-[24px]">Create a listing</h1>
            <p className="mt-1 text-[14px] text-[#64748B]">
              Sell or exchange second-hand laboratory equipment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6">
            <div>
              <label htmlFor="title" className={labelClass}>
                Product name
              </label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={update('title')}
                placeholder="e.g. Agilent 1260 Infinity II HPLC System"
                className={fieldClass}
                required
              />
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>
                Description
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={update('description')}
                rows={4}
                placeholder="Describe condition, accessories, validation status and delivery options..."
                className={`${fieldClass} resize-y`}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className={labelClass}>
                  Category
                </label>
                <select id="category" value={form.category} onChange={update('category')} className={fieldClass}>
                  {categories.slice(1).map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="condition" className={labelClass}>
                  Condition
                </label>
                <select id="condition" value={form.condition} onChange={update('condition')} className={fieldClass}>
                  {conditions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="year" className={labelClass}>
                  Year
                </label>
                <select id="year" value={form.year} onChange={update('year')} className={fieldClass}>
                  {years.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="price" className={labelClass}>
                  Price (€)
                </label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={update('price')}
                  placeholder="1850"
                  className={fieldClass}
                  required
                />
              </div>
            </div>

            <div>
              <p className={labelClass}>Photos</p>
              <button
                type="button"
                className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#D0D5DD] bg-[#F9FAFB] px-4 py-10 text-[#64748B] transition-colors hover:border-primary hover:bg-secondary/40"
              >
                <ImagePlus className="h-6 w-6 text-[#98A2B3]" />
                <span className="text-[13px] font-medium">Add product photos</span>
              </button>
            </div>

            <div className="rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] px-4 py-3 text-[13px] text-[#64748B]">
              <span className="font-semibold text-deep-blue">Seller information:</span>{' '}
              {currentUser.name} · {currentUser.company} · {currentUser.location}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#066BB0]"
              >
                Publish listing
              </button>
            </div>
          </form>
        </Card>
      </Container>
    </main>
  );
};

export default CreateListingView;
