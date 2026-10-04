import { describe, it, expect } from "vitest";
import { useTicketStore } from "./ticket-store";

describe("ticket store", () => {
  it("should initialize with empty state", () => {
    const state = useTicketStore.getState();

    expect(state.tickets).toEqual([]);
    expect(state.filters).toEqual({});
    expect(state.selectedTicket).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it("should set tickets", () => {
    const state = useTicketStore.getState();

    state.setTickets([{
      id: "1",
      customerId: "user-1",
      subject: "Test Ticket",
      description: "Test Description",
      status: "OPEN",
      priority: "MEDIUM",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }]);

    expect(useTicketStore.getState().tickets).toHaveLength(1);
    expect(useTicketStore.getState().tickets[0].subject).toBe("Test Ticket");
  });

  it("should set filters", () => {
    const state = useTicketStore.getState();
    state.setFilters({ status: "OPEN" });

    expect(useTicketStore.getState().filters.status).toBe("OPEN");
  });

  it("should clear filters", () => {
    const state = useTicketStore.getState();
    state.setFilters({ status: "OPEN" });
    state.clearFilters();

    expect(useTicketStore.getState().filters).toEqual({});
  });
});
