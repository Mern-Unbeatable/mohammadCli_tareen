/** Map subscription / plan API payloads onto billing UI props. */

export function toPlanModel(plan) {
  if (!plan) return null;
  const id = String(plan.id || plan.plan || plan.code || "").toLowerCase();
  const price =
    plan.priceLabel ||
    plan.displayPrice ||
    (plan.price != null ? `€${plan.price}` : "");

  return {
    id: id || plan.id,
    label: plan.label || plan.name || id,
    price,
    period: plan.period || plan.interval || "",
    fullPrice: plan.fullPrice || (price && plan.period ? `${price} / ${plan.period}` : price),
    subscribeLabel:
      plan.subscribeLabel ||
      (price ? `Subscribe — ${price}` : "Subscribe"),
    features: Array.isArray(plan.features) ? plan.features : [],
    raw: plan,
  };
}

export function toSubscriptionModel(subscription) {
  if (!subscription) return null;
  return {
    id: subscription.id,
    plan: subscription.plan || subscription.planId || null,
    status: subscription.status || null,
    renewsAt: subscription.renewsAt || subscription.currentPeriodEnd || null,
    cancelsAt: subscription.cancelsAt || null,
    features: Array.isArray(subscription.features)
      ? subscription.features
      : [],
    raw: subscription,
  };
}

export function toPlansList(data) {
  if (Array.isArray(data)) return data.map(toPlanModel).filter(Boolean);
  if (Array.isArray(data?.plans)) return data.plans.map(toPlanModel).filter(Boolean);
  if (data && typeof data === "object") {
    return Object.values(data).map(toPlanModel).filter(Boolean);
  }
  return [];
}
