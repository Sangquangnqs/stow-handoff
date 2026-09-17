"use client";

import { useState, type ReactNode } from "react";
import {
  Building2,
  Check,
  Clock3,
  Copy,
  Loader2,
  PlayCircle,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import SmartBookingHandoffCard from "@/components/SmartBookingHandoffCard";
import {
  auditScenarios,
  ui,
  type AuditScenario,
  type Conversation,
  type Language,
  type LocalizedText,
  type Message,
} from "@/lib/stow-handoff-data";

export function AuditReplayPanel({
  activeConversationId,
  items,
  language,
  onOpenAudit,
  replaying,
}: {
  activeConversationId: string;
  items: Array<{
    id: string;
    title: LocalizedText;
    finding: string;
    messages: Message[];
  }>;
  language: Language;
  onOpenAudit: (id: string) => void;
  replaying: boolean;
}) {
  const t = ui[language];

  return (
    <section className="audit-replay-panel message-enter overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
      <div className="relative overflow-hidden border-b border-slate-100 px-5 py-4">
        <div className="audit-shimmer" />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#0077bc] ring-1 ring-sky-100">
              <Sparkles className="h-3.5 w-3.5" />
              {t.auditReplayTitle}
            </div>
            <h2 className="mt-3 text-lg font-extrabold text-slate-950">
              {language === "vi"
                ? "Phát lại các finding chính"
                : "Replay key findings"}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              {t.auditReplaySubtitle}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {items.map((item) => {
              const active = activeConversationId === item.id;
              return (
                <span
                  key={item.id}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    active
                      ? "w-8 bg-[#0077bc]"
                      : "w-2.5 bg-slate-200"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2">
        {items.map((item, index) => {
          const active = activeConversationId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onOpenAudit(item.id)}
              disabled={replaying && !active}
              style={{ animationDelay: `${index * 80}ms` }}
              className={`audit-replay-card group relative overflow-hidden rounded-2xl border p-4 text-left transition duration-300 ${
                active
                  ? "border-[#0077bc]/40 bg-sky-50 shadow-lg shadow-sky-100"
                  : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-[#0077bc]/30 hover:shadow-lg hover:shadow-slate-200/70"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-extrabold ${
                      active
                        ? "bg-[#0077bc] text-white"
                        : "bg-slate-100 text-[#0077bc]"
                    }`}
                  >
                    {item.finding}
                  </div>
                  <div className="mt-3 text-sm font-extrabold text-slate-950">
                    {item.title[language]}
                  </div>
                </div>
                <div
                  className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
                    active
                      ? "bg-[#0077bc] text-white"
                      : "bg-slate-50 text-slate-400 group-hover:bg-sky-50 group-hover:text-[#0077bc]"
                  }`}
                >
                  {active && replaying ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <PlayCircle className="h-5 w-5" />
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-500">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    active ? "animate-pulse bg-[#0077bc]" : "bg-slate-300"
                  }`}
                />
                {active && replaying ? t.typing : t.replayNow}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
export function Sidebar({
  activeConversationId,
  conversations,
  language,
  open,
  onClose,
  onNewChat,
  onOpenConversation,
}: {
  activeConversationId: string;
  conversations: Conversation[];
  language: Language;
  open: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onOpenConversation: (conversation: Conversation) => void;
}) {
  const t = ui[language];

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/20 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 w-82.5 border-r border-slate-200 bg-white shadow-2xl transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-18 items-center justify-between border-b border-slate-200 px-4">
          <div>
            <div className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#0077bc]">
              STOW
            </div>
            <div className="text-xs text-slate-500">{t.conversations}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeSidebar}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-4">
          <button
            type="button"
            onClick={onNewChat}
            className="flex w-full items-center gap-2 rounded-xl bg-[#0077bc] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0066a3]"
          >
            <Plus className="h-4 w-4" />
            {t.newChat}
          </button>

          <SidebarGroup title={t.recent}>
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <SidebarButton
                  key={conversation.id}
                  active={activeConversationId === conversation.id}
                  eyebrow={conversation.updatedAt}
                  icon={<Clock3 className="h-3.5 w-3.5" />}
                  label={conversation.title[language]}
                  onClick={() => onOpenConversation(conversation)}
                />
              ))
            ) : (
              <div className="rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-500">
                {language === "vi"
                  ? "Chưa có cuộc trò chuyện gần đây."
                  : "No recent conversations yet."}
              </div>
            )}
          </SidebarGroup>
        </div>
      </aside>
    </>
  );
}

function SidebarGroup({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div>
      <h2 className="px-2 text-xs font-bold uppercase tracking-wide text-slate-400">
        {title}
      </h2>
      <div className="mt-2 space-y-1">{children}</div>
    </div>
  );
}

function SidebarButton({
  active,
  eyebrow,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  eyebrow: string;
  icon?: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl px-3 py-2.5 text-left transition ${
        active ? "bg-sky-50 text-[#0077bc]" : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
        {icon}
        {eyebrow}
      </div>
      <div className="truncate text-sm font-semibold">{label}</div>
    </button>
  );
}

export function ChatMessage({
  labels,
  language,
  message,
}: {
  labels: {
    after: string;
    before: string;
    compare: string;
    fix: string;
    newOnly: string;
    oldOnly: string;
    switchHint: string;
  };
  language: Language;
  message: Message;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
      <div className="message-enter max-w-195 whitespace-pre-line rounded-2xl rounded-br-md bg-[#0077bc] px-5 py-3 text-base leading-7 text-white shadow-sm md:max-w-[76%]">
          {message.text[language]}
        </div>
      </div>
    );
  }

  const badge =
    message.tone === "before"
      ? labels.before
      : message.tone === "after" && message.showHandoffCard
        ? labels.after
        : message.tone === "after"
          ? labels.fix
          : null;

  return (
    <div className="flex justify-start">
      <div className="max-w-210 text-slate-800 md:max-w-[82%]">
        {badge ? (
          <div
            className={`mb-1 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
              message.tone === "before"
                ? "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
                : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
            }`}
          >
            {badge}
          </div>
        ) : null}
        {message.text[language].trim().length > 0 ? (
          <div className="message-enter py-1 text-base leading-7 text-slate-900">
            <BotFormattedText content={message.text[language]} />
          </div>
        ) : null}
        {message.auditScenarioId ? (
          <AuditComparisonPanel
            labels={labels}
            language={language}
            scenarioId={message.auditScenarioId}
          />
        ) : null}
        {message.showHandoffCard ? (
          <SmartBookingHandoffCard language={language} />
        ) : null}
      </div>
    </div>
  );
}

function BotFormattedText({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/).filter((block) => block.trim().length > 0);

  return (
    <div className="space-y-5">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n").filter((line) => line.trim().length > 0);

        if (lines.length > 1 && lines.every((line) => line.trim().match(/^[-•]?\s*[^:]+:/))) {
          return (
            <ul key={`${block}-${blockIndex}`} className="space-y-3 pl-7">
              {lines.map((line) => (
                <li
                  key={line}
                  className="list-disc pl-2 marker:text-slate-300"
                >
                  <InlineEmphasis text={line.replace(/^[-•]\s*/, "")} />
                </li>
              ))}
            </ul>
          );
        }

        return (
          <div key={`${block}-${blockIndex}`} className="space-y-3">
            {lines.map((line) => {
              const trimmed = line.trim();
              const headingMatch = trimmed.match(/^(\d+)\.\s+(.+)/);

              if (headingMatch) {
                return (
                  <h3
                    key={line}
                    className="pt-2 text-xl font-bold leading-7 text-slate-950"
                  >
                    {headingMatch[1]}. {headingMatch[2]}
                  </h3>
                );
              }

              if (trimmed.startsWith("👉")) {
                return (
                  <p key={line} className="font-medium text-slate-900">
                    <InlineEmphasis text={trimmed} />
                  </p>
                );
              }

              return (
                <p key={line} className="text-slate-900">
                  <InlineEmphasis text={trimmed} />
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function InlineEmphasis({ text: content }: { text: string }) {
  const colonIndex = content.indexOf(":");

  if (colonIndex > 0 && colonIndex < 44) {
    return (
      <>
        <strong>{content.slice(0, colonIndex + 1)}</strong>
        {content.slice(colonIndex + 1)}
      </>
    );
  }

  return <>{content}</>;
}

type AuditViewMode = "before" | "after";

function AuditComparisonPanel({
  labels,
  language,
  scenarioId,
}: {
  labels: {
    after: string;
    before: string;
    compare: string;
    fix: string;
    newOnly: string;
    oldOnly: string;
    switchHint: string;
  };
  language: Language;
  scenarioId: string;
}) {
  const [mode, setMode] = useState<AuditViewMode>("before");
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const scenario = auditScenarios.find((item) => item.id === scenarioId);

  if (!scenario) {
    return null;
  }

  const modes: Array<{ id: AuditViewMode; label: string }> = [
    { id: "before", label: labels.oldOnly },
    { id: "after", label: labels.newOnly },
  ];

  return (
    <>
      <section className="message-enter mt-3 w-full max-w-210 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/80">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-[#0077bc]">
              {scenario.finding}
            </div>
            <h3 className="mt-1 text-base font-bold text-slate-950">
              {scenario.title[language]}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex rounded-xl bg-slate-100 p-1">
              {modes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id)}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                    mode === item.id
                      ? "bg-white text-[#0077bc] shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIsCompareOpen(true)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#0077bc] shadow-sm transition hover:bg-sky-50"
            >
              {labels.compare}
            </button>
          </div>
        </div>

        {mode === "before" ? (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 text-sm font-semibold text-[#0077bc] ring-1 ring-sky-100">
            <span className="h-2 w-2 animate-ping rounded-full bg-[#0077bc]" />
            {labels.switchHint}
          </div>
        ) : null}

        <div className="mt-5">
          <AuditVersionCard
            label={mode === "before" ? labels.before : labels.after}
            language={language}
            scenario={mode === "after" ? scenario : undefined}
            text={
              mode === "before"
                ? scenario.before[language]
                : scenario.after[language]
            }
            tone={mode}
          />
        </div>

        <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900 ring-1 ring-emerald-100">
          <span className="font-bold">{labels.fix}: </span>
          {scenario.fix[language]}
        </div>
      </section>

      {isCompareOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${labels.compare}: ${scenario.title[language]}`}
        >
          <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-[#0077bc]">
                  {scenario.finding}
                </div>
                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  {labels.compare}: {scenario.title[language]}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCompareOpen(false)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close comparison"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-5 overflow-y-auto p-5 md:grid-cols-2 sm:p-6">
              <AuditVersionCard
                label={labels.before}
                tone="before"
                text={scenario.before[language]}
              />
              <AuditVersionCard
                label={labels.after}
                language={language}
                scenario={scenario}
                text={scenario.after[language]}
                tone="after"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function AuditVersionCard({
  label,
  language,
  scenario,
  text: content,
  tone,
}: {
  label: string;
  language?: Language;
  scenario?: AuditScenario;
  text: string;
  tone: "before" | "after";
}) {
  const isBefore = tone === "before";

  return (
    <div
      className={`rounded-2xl border p-5 ${
        isBefore
          ? "border-rose-100 bg-rose-50/60"
          : "border-emerald-100 bg-emerald-50/60"
      }`}
    >
      <div
        className={`mb-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
          isBefore ? "bg-white text-rose-700" : "bg-white text-emerald-700"
        }`}
      >
        {label}
      </div>
      <div className="pr-2 text-[15px] leading-7 text-slate-800">
        <BotFormattedText content={content} />
      </div>
      {!isBefore && scenario?.jsonPayload ? (
        <CopyableJsonBlock
          code={scenario.jsonPayload[language ?? "vi"]}
          language={language ?? "vi"}
        />
      ) : null}
      {!isBefore && scenario?.showHandoffCard ? (
        <SmartBookingHandoffCard language={language ?? "vi"} size="wide" />
      ) : null}
    </div>
  );
}

function CopyableJsonBlock({
  code,
  language,
}: {
  code: string;
  language: Language;
}) {
  const [copied, setCopied] = useState(false);
  const copyLabel = language === "vi" ? "Copy JSON" : "Copy JSON";
  const copiedLabel = language === "vi" ? "Đã copy" : "Copied";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-lg shadow-slate-200/60">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-300">
          JSON
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-8 items-center gap-2 rounded-lg bg-white/10 px-3 text-xs font-bold text-white transition hover:bg-white/15"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-300" />
              {copiedLabel}
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              {copyLabel}
            </>
          )}
        </button>
      </div>
      <pre className="max-h-130 overflow-auto p-4 text-[13px] leading-6 text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function TypingMessage({ label }: { label: string }) {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-md bg-slate-100 px-5 py-3 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-[#0077bc]" />
          {label}
          <span className="ml-1 flex items-center gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
          </span>
        </div>
      </div>
    </div>
  );
}

