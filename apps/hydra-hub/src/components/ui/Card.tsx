interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`
      bg-white
      border border-slate-200 rounded-xl
      p-5 sm:p-6
      shadow-sm
      hover:shadow-md
      transition-all duration-200
      ${className}
    `}>
      {children}
    </div>
  );
}