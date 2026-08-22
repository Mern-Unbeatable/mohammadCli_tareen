import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Upload } from 'lucide-react';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import { currentUser } from '../../data/dashboard';
import { profileCountries } from '../../data/subscription';

const fieldClass =
  'w-full rounded-lg border border-[#E4E7EC] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10';

const labelClass = 'mb-1.5 block text-[13px] font-semibold text-deep-blue';

const UploadBox = ({ title, hint }) => (
  <button
    type="button"
    className="flex w-full flex-col items-center justify-center rounded-lg border border-dashed border-[#D0D5DD] bg-[#F9FAFB] px-4 py-8 text-center transition-colors hover:border-primary hover:bg-secondary/40"
  >
    <Upload className="h-6 w-6 text-[#98A2B3]" />
    <p className="mt-3 text-[13px] font-semibold text-deep-blue">{title}</p>
    <p className="mt-1 text-[11px] text-[#98A2B3]">{hint}</p>
  </button>
);

const ProfileSetupView = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    title: currentUser.title,
    company: currentUser.company,
    country: currentUser.country,
    email: currentUser.email,
    phone: currentUser.phone,
    about: `${currentUser.about} ${currentUser.aboutExtended || ''}`.trim(),
  });

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/profile');
  };

  return (
    <main className="py-6 sm:py-10">
      <Container className="max-w-[760px]">
        <Card>
          <div className="border-b border-[#E4E7EC] px-5 py-5 sm:px-8 sm:py-6">
            <h1 className="text-[22px] font-bold text-deep-blue sm:text-[26px]">
              Set up your professional profile
            </h1>
            <p className="mt-2 text-[14px] text-[#64748B]">
              This is what laboratories, suppliers and recruiters will see.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 px-5 py-6 sm:px-8 sm:py-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className={labelClass}>
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={update('firstName')}
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
                  value={form.lastName}
                  onChange={update('lastName')}
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
                value={form.title}
                onChange={update('title')}
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
                  value={form.company}
                  onChange={update('company')}
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
                  value={form.country}
                  onChange={update('country')}
                  className={fieldClass}
                  required
                >
                  {profileCountries.map((country) => (
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
                  value={form.email}
                  onChange={update('email')}
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
                  value={form.phone}
                  onChange={update('phone')}
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
                value={form.about}
                onChange={update('about')}
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
              Save and Start Networking
            </button>
          </form>
        </Card>
      </Container>
    </main>
  );
};

export default ProfileSetupView;
