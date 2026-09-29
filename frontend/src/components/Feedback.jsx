export function Loading({ label = "Loading" }) {
  return <p className="feedback" role="status">{label}...</p>;
}

export function ErrorMessage({ children }) {
  if (!children) return null;
  return <p className="feedback feedback-error" role="alert">{children}</p>;
}

export function EmptyMessage({ children }) {
  return <p className="feedback feedback-empty">{children}</p>;
}