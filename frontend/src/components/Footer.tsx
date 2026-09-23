import { Link } from "react-router-dom";

const SOCIALS = [
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@chemietarot_happy",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12.525.02q1.31-.002 2.622.01c.082 2.132 1.114 3.473 3.086 3.655v2.483a5.103 5.103 0 0 1-2.975.93c-.307-.005-.612-.026-.912-.05v5.19a6.446 6.446 0 1 1-5.53-6.318v2.52a3.93 3.93 0 0 0-.468-.047 3.92 3.92 0 1 0 4.156 3.978l.02-12.37Z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/hieumy.tarot",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073q0-5.018-3.55-8.568T12 .955 3.55 4.505 0 12.073q0 4.28 2.62 7.395t6.756 3.587v-5.23H6.76v-3.752h2.616V11.08q0-4.334 2.008-6.266t5.414-1.932q1.71 0 2.663.138v3.016h-1.52q-1.18 0-1.726.72t-.545 1.97v1.888h3.333l-.535 3.751h-2.798v5.23q4.136-.472 6.756-3.587T24 12.073Z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@healingwithmy",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/chemie_healing",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.982c2.175 0 2.433.007 3.289.048.793.037 1.222.167 1.507.277.38.147.65.325.934.61.286.285.464.555.61.934.11.286.24.715.277 1.508.04.856.048 1.114.048 3.289s-.007 2.433-.048 3.289c-.037.793-.167 1.222-.277 1.507a2.518 2.518 0 0 1-.61.934 2.518 2.518 0 0 1-.934.61c-.286.11-.715.24-1.508.277-.856.04-1.114.048-3.289.048s-2.433-.007-3.289-.048c-.793-.037-1.222-.167-1.507-.277a2.518 2.518 0 0 1-.934-.61 2.518 2.518 0 0 1-.61-.934c-.11-.286-.24-.715-.277-1.508-.04-.856-.048-1.114-.048-3.289s.007-2.433.048-3.289c.037-.793.167-1.222.277-1.507.147-.38.325-.65.61-.934.285-.286.555-.464.934-.61.286-.11.715-.24 1.508-.277.856-.04 1.114-.048 3.289-.048ZM12 0C9.755 0 9.466.01 8.597.052c-.865.04-1.454.176-1.97.377a3.98 3.98 0 0 0-1.438.935A3.98 3.98 0 0 0 3.67 3.67c-.2.516-.338 1.105-.377 1.97C3.01 5.466 3 5.755 3 8s.01 2.534.052 3.403c.04.865.176 1.454.377 1.97.2.517.476.98.934 1.438a3.98 3.98 0 0 0 1.438.935c.516.2 1.105.338 1.97.377.869.04 1.158.052 3.403.052s2.534-.01 3.403-.052c.865-.04 1.454-.176 1.97-.377a3.98 3.98 0 0 0 1.438-.935 3.98 3.98 0 0 0 .935-1.438c.2-.516.338-1.105.377-1.97.04-.869.052-1.158.052-3.403s-.01-2.534-.052-3.403c-.04-.865-.176-1.454-.377-1.97a3.98 3.98 0 0 0-.935-1.438 3.98 3.98 0 0 0-1.438-.935c-.516-.2-1.105-.338-1.97-.377C14.534 3.01 14.245 3 12 3Zm0 5.454a6.545 6.545 0 1 0 0 13.091 6.545 6.545 0 0 0 0-13.091ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.364-9.636a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      </svg>
    ),
  },
  {
    name: "Threads",
    href: "https://www.threads.com/@chemie_healing ",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12.242 2.038c-1.384-.036-3.868.384-6.158 2.166C3.914 5.86 2.654 8.469 2.616 12.06c-.04 3.616 1.065 6.428 3.03 8.37 1.96 1.94 4.74 3.098 8.096 3.099 3.346 0 6.302-1.078 8.466-3.126 2.142-2.026 3.19-4.828 3.116-8.014-.07-3.09-1.298-5.471-3.353-7.116-2.057-1.647-4.816-2.46-7.73-2.235Zm3.476 4.927c.511.61.688 1.455.688 2.575 0 .439-.34.816-.779.816-.439 0-.796-.377-.796-.816 0-.753-.107-1.244-.326-1.57-.22-.327-.584-.525-1.14-.598-.41-.054-.892-.028-1.39.102-.482.126-.943.328-1.308.582-.332.23-.455.44-.469.548-.01.081.047.13.07.146.13.098.373.19.826.28l1.204.233c1.459.283 2.481.705 3.164 1.34.67.622 1.012 1.474 1.036 2.592.024 1.144-.307 2.154-.97 2.917-.66.762-1.588 1.265-2.748 1.497-1.16.232-2.46.144-3.64-.41-1.11-.52-2.029-1.358-2.641-2.478-.604-1.105-.899-2.48-.81-4.04.087-1.517.516-2.836 1.242-3.871.73-1.041 1.73-1.793 2.948-2.226 1.43-.508 3.046-.515 4.318.133 1.29.657 2.173 1.851 2.464 3.478Zm-1.902 4.366c-.007-.356-.115-.666-.331-.898-.224-.24-.582-.401-1.057-.466-.92-.126-1.673.16-2.048.514a1.74 1.74 0 0 0-.376.478c-.156.298-.206.6-.152.798.04.148.156.22.244.262.166.08.43.128.797.124.94-.01 1.715-.22 2.207-.54.247-.161.454-.326.585-.472.111-.124.172-.199.173-.348v-.014c.01-.19.016-.296.016-.332l-.043.014c-.007.006.004.003.005-.003Z" />
      </svg>
    ),
  },
];

const SOCIALS_ORDER = ["TikTok", "Facebook", "YouTube", "Instagram", "Threads"];

export default function Footer() {
  const sorted = [...SOCIALS].sort(
    (a, b) => SOCIALS_ORDER.indexOf(a.name) - SOCIALS_ORDER.indexOf(b.name)
  );

  return (
    <footer className="border-t border-velvet/60 bg-void/80">
      {/* Main footer content */}
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand & description */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/logo-sm.png"
                alt="Healing With My"
                className="h-10 w-auto drop-shadow-[0_0_6px_rgba(212,168,67,0.25)]"
              />
              <div>
                <p className="font-logo text-mist tracking-wider text-lg leading-tight">Healing With My</p>
                <p className="font-body text-lilac/50 text-xs tracking-widest uppercase">Huyền học · Tâm linh · Kết nối</p>
              </div>
            </div>
            <p className="font-body text-lilac/60 text-sm leading-relaxed">
              Nơi năng lượng vũ trụ gặp gỡ tâm hồn bạn qua Tarot, Tea Leaf và những bí ẩn huyền học.
            </p>
          </div>

          {/* Company info */}
          <div>
            <h3 className="font-display text-mist text-sm tracking-widest uppercase mb-4">Lamy Entertainment</h3>
            <ul className="space-y-3">
              <li>
                <span className="font-body text-lilac/50 text-xs tracking-wider block">Địa chỉ</span>
                <span className="font-body text-lilac/80 text-sm">298 Lý Thường Kiệt, Phù Vân, Ninh Bình</span>
              </li>
              <li>
                <span className="font-body text-lilac/50 text-xs tracking-wider block">Mã số thuế</span>
                <span className="font-body text-lilac/80 text-sm">0700913728</span>
              </li>
              <li>
                <span className="font-body text-lilac/50 text-xs tracking-wider block">Điện thoại</span>
                <a href="tel:0339967899" className="font-body text-lilac/80 text-sm hover:text-arcane transition-colors">0339967899</a>
              </li>
              <li>
                <span className="font-body text-lilac/50 text-xs tracking-wider block">Email</span>
                <a href="mailto:LamyEntertainment@gmail.com" className="font-body text-lilac/80 text-sm hover:text-arcane transition-colors break-all">LamyEntertainment@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Social links */}
          <div>
            <h3 className="font-display text-mist text-sm tracking-widest uppercase mb-4">Kết nối với tôi</h3>
            <div className="flex flex-wrap gap-3">
              {sorted.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-10 h-10 rounded-lg bg-velvet/50 border border-velvet flex items-center justify-center text-lilac/70 hover:text-mist hover:border-arcane/40 hover:bg-velvet/80 transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <p className="font-body text-lilac/40 text-xs mt-4 leading-relaxed">
              Theo dõi Lamy Entertainment trên các nền tảng để cập nhật những thông tin mới nhất về huyền học và tâm linh.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-velvet/40">
        <div className="max-w-5xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-body text-lilac/40 text-xs">
            &copy; {new Date().getFullYear()} <span className="text-lilac/60">Lamy Entertainment</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="font-body text-lilac/40 text-xs hover:text-lilac/60 transition-colors">Giới thiệu</Link>
            <Link to="/services" className="font-body text-lilac/40 text-xs hover:text-lilac/60 transition-colors">Dịch vụ</Link>
            <Link to="/contact" className="font-body text-lilac/40 text-xs hover:text-lilac/60 transition-colors">Liên hệ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
