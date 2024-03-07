import * as React from "react";
import { tv, VariantProps } from "tailwind-variants";

export const styles = tv({
  base: "w-full rounded-sm bg-black text-white px-7 py-4 font-semibold uppercase disabled:bg-black/50 disabled:cursor-not-allowed",
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof styles> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button className={styles({ class: className })} ref={ref} {...props} />
    );
  }
);

Button.displayName = "Button";

export { Button };
