export default function Card({ children, className = "", onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-5 bg-slate-900/70 border border-slate-800 rounded-xl shadow-md transition: transform .15s ease, box-shadow .15s ease hover:scale-[1.01] hover:shadow-lg hover:shadow-emerald-700/20 ${
        onClick ? "cursor-pointer" : ""
      }${className}`}
    >
      {children}
    </div>
  );
}
