import { useEffect, useState } from "react";
import { createBooking, getServices } from "../api/client";
import type { Booking, Service } from "../api/types";
import BookingForm from "../components/BookingForm";
import Calendar from "../components/Calendar";
import ConfirmationScreen from "../components/ConfirmationScreen";
import MoonStepper from "../components/MoonStepper";
import ServiceCard from "../components/ServiceCard";
import TimeSlots from "../components/TimeSlots";

const BRAND = {
  name: "Healing With My",
  tagline: "Kết nối con người với năng lượng vũ trụ",
  story:
    "Healing With My ra đời từ niềm đam mê sâu sắc với huyền học và mong muốn kết nối con người với năng lượng vũ trụ. Chúng tôi tin rằng mỗi người đều mang trong mình một hành trình độc đáo, và các lá bài chỉ là chiếc gương phản chiếu con đường đó.",
  years: "3+ năm kinh nghiệm",
  clients: "500+ khách hàng",
  values: [
    { icon: "🌙", title: "Chân thực", desc: "Đọc bài với trái tim thành thật, không phóng đại, không che giấu." },
    { icon: "💜", title: "Đồng cảm", desc: "Mỗi buổi xem là một cuộc trò chuyện. Chúng tôi lắng nghe và thấu hiểu." },
    { icon: "✨", title: "Trao quyền", desc: "Bài đọc giúp bạn tự tin hơn với lựa chọn của mình, không phụ thuộc." },
  ],
};

export default function BookingPage() {
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
      .then(setServices)
      .catch((e) => setError(e.message));
  }, []);

  async function handleSubmit(data: {
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
            ✦ Tarot · Tea Leaf · Huyền học ✦
          </p>
        </div>

        {/* ── Brand intro (only before booking starts) ── */}
        {step === 0 && !selectedService && (
          <section className="mb-10 animate-fade-in">
            {/* Stats */}
            <div className="flex justify-center gap-6 mb-8 text-center">
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

            {/* Story */}
            <div className="max-w-xl mx-auto text-center mb-8">
              <p className="font-body text-lilac leading-relaxed italic">
                {BRAND.story}
              </p>
            </div>

            {/* Core values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto mb-8">
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
              Chọn dịch vụ
            </h2>
            <p className="font-body text-lilac/50 text-center text-sm italic mb-6">
              Chọn một dịch vụ để bắt đầu hành trình của bạn
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
            <div className="grid gap-4 md:grid-cols-2">
              {services.map((svc) => (
                <ServiceCard
                  key={svc.id}
                  service={svc}
                  selected={selectedService?.id === svc.id}
                  onSelect={() => selectService(svc)}
                />
              ))}
            </div>
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
                className="px-6 py-2 rounded-lg font-body text-lilac border border-velvet hover:border-lilac/30 transition-all"
              >
                Quay lại
              </button>
              <button
                disabled={!selectedTime}
                onClick={() => setStep(2)}
                className="px-6 py-2 rounded-xl font-display text-sm tracking-widest uppercase bg-arcane text-mist hover:bg-arcane/80 disabled:opacity-50 transition-all"
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
            <BookingForm onSubmit={handleSubmit} loading={loading} />
            <div className="text-center mt-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 rounded-lg font-body text-lilac border border-velvet hover:border-lilac/30 transition-all"
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
