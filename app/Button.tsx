export default function Button({ children, onClick, variant="primary" }: { children: React.ReactNode; onClick?: () => void; variant?: "primary"|"ghost" }) {
  const base = "px-4 py-2 rounded-md font-medium";
  const style = variant === "primary" ? "bg-sky-600 text-white hover:bg-sky-700" : "bg-transparent border border-slate-200";
  return (
    <button onClick={onClick} className={`${base} ${style}`}>{children}</button>
  );
}
