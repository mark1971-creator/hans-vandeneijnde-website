"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
    >
      {children}
    </motion.div>
  );
}
