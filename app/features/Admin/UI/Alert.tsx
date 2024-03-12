import { forwardRef } from "react";
import { VariantProps, tv } from "tailwind-variants";

const styles = tv({
  base: "text-sm bg-opacity-10 p-5 leading-relaxed rounded-xl",
  variants: {
    kind: {
      error: "text-red-500 bg-red-500 bg-opacity-10",
      success: "text-green-500 bg-green-500 bg-opacity-10",
      warning: "text-yellow-500 bg-yellow-500 bg-opacity-10",
      info: "text-blue-500 bg-blue-500 bg-opacity-10",
    },
  },
  defaultVariants: {
    kind: "info",
  },
});

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof styles> {}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, kind, ...props }, ref) => {
    return (
      <div
        role="alert"
        ref={ref}
        className={styles({ class: className, kind })}
        {...props}
      />
    );
  }
);

Alert.displayName = "Alert";

export { Alert };
