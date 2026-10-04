import React, { useState } from "react";
import { Button, Input, Card, CardContent, Badge } from "@mf-enterprise/ui-components";
import { Search, Plus } from "lucide-react";
  import { useTickets } from "../hooks/use-tickets";
  import { useTicketStore } from "../store/ticket-store";
  import { Ticket, TicketStatus, TicketPriority } from "../types";
import { formatDistanceToNow } from "date-fns";

export const TicketList: React.FC = () => {
  const [search, setSearch] = useState("");
  const { filters, setFilters, clearFilters } = useTicketStore();
  const { data, isLoading, error } = useTickets({
    search,
    ...filters
  });

  const tickets = (data?.tickets || []) as Ticket[];

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case "OPEN": return "info";
      case "IN_PROGRESS": return "warning";
      case "RESOLVED": return "success";
      case "CLOSED": return "secondary";
      default: return "secondary";
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case "LOW": return "secondary";
      case "MEDIUM": return "info";
      case "HIGH": return "warning";
      case "CRITICAL": return "destructive";
      default: return "secondary";
    }
  };

  const handleFilterChange = (field: keyof typeof filters, value: any) => {
    setFilters({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={filters.status || ""}
            onChange={(e) => handleFilterChange("status", e.target.value || undefined)}
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={filters.priority || ""}
            onChange={(e) => handleFilterChange("priority", e.target.value || undefined)}
          >
            <option value="">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
          {(filters.status || filters.priority) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear
            </Button>
          )}
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error.toString()}</p>}

      <div className="space-y-2">
        {isLoading ? (
          <p>Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p className="text-muted-foreground">No tickets found.</p>
        ) : (
          tickets.map((ticket: Ticket) => (
            <Card key={ticket.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{ticket.subject}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {ticket.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Badge variant={getPriorityColor(ticket.priority)}>
                      {String(ticket.priority).toLowerCase()}
                    </Badge>
                    <Badge variant={getStatusColor(ticket.status)} className="ml-2">
                      {String(ticket.status).toLowerCase().replace("_", " ")}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketList;
