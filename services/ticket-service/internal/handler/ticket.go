package handler

import (
	"crypto/rand"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/mf-enterprise/ticket-service/internal/models"
	"gorm.io/gorm"
)

type TicketHandler struct {
	db *gorm.DB
}

func NewTicketHandler(db *gorm.DB) *TicketHandler {
	return &TicketHandler{db: db}
}

func (h *TicketHandler) ListTickets(c *gin.Context) {
	var filters models.TicketFilters
	if err := c.ShouldBindQuery(&filters); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid filters", "error": err.Error()})
		return
	}

	query := h.db.Model(&models.Ticket{})
	totalQuery := h.db.Model(&models.Ticket{})

	if filters.Status != "" {
		query = query.Where("status = ?", filters.Status)
		totalQuery = totalQuery.Where("status = ?", filters.Status)
	}
	if filters.Priority != "" {
		query = query.Where("priority = ?", filters.Priority)
		totalQuery = totalQuery.Where("priority = ?", filters.Priority)
	}
	if filters.Search != "" {
		query = query.Where("subject ILIKE ? OR description ILIKE ?", "%"+filters.Search+"%", "%"+filters.Search+"%")
		totalQuery = totalQuery.Where("subject ILIKE ? OR description ILIKE ?", "%"+filters.Search+"%", "%"+filters.Search+"%")
	}

	var total int64
	totalQuery.Count(&total)

	if filters.Page == 0 {
		filters.Page = 1
	}
	if filters.Limit == 0 {
		filters.Limit = 20
	}

	offset := (filters.Page - 1) * filters.Limit
	if filters.Limit > 0 {
		query = query.Limit(filters.Limit).Offset(offset)
	}

	var tickets []models.Ticket
	if err := query.Find(&tickets).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch tickets", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"tickets": tickets,
		"total":   total,
		"page":    filters.Page,
		"limit":   filters.Limit,
	})
}

func (h *TicketHandler) GetTicket(c *gin.Context) {
	id := c.Param("id")

	var ticket models.Ticket
	if err := h.db.First(&ticket, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Ticket not found"})
		return
	}

	c.JSON(http.StatusOK, ticket)
}

func (h *TicketHandler) CreateTicket(c *gin.Context) {
	var req models.CreateTicketRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request", "error": err.Error()})
		return
	}

	userID := c.GetString("user_id")
	if userID == "" {
		userID = generateUUID()
	}

	if err := h.ensureGuestUser(userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create guest user", "error": err.Error()})
		return
	}

	ticket := models.Ticket{
		ID:            generateUUID(),
		CustomerID:    userID,
		Subject:       req.Subject,
		Description:   req.Description,
		Priority:      req.Priority,
		Category:      req.Category,
		Tags:          req.Tags,
		Status:        models.TicketStatusOpen,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	if err := h.db.Create(&ticket).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create ticket"})
		return
	}

	c.JSON(http.StatusCreated, ticket)
}

func (h *TicketHandler) UpdateTicket(c *gin.Context) {
	id := c.Param("id")

	var req models.UpdateTicketRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request", "error": err.Error()})
		return
	}

	var ticket models.Ticket
	if err := h.db.First(&ticket, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Ticket not found"})
		return
	}

	if req.Subject != nil {
		ticket.Subject = *req.Subject
	}
	if req.Description != nil {
		ticket.Description = *req.Description
	}
	if req.Status != nil {
		ticket.Status = *req.Status
	}
	if req.Priority != nil {
		ticket.Priority = *req.Priority
	}
	if req.AssignedAgentID != nil {
		ticket.AssignedAgentID = req.AssignedAgentID
	}
	if req.Category != nil {
		ticket.Category = *req.Category
	}
	if req.Tags != nil {
		ticket.Tags = req.Tags
	}

	ticket.UpdatedAt = time.Now()

	if err := h.db.Save(&ticket).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update ticket"})
		return
	}

	c.JSON(http.StatusOK, ticket)
}

func (h *TicketHandler) DeleteTicket(c *gin.Context) {
	id := c.Param("id")

	if err := h.db.Delete(&models.Ticket{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete ticket"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Ticket deleted successfully"})
}

func (h *TicketHandler) GetTicketThreads(c *gin.Context) {
	ticketID := c.Param("id")

	var threads []models.TicketThread
	if err := h.db.Where("ticket_id = ?", ticketID).Order("created_at ASC").Find(&threads).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch threads"})
		return
	}

	c.JSON(http.StatusOK, threads)
}

func (h *TicketHandler) CreateThread(c *gin.Context) {
	ticketID := c.Param("id")

	var req models.CreateThreadRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request", "error": err.Error()})
		return
	}

	userID := c.GetString("user_id")

	thread := models.TicketThread{
		ID:          generateUUID(),
		TicketID:    ticketID,
		SenderID:    userID,
		SenderType:  "CUSTOMER",
		Message:     req.Message,
		Attachments: req.Attachments,
		CreatedAt:   time.Now(),
	}

	if err := h.db.Create(&thread).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create thread"})
		return
	}

	c.JSON(http.StatusCreated, thread)
}

func (h *TicketHandler) GetStats(c *gin.Context) {
	var stats models.DashboardStats

	h.db.Model(&models.Ticket{}).Count(&stats.Total)
	h.db.Model(&models.Ticket{}).Where("status = ?", models.TicketStatusOpen).Count(&stats.OpenCount)
	h.db.Model(&models.Ticket{}).Where("status = ?", models.TicketStatusInProgress).Count(&stats.InProgress)
	h.db.Model(&models.Ticket{}).Where("status = ?", models.TicketStatusResolved).Count(&stats.ResolvedCount)
	h.db.Model(&models.Ticket{}).Where("priority = ?", models.TicketPriorityCritical).Count(&stats.CriticalCount)

	c.JSON(http.StatusOK, stats)
}

func (h *TicketHandler) GetRecentTickets(c *gin.Context) {
	limit := 5
	if l := c.Query("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 {
			limit = parsed
		}
	}

	var tickets []models.Ticket
	if err := h.db.Order("created_at DESC").Limit(limit).Find(&tickets).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch recent tickets"})
		return
	}

	c.JSON(http.StatusOK, tickets)
}

func generateUUID() string {
	b := make([]byte, 16)
	rand.Read(b)
	b[6] = (b[6] & 0x0f) | 0x40
	b[8] = (b[8] & 0x3f) | 0x80
	return fmt.Sprintf("%x-%x-%x-%x-%x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:16])
}

func (h *TicketHandler) ensureGuestUser(userID string) error {
	result := h.db.Exec("INSERT INTO users (id, email, password_hash, name, role, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW()) ON CONFLICT (id) DO NOTHING", userID, "guest_"+userID+"@example.com", "password_hash_placeholder", "Guest User", "customer", "active")
	return result.Error
}