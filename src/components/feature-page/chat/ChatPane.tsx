import { useMemo, useState } from "react";
import { ChartIcon, MessageIcon } from "@/components/landing/icons";
import type { ChatMessage, FeaturePageUiState, FeatureParticipant } from "@/mocks/feature-page";

type ChatPaneProps = {
  messages: ChatMessage[];
  participants: FeatureParticipant[];
  currentUserId: string;
  uiState: FeaturePageUiState;
  onSendMessage: (body: string, parentId?: string) => void;
  onOpenVoteModal: () => void;
};

export function ChatPane({
  messages,
  participants,
  currentUserId,
  uiState,
  onSendMessage,
  onOpenVoteModal,
}: ChatPaneProps) {
  const [message, setMessage] = useState("");
  const [replyParentId, setReplyParentId] = useState<string | undefined>(undefined);
  const [inviteNotice, setInviteNotice] = useState<string | null>(null);

  const participantById = useMemo(
    () => new Map(participants.map((participant) => [participant.id, participant])),
    [participants],
  );
  const visibleParticipants = participants.slice(0, 3);
  const overflowCount = Math.max(0, participants.length - visibleParticipants.length);
  const handleSendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) {
      return;
    }
    onSendMessage(trimmed, replyParentId);
    setMessage("");
    setReplyParentId(undefined);
  };

  if (uiState === "loading") {
    return <section className="surface-card p-4 text-sm text-muted">Loading chat…</section>;
  }
  if (uiState === "error") {
    return (
      <section className="surface-card border-danger/40 bg-danger/10 p-4 text-sm text-danger">
        Chat is currently unavailable.
      </section>
    );
  }

  return (
    <section aria-label="Chat pane" className="h-full">
      <article className="surface-card flex h-full flex-col overflow-hidden" aria-label="Unified chat panel">
        <header className="border-b border-[color:var(--color-surface-edge)] bg-primary/5 p-2.5 md:p-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted">Chat</p>
              <div className="mt-1.5 flex items-center gap-1.5">
                {visibleParticipants.map((participant) => (
                  <span
                    key={participant.id}
                    className="dashboard-chip h-9 w-9 justify-center rounded-full p-0 text-xs"
                    title={participant.name}
                  >
                    {participant.avatarInitials}
                  </span>
                ))}
                {overflowCount > 0 ? <span className="dashboard-chip">+{overflowCount}</span> : null}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <details>
                <summary className="dashboard-nav-link cursor-pointer px-2.5 py-1.5 text-xs">Participants</summary>
                <ul className="surface-card mt-2 space-y-1 p-2 text-sm">
                  {participants.map((participant) => (
                    <li key={participant.id}>
                      {participant.name} · {participant.role}
                    </li>
                  ))}
                </ul>
              </details>
              <button
                type="button"
                className="dashboard-nav-link px-2.5 py-1.5 text-xs"
                onClick={() => setInviteNotice("Invite action captured (mock).")}
              >
                Invite
              </button>
            </div>
          </div>
          {inviteNotice ? <p className="mt-2 text-xs text-muted">{inviteNotice}</p> : null}
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-2.5 md:p-3">
          {uiState === "empty" ? (
            <p className="text-sm text-muted">No messages yet. Start the discussion below.</p>
          ) : (
            <div className="space-y-2">
              {messages.map((msg) => {
                const author = participantById.get(msg.authorId);
                const isCurrentUser = msg.authorId === currentUserId;
                return (
                  <article key={msg.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[90%] rounded-xl border p-2 text-sm md:max-w-[80%] ${
                        isCurrentUser
                          ? "border-primary/40 bg-primary/10 text-text"
                          : "border-[color:var(--color-surface-edge)] bg-[color:var(--color-surface)] text-text"
                      }`}
                    >
                      <p className="text-xs font-semibold text-muted">{author?.name ?? "Unknown"}</p>
                      <p>{msg.body}</p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-muted">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                        <button
                          type="button"
                          className="text-[11px] font-semibold text-primary"
                          onClick={() => setReplyParentId(msg.id)}
                        >
                          Reply
                        </button>
                      </div>
                      {msg.parentId ? <p className="mt-1 text-[11px] text-muted">Thread reply</p> : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <footer className="border-t border-[color:var(--color-surface-edge)] bg-primary/5 p-2.5 md:p-3">
          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <textarea
                className="dashboard-control min-h-20 border-primary/25 bg-primary/[0.08] text-sm"
                value={message}
                aria-label="Message"
                placeholder="Write a message…"
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
            </div>
            <div className="mb-0.5 flex shrink-0 items-center gap-2">
              <button
                type="button"
                className="gradient-button inline-flex h-11 w-11 items-center justify-center rounded-full text-white disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleSendMessage}
                disabled={message.trim().length === 0}
                aria-label="Send message"
                title="Send message"
              >
                <MessageIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="dashboard-nav-link inline-flex h-11 w-11 min-h-0 items-center justify-center rounded-full p-0"
                onClick={onOpenVoteModal}
                aria-label="Propose vote"
                title="Propose vote"
              >
                <ChartIcon className="h-4 w-4 text-primary" />
              </button>
            </div>
          </div>
          {replyParentId ? <span className="dashboard-chip mt-2 inline-flex">Replying in thread</span> : null}
        </footer>
      </article>
    </section>
  );
}
