import React, { useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle, Badge, Button, Input, Avatar, AvatarFallback
} from "@mf-enterprise/ui-components";
import { useParams } from "react-router-dom";
import { useTicket, useTicketThreads, useAddThread } from "../hooks/use-tickets";
import { formatDistanceToNow } from "date-fns";
import { Send, Paperclip } from "lucide-react";

export const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [newMessage, setNewMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  const { data: ticket, isLoading: ticketLoading } = useTicket(id || "");
  const { data: threads = [], refetch } = useTicketThreads(id || "");
  const { mutate: addThread, isPending: isSending } = useAddThread(id || "");

  const handleSend = () => {
    if (!newMessage.trim()) return;

    let attachmentUrl: string | undefined;
    if (attachment) {
      attachmentUrl = URL.createObjectURL(attachment);
    }

    addThread({
      message: newMessage,
      attachments: attachmentUrl ? [attachmentUrl] : undefined
    });
    setNewMessage("");
    setAttachment(null);
    refetch();
  };

  if (ticketLoading || !ticket) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading ticket...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{ticket.subject}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{ticket.status}</Badge>
              <Badge variant="outline">{ticket.priority}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
          </p>
          <p className="text-sm">{ticket.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
            {threads.map((thread) => (
              <div key={thread.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{thread.senderId.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">{thread.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-end gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={(e) => setAttachment(e.target.files?.[0] || null)}
              />
              <Paperclip className="h-4 w-4 text-muted-foreground" />
            </label>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend} disabled={isSending || !newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketDetail;
