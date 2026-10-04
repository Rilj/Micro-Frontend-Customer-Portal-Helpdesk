import React, { useState } from "react";
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from "@mf-enterprise/ui-components";
import { TicketPriority } from "../types";

export const TicketForm: React.FC<{
  initialData?: Partial<{ subject: string; description: string; priority: TicketPriority }>;
  onSubmit?: (data: { subject: string; description: string; priority: TicketPriority }) => void;
  onCancel?: () => void;
}> = ({ initialData, onSubmit, onCancel }) => {
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [priority, setPriority] = useState<TicketPriority>(initialData?.priority || "MEDIUM");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;
    setIsSubmitting(true);
    try {
      onSubmit?.({ subject, description, priority });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of the issue"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the issue..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              rows={5}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TicketPriority)}
              className="border rounded-md px-3 py-2 text-sm w-full"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Submit Ticket"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
