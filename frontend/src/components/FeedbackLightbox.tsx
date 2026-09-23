import { useEffect, useCallback } from "react";

interface FeedbackItem {
  type: "image" | "video";
  src: string;
  videoSrc?: string;
  platform: string;
  author: string;
  text: string;
}

interface Props {
  item: FeedbackItem;
  onClose: () => void;
}

export default function FeedbackLightbox({ item, onClose }: Props) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-mist/60 hover:text-mist transition-colors text-sm font-body tracking-wide z-10"
        >
          ✕ Đóng
        </button>

        <div className="bg-void border border-velvet rounded-2xl overflow-hidden">
          {item.type === "video" && item.videoSrc ? (
            <video
              src={item.videoSrc}
              controls
              autoPlay
              className="w-full max-h-[75vh] object-contain"
              playsInline
            />
          ) : (
            <img
              src={item.src}
              alt={`Feedback from ${item.author}`}
              className="w-full max-h-[75vh] object-contain"
            />
          )}

          <div className="p-4 border-t border-velvet/60">
            <div className="flex items-center justify-between">
              <p className="font-body text-mist text-sm">{item.author}</p>
              <span className="font-body text-lilac/40 text-xs uppercase tracking-wider">
                {item.platform}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
