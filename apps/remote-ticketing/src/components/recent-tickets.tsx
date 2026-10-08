import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@mf-enterprise/ui-components";
import { Ticket } from "../types";
import api from "../services/api";
import { formatDistanceToNow } from "date-fns";
import { TicketPriority, TicketStatus } from "../types";

const getPriorityColor = (priority: TicketPriority) => {
  switch (priority) {
    case "LOW": return "secondary";
    case "MEDIUM": return "info";
    case "HIGH": return "warning";
    case "CRITICAL": return "destructive";
    default: return "secondary";
  }
};

const getStatusColor = (status: TicketStatus) => {
  switch (status) {
    case "OPEN": return "info";
    case "IN_PROGRESS": return "warning";
    case "RESOLVED": return "success";
    case "CLOSED": return "secondary";
    default: return "secondary";
  }
};

const RecentTickets: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["recent-tickets"],
    queryFn: async () => {
      const response = await api.get<Ticket[]>("/tickets/recent?limit=5");
      return response.data;
    },
    staleTime: 30000
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data && data.length > 0 ? (
            data.map((ticket: Ticket) => (
              <div key={ticket.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{ticket.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getPriorityColor(ticket.priority)}>
                    {String(ticket.priority).toLowerCase()}
                  </Badge>
                  <Badge variant={getStatusColor(ticket.status)}>
                    {String(ticket.status).toLowerCase().replace("_", " ")}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No recent tickets.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTickets;
