"use client";

import dynamic from "next/dynamic";
import { LottieComponentProps } from "lottie-react";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted/20 animate-pulse rounded-lg" />
});

export default function LottieAnimation({ animationData, ...props }: LottieComponentProps) {
  return <Lottie animationData={animationData} {...props} />;
} 