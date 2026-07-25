import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/**
 * PhoneFrame wraps content inside a realistic phone SVG frame.
 * Used for demo/preview on desktop to show the mobile experience.
 */
export default function PhoneFrame({ children }: Props) {
  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-8">
      {/* Phone body */}
      <div
        className="relative bg-black rounded-[3rem] p-3 shadow-2xl shadow-black/50"
        style={{ width: 320 }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-black rounded-b-2xl z-10 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-void" />
          <div className="w-16 h-1.5 rounded-full bg-void/60" />
        </div>

        {/* Screen */}
        <div className="relative overflow-hidden rounded-[2.25rem] bg-void" style={{ height: 640 }}>
          {/* Inner scrollable content */}
          <div className="h-full overflow-y-auto scroll-smooth">
            {children}
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-28 h-1 rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
}
