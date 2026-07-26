import SparkleButton from "../components/SparkleButton";

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="font-body text-candle-gold text-sm tracking-widest uppercase mb-2">
            ✦ Liên hệ ✦
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-mist mb-4">Liên hệ với tôi</h1>
          <p className="font-body text-lilac italic">
            Bạn có câu hỏi? Tôi luôn sẵn sàng lắng nghe.
          </p>
        </div>

        <div className="bg-velvet/40 border border-velvet rounded-xl p-6 md:p-8 mb-8">
          <div className="space-y-6">
            {/* Zalo */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-arcane/20 flex items-center justify-center shrink-0">
                <span className="text-arcane font-display text-sm">Z</span>
              </div>
              <div>
                <h3 className="font-display text-sm tracking-wider uppercase text-mist mb-0.5">Zalo</h3>
                <p className="font-body text-lilac text-sm">Liên hệ qua Zalo để được tư vấn nhanh nhất</p>
              </div>
            </div>

            {/* Messenger */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-arcane/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-arcane" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-sm tracking-wider uppercase text-mist mb-0.5">Messenger</h3>
                <p className="font-body text-lilac text-sm">Nhắn tin qua Facebook Messenger</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-arcane/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-arcane" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-sm tracking-wider uppercase text-mist mb-0.5">Điện thoại / Zalo</h3>
                <p className="font-body text-lilac text-sm">Gọi hoặc nhắn tin trực tiếp để đặt lịch nhanh</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="bg-velvet/40 border border-velvet rounded-xl p-6 md:p-8">
          <h2 className="font-display text-lg tracking-wider uppercase text-mist text-center mb-6">
            Gửi tin nhắn cho tôi
          </h2>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-4"
          >
            <div>
              <label className="block font-body text-lilac text-sm mb-1">Họ và tên <span className="text-candle-gold">*</span></label>
              <input
                type="text"
                required
                className="w-full bg-void border border-velvet rounded-lg px-4 py-2.5 font-body text-mist placeholder-lilac/40 focus:outline-none focus:border-arcane transition-colors"
                placeholder="Tên của bạn"
              />
            </div>
            <div>
              <label className="block font-body text-lilac text-sm mb-1">Email <span className="text-candle-gold">*</span></label>
              <input
                type="email"
                required
                className="w-full bg-void border border-velvet rounded-lg px-4 py-2.5 font-body text-mist placeholder-lilac/40 focus:outline-none focus:border-arcane transition-colors"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block font-body text-lilac text-sm mb-1">Số điện thoại</label>
              <input
                type="tel"
                className="w-full bg-void border border-velvet rounded-lg px-4 py-2.5 font-body text-mist placeholder-lilac/40 focus:outline-none focus:border-arcane transition-colors"
                placeholder="0912 345 678"
              />
            </div>
            <div>
              <label className="block font-body text-lilac text-sm mb-1">Tin nhắn <span className="text-candle-gold">*</span></label>
              <textarea
                required
                rows={4}
                className="w-full bg-void border border-velvet rounded-lg px-4 py-2.5 font-body text-mist placeholder-lilac/40 focus:outline-none focus:border-arcane transition-colors resize-none"
                placeholder="Nội dung tin nhắn..."
              />
            </div>
            <SparkleButton
              type="submit"
              className="w-full py-3 rounded-xl font-display text-sm tracking-widest uppercase bg-arcane text-mist hover:bg-arcane/80 transition-all btn-glow"
            >
              Gửi tin nhắn
            </SparkleButton>
          </form>
        </div>
      </div>
    </main>
  );
}
