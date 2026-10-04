import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketApi, TicketFilters } from "../services/ticket-api";
import { Ticket } from "../types";
import { useTicketStore } from "../store/ticket-store";
import { eventBus } from "@mf-enterprise/event-bus";
import { useEffect } from "react";

export const useTickets = (filters: TicketFilters = {}) => {
  const { setTickets, setLoading, setError } = useTicketStore();

  const query = useQuery({
    queryKey: ["tickets", filters],
    queryFn: () => ticketApi.getAll(filters),
    staleTime: 30000
  });

  useEffect(() => {
    if (query.data) {
      setTickets(query.data.tickets);
      setLoading(false);
    }
    if (query.isError) {
      setError(query.error?.message || "Failed to load tickets");
      setLoading(false);
    }
  }, [query.data, query.isError, query.isLoading, setTickets, setLoading, setError]);

  return query;
};

export const useTicket = (id: string) => {
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: () => ticketApi.getById(id),
    enabled: !!id
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ticketApi.create,
    onSuccess: (ticket: Ticket) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      eventBus.emit("ticket:created", { ticket });
    }
  });
};

interface UpdateTicketMutationArgs {
  id: string;
  data: Record<string, unknown>;
}

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateTicketMutationArgs) =>
      ticketApi.update(id, data as any),
    onSuccess: (ticket: Ticket) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticket", ticket.id] });
      eventBus.emit("ticket:updated", { ticket });
    }
  });
};

export const useDeleteTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ticketApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    }
  });
};

export const useTicketThreads = (ticketId: string) => {
  return useQuery({
    queryKey: ["ticket-threads", ticketId],
    queryFn: () => ticketApi.getThreads(ticketId),
    enabled: !!ticketId
  });
};

export const useAddThread = (ticketId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ message, attachments }: { message: string; attachments?: string[] }) =>
      ticketApi.addThread(ticketId, message, attachments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket-threads", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
    }
  });
};
