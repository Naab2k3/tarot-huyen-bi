import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createBooking, getServices } from "../api/client";
import type { Booking, MeetingMethod, Service } from "../api/types";
import BookingForm from "../components/BookingForm";
import Calendar from "../components/Calendar";
import ConfirmationScreen from "../components/ConfirmationScreen";
import MoonStepper from "../components/MoonStepper";
import ServicePicker from "../components/ServicePicker";
import TimeSlots from "../components/TimeSlots";

const BRAND = {
  name: "Healing With My",
  tagline: "Có những điều chẳng biết tỏ cùng ai — ở đây, bạn được lắng nghe",
  story:
    "Nếu đêm nay lòng bạn nặng trĩu, hãy ngồi lại một chút. Mỗi lá bài ở đây không phải để phán xét bạn, mà để cùng bạn soi rõ điều trái tim thực sự muốn — rồi nhẹ nhàng bước tiếp.",
  years: "10+ năm kinh nghiệm",
  clients: "500+ khách hàng",
  values: [
    { icon: "🌙", title: "Nói thật", desc: "Không chung chung, không hù dọa — chỉ sự thật dịu dàng để bạn vững lòng." },
    { icon: "💜", title: "Lắng nghe", desc: "Cứ kể hết điều giữ trong lòng. Ở đây, bạn không bị đánh giá." },
    { icon: "✨", title: "Nhẹ lòng", desc: "Ra về với hướng đi rõ ràng, lòng bình yên hơn lúc đến." },
  ],
};

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getServices()
      .then((list) => {
        setServices(list);
        // Preselect khi đi từ trang Services (?service=<tên>)
        const wanted = searchParams.get("service")?.trim().toLowerCase();
        if (wanted) {
          const match = list.find(
            (s) => s.name.trim().toLowerCase() === wanted
          );
          if (match) {
            setSelectedService(match);
            setStep(1);
          }
        }
      })
      .catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(data: {
    meeting_method: MeetingMethod;
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    note?: string;
  }) {
    if (!selectedService || !selectedDate || !selectedTime) return;
    setLoading(true);
    setError("");
    try {
      const result = await createBooking({
        service_id: selectedService.id,
        date: selectedDate,
        time: selectedTime,
        ...data,
      });
      setBooking(result);
      setStep(3);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setStep(0);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setBooking(null);
    setError("");
  }

  // Đoán hình thức xem từ tên dịch vụ (vd "Xem Offline 1 tiếng")
  // để preselect đúng nút Online/Offline trong form.
  const guessedMethod: MeetingMethod = useMemo(() => {
    const name = selectedService?.name.toLowerCase() ?? "";
    if (name.includes("offline") || name.includes("trực tiếp") || name.includes("tại tiệm")) {
      return "offline";
    }
    return "online";
  }, [selectedService]);

  function selectService(svc: Service) {
    setSelectedService(svc);
    setSelectedDate(null);
    setSelectedTime(null);
    setError("");
    setTimeout(() => setStep(1), 300);
  }

  return (
    <main className="min-h-screen px-4 py-8 md:py-16">
      <div className="max-w-3xl mx-auto">
        {/* ── Header ── */}
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl md:text-5xl tracking-widest uppercase text-mist mb-2">
            {BRAND.name}
          </h1>
          <p className="font-body text-lilac italic text-lg mb-1">
            {BRAND.tagline}
          </p>
          <p className="font-body text-candle-gold/60 text-sm tracking-wide">
            ✦ Reader · Healer · Coaching ✦
          </p>
        </div>

        {/* ── Brand intro (only before booking starts) ── */}
        {step === 0 && !selectedService && (
          <section className="mb-6 md:mb-10 animate-fade-in">
            {/* Stats */}
            <div className="flex justify-center gap-6 mb-6 md:mb-8 text-center">
              <div>
                <p className="font-display text-2xl text-candle-gold">{BRAND.years.split("+")[0]}+</p>
                <p className="font-body text-lilac/60 text-sm tracking-wide">năm kinh nghiệm</p>
              </div>
              <div className="w-px bg-velvet" />
              <div>
                <p className="font-display text-2xl text-candle-gold">{BRAND.clients.split("+")[0]}+</p>
                <p className="font-body text-lilac/60 text-sm tracking-wide">khách hàng</p>
              </div>
            </div>

            {/* Story — desktop only; on mobile it pushes the picker
                below the fold. Full story lives on /about. */}
            <div className="hidden md:block max-w-xl mx-auto text-center mb-8">
              <p className="font-body text-lilac leading-relaxed italic">
                {BRAND.story}
              </p>
            </div>

            {/* Core values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-xl mx-auto mb-6 md:mb-8">
              {BRAND.values.map((v) => (
                <div
                  key={v.title}
                  className="bg-velvet/40 rounded-xl p-4 text-center border border-velvet/50"
                >
                  <span className="text-2xl block mb-2">{v.icon}</span>
                  <h3 className="font-display text-sm tracking-wider uppercase text-mist mb-1">
                    {v.title}
                  </h3>
                  <p className="font-body text-lilac/70 text-sm">{v.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="font-display text-xl tracking-wider uppercase text-mist text-center">
              Bạn đang mang điều gì trong lòng?
            </h2>
            <p className="font-body text-lilac/50 text-center text-sm italic mb-6">
              Chọn một trải bài — để bắt đầu gỡ rối từng chút một
            </p>
          </section>
        )}

        {/* ── Booking flow ── */}
        {step >= 0 && step < 3 && selectedService && (
          <MoonStepper current={step} />
        )}

        {/* Step 0: Select service */}
        {step === 0 && (
          <section>
            {error && !selectedService && (
              <p className="text-center font-body text-red-400 italic mb-4">{error}</p>
            )}
            <ServicePicker
              services={services}
              selectedId={selectedService?.id ?? null}
              onSelect={selectService}
            />
          </section>
        )}

        {/* Step 1: Date & Time */}
        {step === 1 && selectedService && (
          <section>
            <h2 className="font-display text-xl tracking-wider uppercase text-mist text-center mb-6">
              Chọn ngày & giờ
            </h2>
            <Calendar
              selected={selectedDate}
              onSelect={(d) => {
                setSelectedDate(d);
                setSelectedTime(null);
              }}
            />
            {selectedDate && (
              <div className="mt-6">
                <h3 className="font-display text-base tracking-wider uppercase text-lilac text-center mb-4">
                  Khung giờ trống
                </h3>
                <TimeSlots
                  serviceId={selectedService.id}
                  date={selectedDate}
                  selected={selectedTime}
                  onSelect={setSelectedTime}
                />
              </div>
            )}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setStep(0)}
                className="px-6 min-h-[44px] rounded-lg font-body text-lilac border border-velvet hover:border-lilac/30 active:scale-[0.98] transition-all"
              >
                Quay lại
              </button>
              <button
                disabled={!selectedTime}
                onClick={() => setStep(2)}
                className="px-6 min-h-[44px] rounded-xl font-display text-sm tracking-widest uppercase bg-arcane text-mist hover:bg-arcane/80 disabled:opacity-50 active:scale-[0.98] transition-all"
              >
                Tiếp theo
              </button>
            </div>
          </section>
        )}

        {/* Step 2: Customer info */}
        {step === 2 && (
          <section>
            <h2 className="font-display text-xl tracking-wider uppercase text-mist text-center mb-6">
              Thông tin của bạn
            </h2>
            {error && (
              <p className="text-center font-body text-red-400 italic mb-4">{error}</p>
            )}
            {selectedService && (
              <div className="max-w-md mx-auto mb-6 bg-velvet/40 border border-candle-gold/30 rounded-xl p-4">
                <p className="font-body text-candle-gold/70 text-xs tracking-widest uppercase mb-2">
                  Dịch vụ đã chọn
                </p>
                <div className="flex justify-between items-center gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-base tracking-wider uppercase text-mist">
                      {selectedService.name}
                    </h3>
                    <p className="font-body text-lilac/70 text-sm mt-0.5">
                      ⏱ {selectedService.duration_minutes} phút
                      {selectedDate && selectedTime
                        ? ` · ${selectedDate} lúc ${selectedTime}`
                        : ""}
                    </p>
                  </div>
                  <span className="font-display text-candle-gold font-semibold text-lg whitespace-nowrap shrink-0">
                    {selectedService.price.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <button
                  onClick={() => setStep(0)}
                  className="mt-2 font-body text-lilac/70 hover:text-candle-gold text-sm underline underline-offset-4 decoration-arcane/30 transition-all"
                >
                  Đổi dịch vụ
                </button>
              </div>
            )}
            <BookingForm
              key={selectedService?.id ?? "none"}
              initialMethod={guessedMethod}
              onSubmit={handleSubmit}
              loading={loading}
            />
            <div className="text-center mt-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 min-h-[44px] rounded-lg font-body text-lilac border border-velvet hover:border-lilac/30 active:scale-[0.98] transition-all"
              >
                Quay lại
              </button>
            </div>
          </section>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && booking && selectedService && (
          <>
            <ConfirmationScreen booking={booking} serviceName={selectedService.name} />
            <div className="text-center mt-6">
              <button
                onClick={handleReset}
                className="px-6 py-2 rounded-xl font-display text-sm tracking-widest uppercase bg-arcane/30 text-lilac hover:bg-arcane/50 hover:text-mist transition-all"
              >
                Đặt lịch mới
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
