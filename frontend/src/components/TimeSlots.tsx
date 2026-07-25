import { useEffect, useState } from "react";
import { getAvailability } from "../api/client";

interface Props {
  serviceId: number;
  date: string;
  selected: string | null;
  onSelect: (time: string) => void;
}

export default function TimeSlots({ serviceId, date, selected, onSelect }: Props) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!serviceId || !date) return;
    setLoading(true);
    setError("");
    getAvailability(serviceId, date)
      .then((data) => setSlots(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [serviceId, date]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <span className="font-body text-lilac italic">Đang tải khung giờ...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <span className="font-body text-red-400 italic">{error}</span>
      </div>
    );
  }

  if (!date) {
    return (
      <div className="text-center py-8">
        <span className="font-body text-lilac/50 italic">Vui lòng chọn ngày trước</span>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="font-body text-lilac italic">Không còn khung giờ trống trong ngày này</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-w-sm mx-auto">
      {slots.map((t) => {
        const isSelected = selected === t;
        return (
          <button
            key={t}
            onClick={() => onSelect(t)}
            className={`
              py-2 px-3 rounded-lg font-body font-semibold text-sm tracking-wide transition-all
              ${isSelected
                ? "bg-arcane text-mist shadow-md shadow-arcane/30"
                : "bg-velvet/60 text-lilac border border-velvet hover:border-arcane/50 hover:text-mist"
              }
              focus-visible:outline-2 focus-visible:outline-candle-gold focus-visible:outline-offset-2
            `}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}
