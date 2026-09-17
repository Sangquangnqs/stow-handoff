"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  AudioLines,
  ArrowUp,
  Check,
  ChevronDown,
  FileText,
  Loader2,
  Menu,
  Mic,
  Plus,
  Send,
  X,
} from "lucide-react";
import {
  CONVERSATION_HISTORY_KEY,
  auditScenarios,
  createAuditMessages,
  createWelcomeMessages,
  detectPromptLanguage,
  getReplyForPrompt,
  quickPrompts,
  text,
  ui,
  type Conversation,
  type Language,
  type LocalizedText,
  type Message,
} from "@/lib/stow-handoff-data";
import {
  AuditReplayPanel,
  ChatMessage,
  Sidebar,
  TypingMessage,
} from "@/components/stow/StowChatParts";

type SpeechRecognitionEventLike = {
  results: ArrayLike<{ 0: { transcript: string } }>;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

export default function StowHandoffPrototype() {
  const [language, setLanguage] = useState<Language>("vi");
  const [messages, setMessages] = useState<Message[]>(createWelcomeMessages);
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState("new-chat");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const lastSubmittedRef = useRef("");
  const idCounterRef = useRef(0);
  const replayTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [isReplaying, setIsReplaying] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const t = ui[language];
  const showBackToReplay =
    activeConversationId.startsWith("audit-") && !isReplaying && messages.length > 0;

  const auditConversationItems = useMemo(
    () =>
      auditScenarios.map((scenario) => ({
        id: `audit-${scenario.id}`,
        title: scenario.title,
        finding: scenario.finding,
        messages: createAuditMessages(scenario),
      })),
    [],
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSubmitting]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(CONVERSATION_HISTORY_KEY);
        const parsed: unknown = raw ? JSON.parse(raw) : [];

        if (Array.isArray(parsed)) {
          setConversations(parsed.slice(0, 12) as Conversation[]);
        }
      } catch {
        setConversations([]);
      } finally {
        setHistoryLoaded(true);
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!historyLoaded) {
      return;
    }

    window.localStorage.setItem(
      CONVERSATION_HISTORY_KEY,
      JSON.stringify(conversations.slice(0, 12)),
    );
  }, [conversations, historyLoaded]);

  useEffect(() => {
    return () => {
      replayTimersRef.current.forEach((timer) => clearTimeout(timer));
      speechRecognitionRef.current?.stop();
    };
  }, []);

  function nextId(prefix: string) {
    idCounterRef.current += 1;
    return `${prefix}-${idCounterRef.current}`;
  }

  function clearReplayTimers() {
    replayTimersRef.current.forEach((timer) => clearTimeout(timer));
    replayTimersRef.current = [];
    setIsReplaying(false);
  }

  function startNewChat() {
    clearReplayTimers();
    setMessages(createWelcomeMessages());
    setInput("");
    setIsSubmitting(false);
    setActiveConversationId("new-chat");
    lastSubmittedRef.current = "";
    setAttachment(null);
    setVoiceError("");
  }

  function upsertConversation(conversation: Conversation) {
    setConversations((current) => {
      const withoutCurrent = current.filter((item) => item.id !== conversation.id);
      return [conversation, ...withoutCurrent].slice(0, 12);
    });
  }

  function persistConversation(nextMessages: Message[], title: LocalizedText) {
    const id =
      activeConversationId === "new-chat" || activeConversationId.startsWith("audit-")
        ? nextId("chat")
        : activeConversationId;

    setActiveConversationId(id);
    upsertConversation({
      id,
      title,
      updatedAt: "Now",
      messages: nextMessages,
      kind: "chat",
    });
  }

  function sendMessage(rawText: string) {
    const prompt = rawText.trim();

    if (!prompt || isSubmitting || isReplaying) {
      return;
    }

    clearReplayTimers();
    const normalized = prompt.toLowerCase().replace(/\s+/g, " ");
    if (normalized === lastSubmittedRef.current) {
      return;
    }

    lastSubmittedRef.current = normalized;
    const userMessage: Message = {
      id: nextId("user"),
      role: "user",
      text: text(prompt),
    };
    const optimisticMessages = [...messages, userMessage];

    setMessages(optimisticMessages);
    setInput("");
    setAttachment(null);
    setIsSubmitting(true);

    window.setTimeout(() => {
      const replyLanguage = detectPromptLanguage(prompt, language);
      const reply = getReplyForPrompt(prompt);
      const botMessage: Message = {
        id: nextId("bot"),
        role: "bot",
        text: text(reply.text[replyLanguage]),
        tone: "after",
        showHandoffCard: reply.showHandoffCard,
      };
      const finalMessages = [...optimisticMessages, botMessage];

      setMessages(finalMessages);
      persistConversation(finalMessages, text(prompt.slice(0, 44) || "New chat"));
      setIsSubmitting(false);

      window.setTimeout(() => {
        lastSubmittedRef.current = "";
      }, 400);
    }, 700);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const attachmentLabel = attachment
      ? `${language === "vi" ? "Tệp đính kèm" : "Attachment"}: ${attachment.name}`
      : "";
    sendMessage([input.trim(), attachmentLabel].filter(Boolean).join("\n"));
  }

  function startSpeechRecognition(autoSend: boolean) {
    if (isListening) {
      speechRecognitionRef.current?.stop();
      return;
    }

    const speechWindow = window as typeof window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setVoiceError(
        language === "vi"
          ? "Trình duyệt này chưa hỗ trợ nhập liệu bằng giọng nói."
          : "This browser does not support speech input.",
      );
      return;
    }

    const recognition = new Recognition();
    recognition.lang = language === "vi" ? "vi-VN" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim() ?? "";
      if (!transcript) return;

      if (autoSend) {
        sendMessage(transcript);
      } else {
        setInput((current) => [current.trim(), transcript].filter(Boolean).join(" "));
      }
    };
    recognition.onerror = () => {
      setVoiceError(
        language === "vi"
          ? "Không thể dùng microphone. Hãy kiểm tra quyền truy cập rồi thử lại."
          : "Microphone access failed. Check permission and try again.",
      );
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    speechRecognitionRef.current = recognition;
    setVoiceError("");
    setIsListening(true);
    recognition.start();
  }

  function openAuditScenario(scenarioId: string) {
    const scenario = auditScenarios.find((item) => `audit-${item.id}` === scenarioId);
    if (!scenario) {
      return;
    }

    clearReplayTimers();
    const replayMessages = createAuditMessages(scenario);

    setMessages([]);
    setActiveConversationId(scenarioId);
    upsertConversation({
      id: scenarioId,
      title: scenario.title,
      updatedAt: "Audit",
      messages: replayMessages,
      kind: "audit",
    });
    setInput("");
    setIsSubmitting(false);
    setSidebarOpen(false);
    setIsReplaying(true);

    const addTimer = (callback: () => void, delay: number) => {
      const timer = setTimeout(callback, delay);
      replayTimersRef.current.push(timer);
    };

    let elapsed = 420;
    addTimer(() => {
      setMessages([replayMessages[0]]);
    }, elapsed);

    elapsed += 1150;
    replayMessages.slice(1).forEach((message, index, list) => {
      if (message.role === "bot") {
        addTimer(() => {
          setIsSubmitting(true);
        }, elapsed);

        elapsed += message.auditScenarioId
          ? 1450
          : Math.min(1900, 1050 + message.text.vi.length * 2);
      } else {
        elapsed += 850;
      }

      addTimer(() => {
        setMessages((current) => [...current, message]);
        setIsSubmitting(false);
      }, elapsed);

      elapsed += message.auditScenarioId ? 1200 : 950;

      if (index === list.length - 1) {
        addTimer(() => {
          setIsReplaying(false);
          replayTimersRef.current = [];
        }, elapsed);
      }
    });
  }

  function openConversation(conversation: Conversation) {
    clearReplayTimers();
    setMessages(conversation.messages);
    setActiveConversationId(conversation.id);
    setInput("");
    setIsSubmitting(false);
    setSidebarOpen(false);
  }

  function scrollToAuditReplay() {
    chatScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      <header className="fixed inset-x-0 top-0 z-30 flex h-18 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label={t.openSidebar}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-[22px] font-extrabold uppercase tracking-[0.24em] text-[#0077bc]">
            STOW
          </div>
          <div className="-mt-1 text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
            by MyStorage
          </div>
        </div>

        <div className="relative flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLanguageMenuOpen((open) => !open)}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-[#0077bc]/30 hover:bg-slate-50"
          >
            <span className="text-base leading-none">
              {language === "vi" ? "🇻🇳" : "🇺🇸"}
            </span>
            <span>{language === "vi" ? "Tiếng Việt" : "English"}</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {languageMenuOpen ? (
            <div className="message-enter absolute right-0 top-13 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/80">
              {[
                { id: "vi" as const, flag: "🇻🇳", label: "Tiếng Việt" },
                { id: "en" as const, flag: "🇺🇸", label: "English" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setLanguage(item.id);
                    setLanguageMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                    language === item.id
                      ? "bg-sky-50 text-[#0077bc]"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-base">{item.flag}</span>
                  <span className="min-w-0 flex-1">{item.label}</span>
                  {language === item.id ? (
                    <Check className="h-4 w-4 text-[#0077bc]" />
                  ) : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <Sidebar
        activeConversationId={activeConversationId}
        conversations={conversations}
        language={language}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={() => {
          startNewChat();
          setSidebarOpen(false);
        }}
        onOpenConversation={openConversation}
      />

      <section className="flex h-screen flex-col pt-18">
        <div
          ref={chatScrollRef}
          className="flex-1 overflow-y-auto px-5 pb-36 pt-4 sm:px-8 lg:px-12"
        >
          <div className="mx-auto flex w-full max-w-225 flex-col gap-5">
            <AuditReplayPanel
              activeConversationId={activeConversationId}
              items={auditConversationItems}
              language={language}
              onOpenAudit={openAuditScenario}
              replaying={isReplaying}
            />
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                labels={{
                  after: t.after,
                  before: t.before,
                  compare: t.compare,
                  fix: t.fix,
                  newOnly: t.newOnly,
                  oldOnly: t.oldOnly,
                  switchHint: t.switchHint,
                }}
                language={language}
                message={message}
              />
            ))}
            {isSubmitting ? <TypingMessage label={t.typing} /> : null}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {showBackToReplay ? (
          <button
            type="button"
            onClick={scrollToAuditReplay}
            className="message-enter fixed bottom-37.5 right-4 z-30 inline-flex h-11 items-center gap-2 rounded-full border border-sky-100 bg-white px-4 text-sm font-bold text-[#0077bc] shadow-xl shadow-slate-200/80 transition hover:-translate-y-0.5 hover:bg-sky-50 sm:right-8"
          >
            <ArrowUp className="h-4 w-4" />
            <span className="hidden sm:inline">{t.backToReplay}</span>
          </button>
        ) : null}

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-100 bg-white/95 px-4 pb-3 pt-2 backdrop-blur">
          <div className="mx-auto w-full max-w-235">
            <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt.id}
                  type="button"
                  disabled={isSubmitting || isReplaying}
                  onClick={() => sendMessage(prompt.prompt[language])}
                  className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-[#0077bc]/30 hover:bg-sky-50 hover:text-[#0077bc] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {prompt.label[language]}
                </button>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-slate-200 bg-white px-4 py-2 shadow-lg shadow-slate-200/70"
            >
              <input
                ref={fileInputRef}
                type="file"
                className="sr-only"
                onChange={(event) => {
                  setAttachment(event.target.files?.[0] ?? null);
                  event.target.value = "";
                }}
              />
              {attachment ? (
                <div className="mt-1 flex w-fit max-w-full items-center gap-2 rounded-lg bg-sky-50 px-3 py-2 text-sm text-slate-700">
                  <FileText className="h-4 w-4 shrink-0 text-[#0077bc]" />
                  <span className="truncate">{attachment.name}</span>
                  <button
                    type="button"
                    onClick={() => setAttachment(null)}
                    aria-label={language === "vi" ? "Bỏ tệp đính kèm" : "Remove attachment"}
                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-white hover:text-slate-900"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : null}
              <div className="flex min-h-13 items-center gap-3">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  disabled={isSubmitting || isReplaying}
                  placeholder={t.placeholder}
                  className="min-w-0 flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  aria-label={t.addContent}
                  disabled={isSubmitting || isReplaying}
                  onClick={() => fileInputRef.current?.click()}
                  className="hidden h-9 w-9 items-center justify-center rounded-full text-[#0077bc] transition hover:bg-sky-50 sm:inline-flex"
                >
                  <Plus className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label={t.record}
                  aria-pressed={isListening}
                  disabled={isSubmitting || isReplaying}
                  onClick={() => startSpeechRecognition(false)}
                  className={`hidden h-9 w-9 items-center justify-center rounded-full transition sm:inline-flex ${
                    isListening
                      ? "animate-pulse bg-red-50 text-red-600"
                      : "text-[#0077bc] hover:bg-sky-50"
                  }`}
                >
                  <Mic className="h-5 w-5" />
                </button>
                <button
                  type={input.trim().length > 0 || attachment ? "submit" : "button"}
                  disabled={isSubmitting || isReplaying}
                  onClick={
                    input.trim().length === 0 && !attachment
                      ? () => startSpeechRecognition(true)
                      : undefined
                  }
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-full px-3 text-sm font-bold text-[#0077bc] transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:text-slate-300"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : input.trim().length > 0 ? (
                    <Send className="h-5 w-5" />
                  ) : attachment ? (
                    <Send className="h-5 w-5" />
                  ) : (
                    <>
                      <AudioLines className={`h-5 w-5 ${isListening ? "animate-pulse text-red-600" : ""}`} />
                      <span className="hidden sm:inline">{t.directVoice}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
            {voiceError ? (
              <p role="alert" className="mt-2 text-center text-xs font-medium text-red-600">
                {voiceError}
              </p>
            ) : null}
            <p className="mt-2 text-center text-xs text-slate-400">{t.disclaimer}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
