import { useMemo, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Textarea,
} from "@deftai/deft-components";
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
    return (
      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">Loading chat…</CardContent>
      </Card>
    );
  }
  if (uiState === "error") {
    return (
      <Alert variant="destructive">
        <AlertTitle>Chat unavailable</AlertTitle>
        <AlertDescription>Chat is currently unavailable.</AlertDescription>
      </Alert>
    );
  }

  return (
    <section aria-label="Chat pane" className="h-full">
      <Card className="flex h-full flex-col overflow-hidden" aria-label="Unified chat panel">
        <header className="border-b border-border bg-accent/5 p-2.5 md:p-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Chat</p>
              <div className="mt-1.5 flex items-center gap-1.5">
                {visibleParticipants.map((participant) => (
                  <Badge
                    key={participant.id}
                    variant="outline"
                    className="h-9 w-9 justify-center rounded-full p-0 text-xs"
                    title={participant.name}
                  >
                    {participant.avatarInitials}
                  </Badge>
                ))}
                {overflowCount > 0 ? <Badge variant="outline">+{overflowCount}</Badge> : null}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-card px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/20 hover:text-foreground">
                  Participants
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>All participants</DropdownMenuLabel>
                  {participants.map((participant) => (
                    <DropdownMenuItem key={participant.id} disabled>
                      {participant.name} · {participant.role}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setInviteNotice("Invite action captured (mock).")}
              >
                Invite
              </Button>
            </div>
          </div>
          {inviteNotice ? <p className="mt-2 text-xs text-muted-foreground">{inviteNotice}</p> : null}
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-2.5 md:p-3">
          {uiState === "empty" ? (
            <p className="text-sm text-muted-foreground">No messages yet. Start the discussion below.</p>
          ) : (
            <div className="space-y-2">
              {messages.map((msg) => {
                const author = participantById.get(msg.authorId);
                const isCurrentUser = msg.authorId === currentUserId;
                return (
                  <article
                    key={msg.id}
                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-xl border p-2 text-sm md:max-w-[80%] ${
                        isCurrentUser
                          ? "border-accent/40 bg-accent/10 text-foreground"
                          : "border-border bg-card text-foreground"
                      }`}
                    >
                      <p className="text-xs font-semibold text-muted-foreground">
                        {author?.name ?? "Unknown"}
                      </p>
                      <p>{msg.body}</p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                        <button
                          type="button"
                          className="text-[11px] font-semibold text-accent"
                          onClick={() => setReplyParentId(msg.id)}
                        >
                          Reply
                        </button>
                      </div>
                      {msg.parentId ? (
                        <p className="mt-1 text-[11px] text-muted-foreground">Thread reply</p>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <footer className="border-t border-border bg-accent/5 p-2.5 md:p-3">
          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <Textarea
                className="min-h-20"
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
              <Button
                type="button"
                size="icon"
                className="h-11 w-11 rounded-full"
                onClick={handleSendMessage}
                disabled={message.trim().length === 0}
                aria-label="Send message"
                title="Send message"
              >
                <MessageIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-full"
                onClick={onOpenVoteModal}
                aria-label="Propose vote"
                title="Propose vote"
              >
                <ChartIcon className="h-4 w-4 text-accent" />
              </Button>
            </div>
          </div>
          {replyParentId ? (
            <Badge variant="outline" className="mt-2">
              Replying in thread
            </Badge>
          ) : null}
        </footer>
      </Card>
    </section>
  );
}
