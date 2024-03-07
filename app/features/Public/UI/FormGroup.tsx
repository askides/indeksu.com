import type { HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

export const styles = tv({
  base: "space-y-2",
});

export interface FormGroupProps extends HTMLAttributes<HTMLDivElement> {}

export function FormGroup({ className, ...others }: FormGroupProps) {
  return <div className={styles({ class: className })} {...others} />;
}
