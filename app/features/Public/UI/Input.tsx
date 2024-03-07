import * as React from "react";
import { tv } from "tailwind-variants";

export const styles = tv({
  base: "block w-full rounded-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-inset ring-2 ring-inset ring-sky-500 border-0 px-5 py-4 text-sm",
});

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={styles({ class: className })}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
