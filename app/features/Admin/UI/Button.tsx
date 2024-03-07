import { forwardRef } from "react";
import { tv, VariantProps } from "tailwind-variants";

const styles = tv({
  base: "w-full rounded-xl bg-black text-white font-semibold",
  variants: {
    size: {
      sm: "h-10 text-sm",
      md: "h-12 text-base",
      lg: "h-14 text-lg",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof styles> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button className={styles({ class: className })} ref={ref} {...props} />
    );
  }
);

Button.displayName = "Button";

export { Button };
