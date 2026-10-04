package models

import "time"

type TicketStatus string

const (
	TicketStatusOpen       TicketStatus = "OPEN"
	TicketStatusInProgress TicketStatus = "IN_PROGRESS"
	TicketStatusResolved   TicketStatus = "RESOLVED"
	TicketStatusClosed     TicketStatus = "CLOSED"
)

type TicketPriority string

const (
	TicketPriorityLow      TicketPriority = "LOW"
	TicketPriorityMedium   TicketPriority = "MEDIUM"
	TicketPriorityHigh     TicketPriority = "HIGH"
	TicketPriorityCritical TicketPriority = "CRITICAL"
)

type Ticket struct {
	ID             string         `json:"id" gorm:"type:uuid;primarykey"`
	CustomerID     string         `json:"customer_id" gorm:"type:uuid;column:customer_id"`
	AssignedAgentID *string       `json:"assigned_agent_id" gorm:"type:uuid;column:assigned_agent_id;default:null"`
	Subject          string      `json:"subject" gorm:"type:varchar(255)"`
	Description      string      `json:"description" gorm:"type:text"`
	Status           TicketStatus  `json:"status" gorm:"type:ticket_status;default:OPEN"`
	Priority         TicketPriority `json:"priority" gorm:"type:ticket_priority;default:MEDIUM"`
	Category         string        `json:"category" gorm:"type:varchar(100);default:null"`
	Tags             []string      `json:"tags" gorm:"type:text[]"`
	CreatedAt        time.Time     `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt        time.Time     `json:"updated_at" gorm:"autoUpdateTime"`
}

type TicketThread struct {
	ID          string         `json:"id" gorm:"type:uuid;primarykey"`
	TicketID    string         `json:"ticket_id" gorm:"type:uuid;column:ticket_id"`
	SenderID    string         `json:"sender_id" gorm:"type:uuid;column:sender_id"`
	SenderType  string         `json:"sender_type" gorm:"type:varchar(20)"`
	Message     string         `json:"message" gorm:"type:text"`
	Attachments []string       `json:"attachments,omitempty" gorm:"type:jsonb"`
	CreatedAt   time.Time      `json:"created_at" gorm:"autoCreateTime"`
}

type DashboardStats struct {
	Total         int64 `json:"total"`
	OpenCount     int64 `json:"openCount"`
	InProgress    int64 `json:"inProgressCount"`
	ResolvedCount int64 `json:"resolvedCount"`
	CriticalCount int64 `json:"criticalCount"`
}

type CreateTicketRequest struct {
	Subject      string         `json:"subject" binding:"required"`
	Description  string         `json:"description" binding:"required"`
	Priority     TicketPriority `json:"priority" binding:"required"`
	Category     string         `json:"category,omitempty"`
	Tags         []string       `json:"tags,omitempty"`
	Attachments  []string       `json:"attachments,omitempty"`
}

type UpdateTicketRequest struct {
	Subject         *string        `json:"subject,omitempty"`
	Description     *string        `json:"description,omitempty"`
	Status          *TicketStatus  `json:"status,omitempty"`
	Priority        *TicketPriority `json:"priority,omitempty"`
	AssignedAgentID *string        `json:"assignedAgentId,omitempty"`
	Category        *string        `json:"category,omitempty"`
	Tags            []string       `json:"tags,omitempty"`
}

type CreateThreadRequest struct {
	Message     string   `json:"message" binding:"required"`
	Attachments []string `json:"attachments,omitempty"`
}

type TicketFilters struct {
	Status    string         `form:"status"`
	Priority  string         `form:"priority"`
	Category  string         `form:"category"`
	Search    string         `form:"search"`
	SortBy    string         `form:"sortBy" default:"created_at"`
	Order     string         `form:"order" default:"desc"`
	Page      int            `form:"page,default=1"`
	Limit     int            `form:"limit,default=20"`
}

type PaginatedTickets struct {
	Tickets []Ticket `json:"tickets"`
	Total   int      `json:"total"`
	Page    int      `json:"page"`
	Limit   int      `json:"limit"`
}
