export default function Card({ children }) {
  return (
    <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-xl shadow-md">
      {children}
    </div>
  );
}
