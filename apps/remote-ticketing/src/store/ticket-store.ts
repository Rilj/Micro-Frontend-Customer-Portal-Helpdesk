import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Ticket } from "../types";

interface TicketState {
  tickets: Ticket[];
  filters: Record<string, any>;
  selectedTicket: Ticket | null;
  isLoading: boolean;
  error: string | null;

  setTickets: (tickets: Ticket[]) => void;
  setFilters: (filters: Record<string, any>) => void;
  setSelectedTicket: (ticket: Ticket | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearFilters: () => void;
}

export const useTicketStore = create<TicketState>()(
  devtools(
    (set) => ({
      tickets: [],
      filters: {},
      selectedTicket: null,
      isLoading: false,
      error: null,

      setTickets: (tickets) => set({ tickets }),
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters }
        })),
      setSelectedTicket: (ticket) => set({ selectedTicket: ticket }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearFilters: () => set({ filters: {} })
    }),
    { name: "ticket-store" }
  )
);
