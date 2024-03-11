import React from "react";
import { tv } from "tailwind-variants";

const cardStyles = tv({
  base: "rounded-2xl bg-white shadow-xs border border-slate-200",
});

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

function Card({ className, ...others }: CardProps) {
  return <div className={cardStyles({ class: className })} {...others} />;
}

const cardHeaderStyles = tv({
  base: "space-y-0 p-5",
});

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

function CardHeader({ className, ...others }: CardHeaderProps) {
  return <div className={cardHeaderStyles({ class: className })} {...others} />;
}

const cardTitleStyles = tv({
  base: "text-slate-900 text-lg font-semibold leading-7",
});

export interface CardTitleProps extends React.HTMLAttributes<HTMLDivElement> {}

function CardTitle({ className, ...others }: CardTitleProps) {
  return <div className={cardTitleStyles({ class: className })} {...others} />;
}

const cardSubtitleStyles = tv({
  base: "text-slate-500 text-sm leading-relaxed",
});

export interface CardSubtitleProps
  extends React.HTMLAttributes<HTMLDivElement> {}

function CardSubtitle({ className, ...others }: CardSubtitleProps) {
  return (
    <div className={cardSubtitleStyles({ class: className })} {...others} />
  );
}

const cardBodyStyles = tv({
  base: "p-5",
});

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

function CardBody({ className, ...others }: CardBodyProps) {
  return <div className={cardBodyStyles({ class: className })} {...others} />;
}

const cardFooterStyles = tv({
  base: "space-y-0 p-5",
});

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

function CardFooter({ className, ...others }: CardFooterProps) {
  return <div className={cardFooterStyles({ class: className })} {...others} />;
}

const Composed = Object.assign(Card, {
  Header: CardHeader,
  Body: CardBody,
  Title: CardTitle,
  Subtitle: CardSubtitle,
  Footer: CardFooter,
});

export { Composed as Card };
