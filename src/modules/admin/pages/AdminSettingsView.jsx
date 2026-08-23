import { useState } from 'react';
import { Calculator, Check, Trash2, Wallet } from 'lucide-react';
import Card from '@/components/ui/Card';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';
import { panelPageTheme, panelPrimaryBtn } from '@/shared/layout/PanelLayout/panelPageTheme';
import {
  DEFAULT_GENERAL_CATEGORIES,
  DEFAULT_MARKETPLACE_CATEGORIES,
  DEFAULT_SPONSORED_TIERS,
  SUBSCRIPTION_FEATURES,
} from '@/modules/admin/data/settings';

const inputClass =
  'w-full rounded-lg border border-[#D0D5DD] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 lg:text-[15px]';

const CategoryTag = ({ label, onRemove }) => (
  <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-green-secondary bg-green-secondary/40 px-3 py-1.5 text-[12px] font-semibold text-green-primary sm:text-[13px] lg:text-[14px]">
    <span className="truncate">{label}</span>
    <button
      type="button"
      onClick={onRemove}
      className="shrink-0 rounded p-0.5 text-pink-light hover:bg-pink-secondary/50"
      aria-label={`Remove ${label}`}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  </span>
);

const PriceField = ({ id, label, value, onChange }) => (
  <div className="min-w-0">
    <label htmlFor={id} className={`mb-1.5 block ${panelPageTheme.cardBody} font-medium`}>
      {label}
    </label>
    <div className="relative">
      <input id={id} type="text" value={value} onChange={onChange} className={inputClass} />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[#64748B]">
        €
      </span>
    </div>
  </div>
);

const AdminSettingsView = () => {
  const [monthlyPrice, setMonthlyPrice] = useState('200.00');
  const [yearlyPrice, setYearlyPrice] = useState('18.00');
  const [sponsoredTiers, setSponsoredTiers] = useState(DEFAULT_SPONSORED_TIERS);
  const [marketplaceCategories, setMarketplaceCategories] = useState(
    DEFAULT_MARKETPLACE_CATEGORIES
  );
  const [generalCategories, setGeneralCategories] = useState(DEFAULT_GENERAL_CATEGORIES);
  const [newMarketplaceCategory, setNewMarketplaceCategory] = useState('');
  const [newGeneralCategory, setNewGeneralCategory] = useState('');

  const addCategory = (value, setter, listSetter) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    listSetter((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setter('');
  };

  return (
    <PanelPage>
      <PanelPageHeader
        title="Settings"
        subtitle="Manage your subscription and Sponsored Price"
      />

      <Card className="overflow-hidden">
        <div className="flex items-start gap-3 border-b border-[#E4E7EC] px-4 py-3.5 sm:px-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
            <Wallet className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h2 className={panelPageTheme.cardTitle}>Manage Your Subscription</h2>
            <p className={panelPageTheme.cardSubtitle}>Edit and Delete your subscription package.</p>
          </div>
        </div>

        <div className="space-y-4 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
              <PriceField
                id="monthly-price"
                label="Monthly"
                value={monthlyPrice}
                onChange={(event) => setMonthlyPrice(event.target.value)}
              />
              <PriceField
                id="yearly-price"
                label="Yearly"
                value={yearlyPrice}
                onChange={(event) => setYearlyPrice(event.target.value)}
              />
            </div>
            <button type="button" className={`${panelPrimaryBtn} w-full lg:w-auto lg:shrink-0`}>
              Save
            </button>
          </div>

          <div className="rounded-xl border border-secondary bg-secondary/30 p-3.5 sm:p-4">
            <p className={`mb-2.5 ${panelPageTheme.cardEyebrow}`}>Everything included</p>
            <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {SUBSCRIPTION_FEATURES.map((feature) => (
                <li key={feature} className={`flex items-start gap-2 ${panelPageTheme.cardBody}`}>
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-primary" strokeWidth={2.5} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-start gap-3 border-b border-[#E4E7EC] px-4 py-3.5 sm:px-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FEF3E8] text-[#E67E22]">
            <Calculator className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h2 className={panelPageTheme.cardTitle}>Sponsored Post Pricing</h2>
            <p className={panelPageTheme.cardSubtitle}>Manage Sponsored post pricing.</p>
          </div>
        </div>

        <div className="space-y-3 px-4 py-4 sm:px-5">
          {sponsoredTiers.map((tier) => (
            <div
              key={tier.id}
              className="flex flex-col gap-3 border-b border-[#F4F5F7] pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:items-end"
            >
              <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className={`mb-1.5 block ${panelPageTheme.cardBody} font-medium`}>Day</label>
                  <input type="text" value={tier.label} readOnly className={inputClass} />
                </div>
                <PriceField
                  id={`price-${tier.id}`}
                  label="Price"
                  value={tier.price}
                  onChange={(event) =>
                    setSponsoredTiers((prev) =>
                      prev.map((item) =>
                        item.id === tier.id ? { ...item, price: event.target.value } : item
                      )
                    )
                  }
                />
              </div>
              <button type="button" className={`${panelPrimaryBtn} w-full sm:w-auto sm:shrink-0`}>
                Save
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 sm:p-5">
        <div className="mb-3 flex flex-col gap-3">
          <h2 className={panelPageTheme.cardTitle}>Marketplace category</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              value={newMarketplaceCategory}
              onChange={(event) => setNewMarketplaceCategory(event.target.value)}
              placeholder="New category"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() =>
                addCategory(newMarketplaceCategory, setNewMarketplaceCategory, setMarketplaceCategories)
              }
              className={`${panelPrimaryBtn} w-full sm:w-auto sm:shrink-0`}
            >
              Add Category
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {marketplaceCategories.map((category) => (
            <CategoryTag
              key={category}
              label={category}
              onRemove={() =>
                setMarketplaceCategories((prev) => prev.filter((item) => item !== category))
              }
            />
          ))}
        </div>
      </Card>

      <Card className="p-4 sm:p-5">
        <div className="mb-3 flex flex-col gap-3">
          <h2 className={panelPageTheme.cardTitle}>General category</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              value={newGeneralCategory}
              onChange={(event) => setNewGeneralCategory(event.target.value)}
              placeholder="New category"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() =>
                addCategory(newGeneralCategory, setNewGeneralCategory, setGeneralCategories)
              }
              className={`${panelPrimaryBtn} w-full sm:w-auto sm:shrink-0`}
            >
              Add Category
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {generalCategories.map((category) => (
            <CategoryTag
              key={category}
              label={category}
              onRemove={() =>
                setGeneralCategories((prev) => prev.filter((item) => item !== category))
              }
            />
          ))}
        </div>
      </Card>
    </PanelPage>
  );
};

export default AdminSettingsView;
