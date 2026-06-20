"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

type HomeLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href?: "/";
};

export function HomeLink({
  onClick,
  href = "/",
  scroll,
  ...props
}: HomeLinkProps) {
  const pathname = usePathname();
  const isOnHome = pathname === "/";

  return (
    <Link
      href={href}
      scroll={scroll ?? !isOnHome}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || !isOnHome) return;
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      {...props}
    />
  );
}
