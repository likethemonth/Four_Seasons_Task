import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 text-[13px] font-medium transition-all";

  const variants = {
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "border border-gray-300 bg-white text-black hover:border-black",
    gold: "bg-[#B8860B] text-black hover:bg-[#D4A84B]",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
