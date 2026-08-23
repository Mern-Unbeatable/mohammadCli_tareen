import { Upload } from 'lucide-react';
import Card from '@/components/ui/Card';

const fieldClass =
  'w-full rounded-lg border border-[#E4E7EC] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10';

const labelClass = 'mb-1.5 block text-[13px] font-semibold text-deep-blue';

const UploadBox = ({ title, hint, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full flex-col items-center justify-center rounded-lg border border-dashed border-[#D0D5DD] bg-[#F9FAFB] px-4 py-8 text-center transition-colors hover:border-primary hover:bg-secondary/40"
  >
    <Upload className="h-6 w-6 text-[#98A2B3]" />
    <p className="mt-3 text-[13px] font-semibold text-deep-blue">{title}</p>
    <p className="mt-1 text-[11px] text-[#98A2B3]">{hint}</p>
  </button>
);

const ProfileSetupForm = ({
  values,
  onChange,
  onSubmit,
  countries = [],
  submitLabel = 'Save and Start Networking',
  title = 'Set up your professional profile',
  subtitle = 'This is what laboratories, suppliers and recruiters will see.',
}) => (
  <Card>
    <div className="border-b border-[#E4E7EC] px-5 py-5 sm:px-8 sm:py-6">
      <h1 className="text-[22px] font-bold text-deep-blue sm:text-[26px]">{title}</h1>
      <p className="mt-2 text-[14px] text-[#64748B]">{subtitle}</p>
    </div>

    <form onSubmit={onSubmit} className="space-y-5 px-5 py-6 sm:px-8 sm:py-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={values.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            className={fieldClass}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={values.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            className={fieldClass}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>
          Job Title / Position
        </label>
        <input
          id="title"
          type="text"
          value={values.title}
          onChange={(e) => onChange('title', e.target.value)}
          className={fieldClass}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className={labelClass}>
            Company / Laboratory Name
          </label>
          <input
            id="company"
            type="text"
            value={values.company}
            onChange={(e) => onChange('company', e.target.value)}
            className={fieldClass}
            required
          />
        </div>
        <div>
          <label htmlFor="country" className={labelClass}>
            Country
          </label>
          <select
            id="country"
            value={values.country}
            onChange={(e) => onChange('country', e.target.value)}
            className={fieldClass}
            required
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => onChange('email', e.target.value)}
            className={fieldClass}
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            value={values.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className={fieldClass}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="about" className={labelClass}>
          Professional information
        </label>
        <textarea
          id="about"
          rows={5}
          value={values.about}
          onChange={(e) => onChange('about', e.target.value)}
          className={`${fieldClass} resize-y`}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <UploadBox title="Upload Profile Photo" hint="JPG, PNG or WebP · 400×400px" />
        <UploadBox title="Upload Cover Photo" hint="JPG, PNG or WebP · 1600×600px" />
      </div>

      <button
        type="submit"
        className="inline-flex rounded-lg bg-primary px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#066BB0]"
      >
        {submitLabel}
      </button>
    </form>
  </Card>
);

export default ProfileSetupForm;
