import { Building2, CheckCircle2, ExternalLink } from "lucide-react";

type Language = "vi" | "en";

type SmartBookingHandoffCardProps = {
  language?: Language;
  size?: "compact" | "wide";
};

const bookingUrl =
  "/vi/book?step=quote&service=self-storage&size=5&facility=an-phu&name=N.+Q.+Sang&phone=0911***683&email=s***%40gmail.com";

const copy = {
  vi: {
    badge: "Xác nhận giữ chỗ tự động",
    service: "Kho tự quản 5m³ (Máy lạnh) • Chi nhánh An Phú",
    customerName: "Nguyễn Q. S.",
    firstMonth: "Tiền thuê tháng đầu",
    vat: "Thuế VAT (8%)",
    deposit: "Tiền đặt cọc (hoàn lại 100%)",
    total: "Tổng thanh toán",
    promo:
      "💡 Áp dụng chiết khấu 5% - 15% khi thanh toán từ 3 tháng trở lên",
    confirm: "Xác nhận & Giữ chỗ ngay",
  },
  en: {
    badge: "Automatic reservation confirmation",
    service: "5m³ self-storage (AC) • An Phu branch",
    customerName: "N. Q. Sang",
    firstMonth: "First-month rent",
    vat: "VAT (8%)",
    deposit: "Refundable deposit (100%)",
    total: "Total due today",
    promo:
      "💡 5% - 15% discount applies when paying for 3 months or more",
    confirm: "Confirm & Hold Now",
  },
} satisfies Record<Language, Record<string, string>>;

const paymentValues = {
  firstMonth: "1.796.000 đ",
  vat: "144.000 đ",
  deposit: "1.796.000 đ",
  total: "3.736.000 đ",
};

export default function SmartBookingHandoffCard({
  language = "vi",
  size = "compact",
}: SmartBookingHandoffCardProps) {
  const t = copy[language];

  const paymentItems = [
    { label: t.firstMonth, value: paymentValues.firstMonth },
    { label: t.vat, value: paymentValues.vat },
    { label: t.deposit, value: paymentValues.deposit },
  ];

  return (
    <article
      className={`message-enter mt-3 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/80 ${
        size === "wide" ? "max-w-140" : "max-w-105"
      }`}
    >
      <div className="border-b border-slate-100 px-4 py-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
          <CheckCircle2 className="h-4 w-4" />
          {t.badge}
        </div>

        <div className="mt-4 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0077bc] text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold leading-6 text-slate-950">
              {t.service}
            </h3>
            <p className="mt-1 text-sm leading-5 text-slate-600">
              {t.customerName}
            </p>
            <p className="text-sm leading-5 text-slate-500">
              0911***683 | s***@gmail.com
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4 py-4">
        <div className="rounded-xl border border-slate-200">
          {paymentItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-4 border-b border-slate-100 px-3 py-2.5 text-sm last:border-b-0"
            >
              <span className="text-slate-600">{item.label}</span>
              <span className="font-semibold text-slate-950">{item.value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 rounded-b-xl bg-emerald-50 px-3 py-3 text-sm ring-1 ring-inset ring-emerald-100">
            <span className="font-bold text-emerald-950">{t.total}</span>
            <span className="text-base font-extrabold text-emerald-700">
              {paymentValues.total}
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-amber-50 px-3 py-2.5 text-sm leading-5 text-amber-900 ring-1 ring-amber-100">
          {t.promo}
        </div>

        <a
          href={bookingUrl}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0077bc] px-3 text-sm font-bold text-white transition hover:bg-[#0066a3] focus:outline-none focus:ring-4 focus:ring-sky-100"
        >
          {t.confirm}
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
