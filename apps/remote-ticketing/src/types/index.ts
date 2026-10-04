export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Ticket {
  id: string;
  customerId: string;
  assignedAgentId?: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
}

export interface TicketThread {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: "customer" | "agent" | "system";
  message: string;
  attachments?: string[];
  createdAt: string;
}
