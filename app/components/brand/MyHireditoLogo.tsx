import Link from "next/link";

type LogoVariant = "icon" | "lockup" | "wordmark";
type LogoTheme = "dark" | "light";
type LogoSize = "sm" | "md" | "lg";

const sizeMap: Record<
  LogoSize,
  { icon: number; text: string; wordmark: string }
> = {
  sm: { icon: 28, text: "text-base", wordmark: "h-7" },
  md: { icon: 32, text: "text-lg lg:text-xl", wordmark: "h-8" },
  lg: { icon: 40, text: "text-2xl lg:text-[1.75rem]", wordmark: "h-10" },
};

type Props = {
  href?: string;
  variant?: LogoVariant;
  theme?: LogoTheme;
  size?: LogoSize;
  className?: string;
};

export function MyHireditoLogo({
  href = "/",
  variant = "lockup",
  theme = "dark",
  size = "md",
  className = "",
}: Props) {
  const dimensions = sizeMap[size];
  const textColor = theme === "dark" ? "text-white" : "text-zinc-900";

  const content = (
    <span className={`inline-flex shrink-0 items-center gap-2.5 ${className}`}>
      {variant === "wordmark" ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src="/myhiredito-logo-wordmark.png"
          alt="MyHiredito"
          className={`${dimensions.wordmark} w-auto object-contain`}
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/myhiredito-logo.png"
            alt=""
            width={dimensions.icon}
            height={dimensions.icon}
            className="shrink-0 rounded-lg object-contain"
            aria-hidden
          />
          {variant === "lockup" && (
            <span
              className={`font-brand font-bold leading-none ${dimensions.text} ${textColor}`}
            >
              <span className="text-[var(--brand)]">My</span>
              Hiredito
            </span>
          )}
        </>
      )}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="shrink-0" aria-label="MyHiredito home">
      {content}
    </Link>
  );
}
