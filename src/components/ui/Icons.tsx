import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 16, ...props }: IconProps): SVGProps<SVGSVGElement> {
  return {
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    focusable: false,
    ...props,
  };
}

export function ArrowRight(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base(props)}>
      <path d="M3 12h17M14 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base(props)}>
      <path d="M21 12H4M10 6l-6 6 6 6" />
    </svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base(props)}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function ArrowUp(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base(props)}>
      <path d="M12 21V4M6 10l6-6 6 6" />
    </svg>
  );
}

export function Plus(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base(props)}>
      <path d="M12 4v16M4 12h16" />
    </svg>
  );
}

/** Marca do WhatsApp em traço fino, monocromática — reconhecível sem o verde. */
export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base(props)}>
      <path d="M3.6 20.4 4.8 16A8.6 8.6 0 1 1 8 19.2l-4.4 1.2Z" />
      <path d="M9.1 8.3c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.4l.8 1.8c.1.2.1.4 0 .6l-.5.7c-.1.2-.2.3 0 .6.6 1 1.4 1.8 2.5 2.4.3.1.4.1.6-.1l.7-.8c.2-.2.3-.2.6-.1l1.7.8c.3.1.4.2.4.4 0 .5-.2 1.1-.6 1.4-.5.4-1.3.7-2.2.5-1.5-.3-3-1.2-4.2-2.4-1.1-1.1-2-2.5-2.3-3.8-.2-.9 0-1.6.4-2Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base(props)}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.9" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base(props)}>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </svg>
  );
}
