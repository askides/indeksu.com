import { tv } from "tailwind-variants";

export const styles = tv({
  base: "block text-sm font-semibold tracking-tight",
});

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className, ...others }: LabelProps) {
  return <label className={styles({ class: className })} {...others} />;
}
