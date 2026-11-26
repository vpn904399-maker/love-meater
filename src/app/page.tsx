import { FloatingHearts } from "@/components/FloatingHearts";
import { LoveMeterApp } from "@/components/LoveMeterApp";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
      <FloatingHearts />
      <LoveMeterApp />
    </div>
  );
}

