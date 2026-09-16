/**
 * Map API user ↔ ProfileSetupForm / ProfilePageContent shape.
 */

const formatDisplayDate = (value) => {
  if (!value) return null;
  if (typeof value === "string" && !/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatPlanName = (plan) => {
  if (!plan) return "Lab Unity Membership";
  const key = String(plan).toUpperCase();
  if (key === "MONTHLY") return "Lab Unity Membership (Monthly)";
  if (key === "YEARLY") return "Lab Unity Membership (Yearly)";
  return String(plan);
};

const formatStatusLabel = (status) => {
  if (!status) return "—";
  const key = String(status).toUpperCase();
  if (key === "ACTIVE") return "Active";
  if (key === "TRIAL") return "Trial";
  if (key === "CANCELLED" || key === "CANCELED") return "Cancelled";
  if (key === "EXPIRED") return "Expired";
  return String(status);
};

export const emptyProfileForm = {
  firstName: "",
  lastName: "",
  title: "",
  company: "",
  country: "Belgium",
  email: "",
  phone: "",
  about: "",
};

export function mapUserToForm(user) {
  const profile = user?.profile || {};
  return {
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    title: profile.title || "",
    company: profile.company || "",
    country: profile.country || "Belgium",
    email: user?.email || "",
    phone: profile.phone || "",
    about: [profile.about, profile.aboutExtended]
      .filter(Boolean)
      .join(" ")
      .trim(),
  };
}

/**
 * Build PATCH /users/me body from form values (email is not updatable here).
 */
export function formToUpdatePayload(form) {
  const payload = {};
  if (form.firstName?.trim()) payload.firstName = form.firstName.trim();
  if (form.lastName?.trim()) payload.lastName = form.lastName.trim();
  if (form.title != null) payload.title = String(form.title).trim();
  if (form.company != null) payload.company = String(form.company).trim();
  if (form.country != null) payload.country = String(form.country).trim();
  if (form.phone != null) payload.phone = String(form.phone).trim();
  if (form.about != null) payload.about = String(form.about).trim();
  return payload;
}

/** Map /users/me payload onto ProfilePageContent `user` props. */
export function toProfilePageUser(user) {
  if (!user) return null;
  const profile = user.profile || {};
  const name =
    profile.name ||
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    user.email ||
    "Member";
  const subscription = user.subscription || {};
  const status = String(subscription.status || "").toUpperCase();
  const isPremium = ["ACTIVE", "TRIAL"].includes(status);

  return {
    id: user.id,
    email: user.email || "",
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    name,
    initials:
      profile.initials ||
      name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("") ||
      "MB",
    title: profile.title || "",
    company: profile.company || "",
    country: profile.country || "",
    location: profile.location || profile.country || "",
    phone: profile.phone || "",
    about: profile.about || "",
    aboutExtended: profile.aboutExtended || profile.about || "",
    avatar: profile.avatar || null,
    coverPhoto: profile.coverPhoto || null,
    connections: profile.connections ?? 0,
    membershipStatus: isPremium
      ? status === "TRIAL"
        ? "trial"
        : "premium"
      : "free",
    trialDaysLeft: subscription.trialDaysLeft ?? 0,
    trialDaysTotal: subscription.trialDaysTotal ?? 90,
    subscription: {
      planName: formatPlanName(subscription.plan),
      status: formatStatusLabel(subscription.status),
      startDate: formatDisplayDate(subscription.startDate),
      renewalDate: formatDisplayDate(subscription.renewalDate),
      amount:
        subscription.amount != null
          ? `€${Number(subscription.amount).toFixed(2)}`
          : null,
      billingCycle: subscription.billingCycle || null,
      nextPayment: formatDisplayDate(subscription.nextPayment),
      paymentMethod: subscription.paymentMethod || null,
    },
    raw: user,
  };
}
