import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import {
  Check,
  CheckCircle2,
  Clock,
  GraduationCap,
  ImageIcon,
  Microscope,
  Settings2,
  Tag,
  Video,
  X,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import CategoryPill from '@/components/data-display/CategoryPill/CategoryPill';
import StatusBadge from '@/components/data-display/DataTable/StatusBadge';
import AdDetailCard from '@/modules/supplier/components/AdDetailCard';
import {
  AD_CATEGORIES,
  DURATION_TIERS,
  getCategoryById,
  getDurationById,
} from '@/modules/supplier/data/advertisements';
import { panelPrimaryBtn, panelSecondaryBtn } from '@/shared/layout/PanelLayout/panelPageTheme';

const STEPS = [
  { id: 'type', label: 'Type' },
  { id: 'details', label: 'Details' },
  { id: 'media', label: 'Media' },
  { id: 'duration', label: 'Duration' },
  { id: 'preview', label: 'Preview' },
  { id: 'payment', label: 'Payment' },
];

const STEP_ORDER = STEPS.map((step) => step.id);

const CATEGORY_ICONS = {
  product: Microscope,
  service: Settings2,
  promo: Tag,
  webinar: GraduationCap,
};

const fieldClass =
  'w-full rounded-lg border border-[#E4E7EC] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10 sm:text-[15px]';

const labelClass = 'mb-1.5 block text-[13px] font-semibold text-deep-blue sm:text-[14px]';

const defaultForm = {
  categoryId: 'product',
  title: '',
  description: '',
  price: '',
  contact: '',
  eventDate: '',
  eventTime: '',
  location: '',
  organizer: '',
  durationId: '14d',
  imageName: '',
  videoName: '',
};

const CreateAdModal = ({ open, onClose, onCreated }) => {
  const navigate = useNavigate();
  const dialogRef = useRef(null);
  const [step, setStep] = useState('type');
  const [form, setForm] = useState(defaultForm);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const reset = useCallback(() => {
    setStep('type');
    setForm(defaultForm);
    setSuccess(false);
    setError('');
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const category = getCategoryById(form.categoryId);
  const duration = getDurationById(form.durationId);

  const previewAd = useMemo(
    () => ({
      company: 'Meridian Lab Instruments',
      companyInitials: 'ML',
      category: category?.label || 'Product Showcase',
      location: form.location || 'Stuttgart, Germany',
      title: form.title || 'ProSpec Elite Series Spectrophotometer',
      description:
        form.description ||
        'High-precision UV-Vis spectrophotometer for routine QC and research applications.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&fit=crop',
      startDate: duration?.startDate || '18 Aug 2026',
      expiryDate: duration?.endDate || '1 Sep 2026',
      price: form.price ? `€${form.price}` : duration?.price || '€60',
      stats: null,
    }),
    [category, duration, form]
  );

  const setField = (key, value) => {
    setError('');
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateStep = () => {
    if (step === 'details') {
      if (!form.title.trim()) {
        setError('Please enter an advertisement title.');
        return false;
      }
      if (!form.description.trim()) {
        setError('Please enter a description.');
        return false;
      }
    }
    setError('');
    return true;
  };

  const goNext = () => {
    if (!validateStep()) return;
    const index = STEP_ORDER.indexOf(step);
    if (index < STEP_ORDER.length - 1) setStep(STEP_ORDER[index + 1]);
  };

  const goBack = () => {
    setError('');
    const index = STEP_ORDER.indexOf(step);
    if (index > 0) setStep(STEP_ORDER[index - 1]);
  };

  const goToStep = (targetStep) => {
    const currentIndex = STEP_ORDER.indexOf(step);
    const targetIndex = STEP_ORDER.indexOf(targetStep);
    if (targetIndex <= currentIndex) {
      setError('');
      setStep(targetStep);
    }
  };

  const handlePay = () => {
    setSuccess(true);
    onCreated?.({
      id: `ad-${Date.now()}`,
      title: form.title || previewAd.title,
      category: category?.label,
      status: 'Pending',
      views: '—',
      clicks: '—',
      duration: duration?.label || '14 days',
      uploadDate: new Date().toISOString().slice(0, 10),
    });
  };

  const handleFinish = () => {
    onClose();
    navigate('/supplier/ads');
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className="flex max-h-[92dvh] w-full max-w-[640px] flex-col rounded-t-2xl bg-white shadow-xl sm:max-h-[90vh] sm:rounded-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-ad-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#E4E7EC] px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 id="create-ad-title" className="text-[18px] font-bold text-deep-blue sm:text-[20px]">
              Create Advertisement
            </h2>
            <p className="mt-1 text-[13px] text-[#64748B] sm:text-[14px]">
              Promote your products and services to laboratory professionals on Lab Unity.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#F9FAFB]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <SuccessStep
            ad={previewAd}
            category={category?.label}
            duration={duration}
            onFinish={handleFinish}
          />
        ) : (
          <>
            <Stepper current={step} onStepClick={goToStep} />

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
              {step === 'type' ? (
                <TypeStep categoryId={form.categoryId} onSelect={(id) => setField('categoryId', id)} />
              ) : null}
              {step === 'details' ? (
                <DetailsStep categoryId={form.categoryId} form={form} onChange={setField} />
              ) : null}
              {step === 'media' ? (
                <MediaStep
                  imageName={form.imageName}
                  videoName={form.videoName}
                  onImageSelect={(name) => setField('imageName', name)}
                  onVideoSelect={(name) => setField('videoName', name)}
                />
              ) : null}
              {step === 'duration' ? (
                <DurationStep
                  durationId={form.durationId}
                  onSelect={(id) => setField('durationId', id)}
                />
              ) : null}
              {step === 'preview' ? (
                <div className="space-y-3">
                  <p className="text-[14px] font-semibold text-deep-blue sm:text-[15px]">
                    Preview your advertisement
                  </p>
                  <AdDetailCard ad={previewAd} showSocial={false} />
                </div>
              ) : null}
              {step === 'payment' ? <PaymentStep total={duration?.price || '€60'} /> : null}

              {error ? (
                <p className="mt-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-[13px] text-[#DC2626]">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#E4E7EC] px-4 py-4 sm:px-6">
              {step === 'type' ? (
                <div />
              ) : (
                <button type="button" onClick={goBack} className={panelSecondaryBtn}>
                  Back
                </button>
              )}

              {step === 'payment' ? (
                <button type="button" onClick={handlePay} className={panelPrimaryBtn}>
                  Pay {duration?.price || '€60'}
                </button>
              ) : (
                <button type="button" onClick={goNext} className={panelPrimaryBtn}>
                  {step === 'type'
                    ? 'Continue'
                    : step === 'details'
                      ? 'Continue to Media'
                      : step === 'media'
                        ? 'Continue to Duration'
                        : step === 'duration'
                          ? 'Continue to Preview'
                          : 'Continue to Payment'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

const Stepper = ({ current, onStepClick }) => (
  <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-[#E4E7EC] px-4 sm:px-6">
    {STEPS.map((item) => {
      const active = item.id === current;
      const currentIndex = STEP_ORDER.indexOf(current);
      const itemIndex = STEP_ORDER.indexOf(item.id);
      const passed = itemIndex < currentIndex;

      return (
        <button
          key={item.id}
          type="button"
          onClick={() => (passed || active ? onStepClick(item.id) : undefined)}
          disabled={!passed && !active}
          className={`shrink-0 border-b-2 px-3 py-3 text-[12px] font-semibold transition-colors sm:text-[13px] ${
            active
              ? 'border-primary text-primary'
              : passed
                ? 'border-transparent text-primary/70 hover:text-primary'
                : 'cursor-default border-transparent text-[#98A2B3]'
          }`}
        >
          {item.label}
        </button>
      );
    })}
  </div>
);

const TypeStep = ({ categoryId, onSelect }) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    {AD_CATEGORIES.map((item) => {
      const Icon = CATEGORY_ICONS[item.id] || Tag;
      const selected = categoryId === item.id;
      return (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          className={`rounded-xl border p-4 text-left transition-colors ${
            selected
              ? 'border-primary bg-secondary/40'
              : 'border-[#E4E7EC] bg-white hover:border-[#D0D5DD]'
          }`}
        >
          <div
            className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${
              selected ? 'bg-primary text-white' : 'bg-[#F3F4F6] text-[#64748B]'
            }`}
          >
            <Icon className="h-4 w-4" />
          </div>
          <p className="text-[14px] font-bold text-deep-blue sm:text-[15px]">{item.label}</p>
          <p className="mt-1 text-[12px] leading-relaxed text-[#64748B] sm:text-[13px]">
            {item.description}
          </p>
        </button>
      );
    })}
  </div>
);

const DetailsStep = ({ categoryId, form, onChange }) => {
  const category = getCategoryById(categoryId);

  return (
    <div className="space-y-4">
      <CategoryPill label={category?.label} />

      <div>
        <label htmlFor="ad-title" className={labelClass}>
          Advertisement Title <span className="text-pink-light">*</span>
        </label>
        <input
          id="ad-title"
          type="text"
          value={form.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="e.g. ProSpec Elite Series Spectrophotometer"
          className={fieldClass}
        />
      </div>

      {categoryId === 'webinar' ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="event-date" className={labelClass}>
                Event Date
              </label>
              <input
                id="event-date"
                type="date"
                value={form.eventDate}
                onChange={(e) => onChange('eventDate', e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="event-time" className={labelClass}>
                Event Time
              </label>
              <input
                id="event-time"
                type="time"
                value={form.eventTime}
                onChange={(e) => onChange('eventTime', e.target.value)}
                className={fieldClass}
              />
            </div>
          </div>
          <div>
            <label htmlFor="location" className={labelClass}>
              Location / Online
            </label>
            <input
              id="location"
              type="text"
              value={form.location}
              onChange={(e) => onChange('location', e.target.value)}
              placeholder="Zoom link or venue address"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="organizer" className={labelClass}>
              Organizer
            </label>
            <input
              id="organizer"
              type="text"
              value={form.organizer}
              onChange={(e) => onChange('organizer', e.target.value)}
              placeholder="Company or organizer name"
              className={fieldClass}
            />
          </div>
        </>
      ) : null}

      {categoryId === 'service' ? (
        <div>
          <label htmlFor="contact" className={labelClass}>
            Contact Information
          </label>
          <input
            id="contact"
            type="text"
            value={form.contact}
            onChange={(e) => onChange('contact', e.target.value)}
            placeholder="email@company.com / +353 1 234 5678"
            className={fieldClass}
          />
        </div>
      ) : null}

      {(categoryId === 'product' || categoryId === 'promo' || categoryId === 'webinar') && (
        <div>
          <label htmlFor="price" className={labelClass}>
            {categoryId === 'promo' ? 'Offer Price' : 'Price (€)'}
          </label>
          <input
            id="price"
            type="text"
            value={form.price}
            onChange={(e) => onChange('price', e.target.value)}
            placeholder={categoryId === 'product' ? '8200 per unit' : '60'}
            className={fieldClass}
          />
        </div>
      )}

      <div>
        <label htmlFor="description" className={labelClass}>
          Description <span className="text-pink-light">*</span>
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => onChange('description', e.target.value)}
          rows={4}
          placeholder="Describe your product, service, or event..."
          className={fieldClass}
        />
      </div>
    </div>
  );
};

const MediaStep = ({ imageName, videoName, onImageSelect, onVideoSelect }) => (
  <div className="space-y-4">
    <p className="text-[14px] text-[#64748B] sm:text-[15px]">
      Add images and an optional video to make your advertisement stand out.
    </p>
    <div>
      <p className={labelClass}>Upload Media</p>
      <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#D0D5DD] bg-[#F9FAFB] px-4 py-10 text-center hover:border-primary hover:bg-secondary/20">
        <ImageIcon className="h-8 w-8 text-[#98A2B3]" />
        <span className="text-[14px] font-medium text-deep-blue">
          {imageName || 'Drop images here or click to upload'}
        </span>
        <span className="text-[12px] text-[#98A2B3] sm:text-[13px]">
          PNG, JPG, WEBP up to 10MB · Recommended: 1200×628px
        </span>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={(event) => onImageSelect(event.target.files?.[0]?.name || '')}
        />
      </label>
    </div>
    <div>
      <p className={labelClass}>Video (Optional)</p>
      <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#D0D5DD] bg-[#F9FAFB] px-4 py-4 hover:border-primary hover:bg-secondary/20">
        <Video className="h-5 w-5 shrink-0 text-[#98A2B3]" />
        <div>
          <p className="text-[14px] font-medium text-deep-blue">
            {videoName || 'Add a product demo video'}
          </p>
          <p className="text-[12px] text-[#98A2B3] sm:text-[13px]">MP4, MOV up to 100MB</p>
        </div>
        <input
          type="file"
          accept="video/mp4,video/quicktime"
          className="sr-only"
          onChange={(event) => onVideoSelect(event.target.files?.[0]?.name || '')}
        />
      </label>
    </div>
  </div>
);

const DurationStep = ({ durationId, onSelect }) => {
  const selected = getDurationById(durationId);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[15px] font-bold text-deep-blue sm:text-[16px]">
          Select Advertisement Duration
        </p>
        <p className="mt-1 text-[13px] text-[#64748B] sm:text-[14px]">
          Choose how long your advertisement will run. Payment is required to submit for review.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {DURATION_TIERS.map((tier) => {
          const active = durationId === tier.id;
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => onSelect(tier.id)}
              className={`relative rounded-xl border p-4 text-left transition-colors ${
                active
                  ? 'border-green-primary bg-green-secondary/30'
                  : 'border-[#E4E7EC] bg-white hover:border-[#D0D5DD]'
              }`}
            >
              {tier.popular ? (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-green-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Most Popular
                </span>
              ) : null}
              <p className="text-[14px] font-bold text-deep-blue">{tier.label}</p>
              <p className="mt-2 text-[20px] font-bold text-deep-blue">{tier.price}</p>
              <p className="mt-2 text-[11px] text-[#64748B] sm:text-[12px]">
                {tier.startDate} – {tier.endDate}
              </p>
            </button>
          );
        })}
      </div>

      {selected ? (
        <div className="rounded-xl border border-pink-secondary bg-pink-secondary/20 p-4">
          <p className="text-[13px] font-bold text-deep-blue sm:text-[14px]">Selected Duration Summary</p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryItem label="Duration" value={selected.label} />
            <SummaryItem label="Start Date" value={selected.startDate} />
            <SummaryItem label="End Date" value={selected.endDate} />
            <SummaryItem label="Total Price" value={selected.price} highlight />
          </div>
        </div>
      ) : null}
    </div>
  );
};

const SummaryItem = ({ label, value, highlight = false }) => (
  <div>
    <p className="text-[11px] text-[#64748B] sm:text-[12px]">{label}</p>
    <p
      className={`mt-0.5 text-[13px] font-semibold sm:text-[14px] ${
        highlight ? 'text-pink-light' : 'text-deep-blue'
      }`}
    >
      {value}
    </p>
  </div>
);

const PaymentStep = ({ total }) => (
  <div className="space-y-4">
    <p className="text-[14px] text-[#64748B] sm:text-[15px]">
      Complete payment to submit your advertisement for administrator review.
    </p>
    <div className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-4">
      <p className="text-[13px] text-[#64748B]">Total due</p>
      <p className="text-[24px] font-bold text-deep-blue">{total}</p>
    </div>
    <div>
      <label htmlFor="card-number" className={labelClass}>
        Card Number
      </label>
      <input id="card-number" type="text" placeholder="4242 4242 4242 4242" className={fieldClass} />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label htmlFor="expiry" className={labelClass}>
          Expiry
        </label>
        <input id="expiry" type="text" placeholder="MM/YY" className={fieldClass} />
      </div>
      <div>
        <label htmlFor="cvc" className={labelClass}>
          CVC
        </label>
        <input id="cvc" type="text" placeholder="123" className={fieldClass} />
      </div>
    </div>
  </div>
);

const SuccessStep = ({ ad, category, duration, onFinish }) => (
  <>
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-secondary text-green-primary">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-[20px] font-bold text-deep-blue sm:text-[22px]">Payment Successful</h3>
        <p className="mt-2 text-[14px] text-[#64748B] sm:text-[15px]">
          Your advertisement has been submitted and is pending administrator review.
        </p>
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="flex items-start justify-between gap-3 border-b border-[#E4E7EC] px-4 py-4">
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-deep-blue">{ad.title}</p>
            <CategoryPill label={category} className="mt-1" />
          </div>
          <StatusBadge status="Pending" label="Pending Review" />
        </div>
        <div className="grid grid-cols-3 gap-3 px-4 py-4 text-center">
          <SummaryItem label="Duration" value={duration?.label} />
          <SummaryItem label="Start Date" value={duration?.startDate} />
          <SummaryItem label="End Date" value={duration?.endDate} />
        </div>
      </Card>

      <div className="mt-5 space-y-2">
        <StatusRow icon={Check} label="Payment confirmed" done />
        <StatusRow icon={Clock} label="Pending administrator review" active />
        <StatusRow label="Advertisement approved & goes live" />
      </div>

      <p className="mt-4 text-center text-[12px] text-[#64748B] sm:text-[13px]">
        Review typically takes 1–2 business days.
      </p>
    </div>

    <div className="shrink-0 border-t border-[#E4E7EC] px-4 py-4 sm:px-6">
      <button type="button" onClick={onFinish} className={`${panelPrimaryBtn} w-full`}>
        Go to My Advertisements
      </button>
    </div>
  </>
);

const StatusRow = ({ icon: Icon, label, done = false, active = false }) => (
  <div
    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${
      done ? 'bg-green-secondary/40' : active ? 'bg-secondary/40' : 'bg-[#F9FAFB]'
    }`}
  >
    <div
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
        done ? 'bg-green-primary text-white' : active ? 'bg-primary text-white' : 'border border-[#E4E7EC] bg-white'
      }`}
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
    </div>
    <span className="text-[13px] font-medium text-deep-blue sm:text-[14px]">{label}</span>
  </div>
);

export default CreateAdModal;
