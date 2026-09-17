import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

type BookingSearchParams = Promise<{
  step?: string;
  service?: string;
  size?: string;
  facility?: string;
  name?: string;
  phone?: string;
  email?: string;
}>;

const realBookingUrl = "https://booking.mystorage.vn/en/book?step=service";

const serviceLabels: Record<string, string> = {
  "self-storage": "Kho tự quản",
};

const facilityLabels: Record<string, string> = {
  "an-phu": "Chi nhánh An Phú",
};

function readParam(value: string | undefined, fallback: string) {
  return value && value.trim().length > 0 ? value : fallback;
}

export default async function BookingPage({
  searchParams,
}: {
  searchParams: BookingSearchParams;
}) {
  const params = await searchParams;

  const service = readParam(params.service, "self-storage");
  const size = readParam(params.size, "5");
  const facility = readParam(params.facility, "an-phu");
  const name = readParam(params.name, "N. Q. Sang").replace(/\+/g, " ");
  const phone = readParam(params.phone, "0911***683");
  const email = readParam(params.email, "s***@gmail.com");
  const hasHandoffState = Boolean(
    params.step || params.service || params.size || params.facility || params.name,
  );

  const steps = [
    "Dịch vụ",
    "Kích thước",
    "Thông tin",
    "Thanh toán",
    "Xác nhận",
  ];

  return (
    <main className="min-h-screen bg-[#f5f8fb] text-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-19 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
              aria-label="Quay lại STOW"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="text-xl font-black leading-none tracking-wide text-[#0077bc]">
                MY STORAGE
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0077bc]">
                Space up your life
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 lg:flex">
            <span>Trang Chủ</span>
            <span>Kho Tự Quản</span>
            <span>Kho Lưu Trữ Trọn Gói</span>
            <span>Liên Hệ Trực Tiếp</span>
          </nav>

          <a
            href={realBookingUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0077bc] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#0066a3]"
          >
            Booking thật
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
          <span className="font-bold">Trang mô phỏng booking cho prototype.</span>{" "}
          Booking thật của MyStorage nằm tại{" "}
          <a
            href={realBookingUrl}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-[#0077bc] underline underline-offset-2"
          >
            {realBookingUrl}
          </a>
          . Trang này chỉ chứng minh booking flow có thể nhận dữ liệu handoff từ STOW.
        </div>

        <div className="mt-6 rounded-2xl bg-linear-to-r from-[#38206c] to-[#7b2f91] px-5 py-3 text-center text-sm font-extrabold text-yellow-200 shadow-md">
          Tết Trung Thu - Giảm 16% tủ khóa thông minh · 07/09 - 27/09
        </div>

        <div className="mt-7 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-[#0077bc]">
                Bước 5 trên 5
              </div>
              <h1 className="mt-2 text-2xl font-black text-slate-950">
                Xác nhận giữ chỗ
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Các trường bên dưới đã được hydrate từ query params do STOW
                handoff tạo ra, nên khách không phải nhập lại từ đầu.
              </p>
            </div>

            {hasHandoffState ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700 ring-1 ring-emerald-100">
                <CheckCircle2 className="h-4 w-4" />
                Đã nhận dữ liệu từ STOW
              </div>
            ) : null}
          </div>

          <div className="mt-5">
            <div className="grid gap-2 sm:grid-cols-5">
              {steps.map((step) => (
                <div key={step} className="flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0077bc] text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-xs font-bold text-slate-700">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="text-base font-black text-slate-950">
                Thông tin đã điền sẵn
              </h2>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <PrefilledField
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label="Dịch vụ"
                  value={`${serviceLabels[service] ?? service} ${size}m³ (Máy lạnh)`}
                />
                <PrefilledField
                  icon={<MapPin className="h-4 w-4" />}
                  label="Địa điểm"
                  value={facilityLabels[facility] ?? facility}
                />
                <PrefilledField
                  icon={<User className="h-4 w-4" />}
                  label="Khách hàng"
                  value={name}
                />
                <PrefilledField
                  icon={<Phone className="h-4 w-4" />}
                  label="Liên hệ"
                  value={`${phone} · ${email}`}
                />
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-bold text-slate-950">
                  Handoff state
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Prototype này đọc trực tiếp `service`, `size`, `facility`,
                  `name`, `phone`, `email` từ URL. Production có thể thay query
                  params bằng signed handoff token để an toàn hơn.
                </p>
              </div>
            </section>

            <aside className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0077bc] text-white">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-black">Thanh toán đợt đầu</h2>
                  <p className="text-sm text-slate-500">Kho tự quản An Phú</p>
                </div>
              </div>

              <div className="mt-5 divide-y divide-slate-100 rounded-2xl border border-slate-200">
                <SummaryLine label="Tiền thuê tháng đầu" value="1.796.000 đ" />
                <SummaryLine label="Thuế VAT (8%)" value="144.000 đ" />
                <SummaryLine label="Tiền đặt cọc" value="1.796.000 đ" />
                <div className="flex items-center justify-between rounded-b-2xl bg-emerald-50 px-4 py-4">
                  <span className="font-black text-emerald-950">Tổng cộng</span>
                  <span className="text-lg font-black text-emerald-700">
                    3.736.000 đ
                  </span>
                </div>
              </div>

              <button className="mt-5 w-full rounded-2xl bg-[#0077bc] px-5 py-3 text-base font-black text-white shadow-lg shadow-sky-200 transition hover:bg-[#0066a3]">
                Xác nhận mô phỏng
              </button>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function PrefilledField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#0077bc]">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-sm font-bold leading-6 text-slate-950">
        {value}
      </div>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-bold text-slate-950">{value}</span>
    </div>
  );
}
