import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

const labelClass = 'mb-1.5 block text-base font-medium text-deep-blue';
const inputClass =
  'w-full rounded-md border border-[#D0D5DD] bg-white px-3.5 py-2.5 text-[15px] text-deep-blue outline-none transition-colors placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/15';
const selectClass = `${inputClass} appearance-none pr-10`;

const SelectField = ({ id, label, defaultValue, children }) => (
  <div>
    <label htmlFor={id} className={labelClass}>
      {label}
    </label>
    <div className="relative">
      <select id={id} defaultValue={defaultValue} className={selectClass}>
        {children}
      </select>
      <IoIosArrowDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#64748B]"
      />
    </div>
  </div>
);
const profileOptions = [
  { value: '', label: 'Select One' },
  { value: 'laboratory', label: 'Laboratory — For laboratories and laboratory professionals' },
  { value: 'hospital', label: 'Hospital — For hospitals and healthcare organizations' },
  { value: 'clinic', label: 'Clinic — For clinics and healthcare professionals' },
  { value: 'supplier', label: 'Supplier — For laboratory equipment, products, and services suppliers' },
  { value: 'professional', label: 'Professional — For individual professionals in the laboratory industry' },
  { value: 'other', label: 'Other — If none of the above describes you' },
];

const countries = ['Belgium', 'France', 'Germany', 'Netherlands', 'United Kingdom', 'United States'];

const PasswordField = ({ id, label, value, onChange, visible, onToggle }) => (
  <div>
    <label htmlFor={id} className={labelClass}>
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        className={`${inputClass} pr-10`}
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#64748B]"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  </div>
);

const RegisterView = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const strength = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  return (
    <section className="px-4 sm:px-6 py-10 lg:py-12">
      <div className="mx-auto w-full max-w-[760px]">
        <div className="mb-8 text-center">
          <h1 className="text-[32px] font-bold tracking-[-0.02em] text-deep-blue sm:text-[36px]">
            Join Lab Unity
          </h1>
          <p className="mt-2 text-[15px] text-[#64748B]">
            Free during the initial trial period. No payment required to register.
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 sm:p-8">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <SelectField id="profileType" label="What best describes you?" defaultValue="">
              {profileOptions.map(({ value, label }) => (
                <option key={value || 'default'} value={value} disabled={!value}>
                  {label}
                </option>
              ))}
            </SelectField>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className={labelClass}>
                  First Name
                </label>
                <input id="firstName" type="text" defaultValue="Elise" className={inputClass} />
              </div>
              <div>
                <label htmlFor="lastName" className={labelClass}>
                  Last Name
                </label>
                <input id="lastName" type="text" defaultValue="Moreau" className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="jobTitle" className={labelClass}>
                Job Title / Position
              </label>
              <input
                id="jobTitle"
                type="text"
                defaultValue="Quality Control Manager"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="company" className={labelClass}>
                Company or Laboratory Name
              </label>
              <input
                id="company"
                type="text"
                defaultValue="Novalab Diagnostics"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@laboratory.com"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  defaultValue="+32 471 00 00 00"
                  className={inputClass}
                />
              </div>
              <SelectField id="country" label="Country" defaultValue="Belgium">
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </SelectField>
            </div>

            <div>
              <label htmlFor="professionalInfo" className={labelClass}>
                Professional Information
              </label>
              <textarea
                id="professionalInfo"
                rows={4}
                placeholder="write professional information about you within 100-150 word"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <PasswordField
                id="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                visible={showPassword}
                onToggle={() => setShowPassword((prev) => !prev)}
              />
              <PasswordField
                id="confirmPassword"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                visible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((prev) => !prev)}
              />
            </div>

            <div>
              <p className="text-[14px] text-[#64748B]">
                Use 8+ characters with an uppercase letter, a number and a symbol.
              </p>
              <div className="mt-2 flex gap-2">
                {strength.map((passed, index) => (
                  <span
                    key={index}
                    className={`h-1 flex-1 rounded-full ${passed ? 'bg-primary' : 'bg-[#E4E7EC]'}`}
                  />
                ))}
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#D0D5DD] text-primary focus:ring-primary/20"
              />
              <span className="text-[14px] leading-[1.6] text-[#475467]">
                I accept the Lab Unity{' '}
                <a href="#" className="font-medium text-primary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-medium text-primary hover:underline">
                  Privacy Policy
                </a>
                , and agree to be listed in the professional contacts directory.
              </span>
            </label>

            <button
              type="submit"
              className="w-full rounded-md bg-primary py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              Create free account
            </button>

            <div className="flex items-center justify-center gap-2 pt-1 text-[13px] text-[#64748B]">
              <ShieldCheck className="h-4 w-4 text-[#98A2B3]" strokeWidth={2} />
              No payment details required during the trial
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegisterView;
