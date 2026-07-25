import { type FormEvent, useState } from "react";

interface Props {
  onSubmit: (data: {
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    note?: string;
  }) => void;
  loading: boolean;
}

export default function BookingForm({ onSubmit, loading }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      customer_name: name,
      customer_phone: phone,
      customer_email: email || undefined,
      note: note || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-5">
      <div>
        <label className="block font-body text-lilac text-sm tracking-wide mb-1">
          Tên của bạn <span className="text-candle-gold">*</span>
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-velvet/60 border border-velvet rounded-lg px-4 py-2.5 font-body text-mist placeholder-lilac/40 focus:outline-none focus:border-arcane transition-colors"
          placeholder="Nhập tên của bạn"
        />
      </div>

      <div>
        <label className="block font-body text-lilac text-sm tracking-wide mb-1">
          Số điện thoại <span className="text-candle-gold">*</span>
        </label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-velvet/60 border border-velvet rounded-lg px-4 py-2.5 font-body text-mist placeholder-lilac/40 focus:outline-none focus:border-arcane transition-colors"
          placeholder="0912 345 678"
        />
      </div>

      <div>
        <label className="block font-body text-lilac text-sm tracking-wide mb-1">
          Email <span className="text-lilac/50">(không bắt buộc)</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-velvet/60 border border-velvet rounded-lg px-4 py-2.5 font-body text-mist placeholder-lilac/40 focus:outline-none focus:border-arcane transition-colors"
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label className="block font-body text-lilac text-sm tracking-wide mb-1">
          Ghi chú <span className="text-lilac/50">(không bắt buộc)</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full bg-velvet/60 border border-velvet rounded-lg px-4 py-2.5 font-body text-mist placeholder-lilac/40 focus:outline-none focus:border-arcane transition-colors resize-none"
          placeholder="Chia sẻ thêm điều bạn muốn Tarot Reader biết..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl font-display text-sm tracking-widest uppercase bg-arcane text-mist hover:bg-arcane/80 disabled:opacity-50 transition-all focus-visible:outline-2 focus-visible:outline-candle-gold focus-visible:outline-offset-2"
      >
        {loading ? "Đang xử lý..." : "Xác nhận đặt lịch"}
      </button>
    </form>
  );
}
