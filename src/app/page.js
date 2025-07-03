"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return null;
}
