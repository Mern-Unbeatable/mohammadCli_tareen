/**
 * Map API user → AdminAccountForm shape.
 */
export function mapUserToForm(user) {
  const profile = user?.profile || {};
  const name =
    profile.name ||
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "";
  return {
    name,
    email: user?.email || "",
    displayName: name || "Admin",
    displayEmail: user?.email || "",
  };
}

/**
 * Split a full name into firstName / lastName for PATCH /users/me.
 */
export function nameToProfilePayload(fullName) {
  const trimmed = String(fullName || "").trim();
  const [firstName, ...rest] = trimmed.split(/\s+/);
  const lastName = rest.join(" ") || firstName;
  return { firstName, lastName };
}
