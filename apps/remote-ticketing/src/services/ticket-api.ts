import api from "./api";
import { Ticket, TicketStatus, TicketPriority } from "../types";

export interface TicketThread {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: "customer" | "agent" | "system";
  message: string;
  attachments?: string[];
  createdAt: string;
}

export interface CreateTicketRequest {
  subject: string;
  description: string;
  priority: TicketPriority;
  attachments?: string[];
}

export interface UpdateTicketRequest {
  subject?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedAgentId?: string;
}

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  sortBy?: "created_at" | "updated_at";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
  search?: string;
}

export const ticketApi = {
  async getAll(filters: TicketFilters = {}): Promise<{ tickets: Ticket[]; total: number }> {
    const response = await api.get<{ tickets: Ticket[]; total: number }>("/tickets", {
      params: filters
    });
    return response.data;
  },

  async getById(id: string): Promise<Ticket> {
    const response = await api.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },

  async create(data: CreateTicketRequest): Promise<Ticket> {
    const response = await api.post<Ticket>("/tickets", data);
    return response.data;
  },

  async update(id: string, data: UpdateTicketRequest): Promise<Ticket> {
    const response = await api.put<Ticket>(`/tickets/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/tickets/${id}`);
  },

  async getThreads(ticketId: string): Promise<TicketThread[]> {
    const response = await api.get<TicketThread[]>(`/tickets/${ticketId}/threads`);
    return response.data;
  },

  async addThread(ticketId: string, message: string, attachments?: string[]): Promise<TicketThread> {
    const response = await api.post<TicketThread>(`/tickets/${ticketId}/threads`, {
      message,
      attachments
    });
    return response.data;
  }
};
