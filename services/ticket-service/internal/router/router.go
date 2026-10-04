package router

import (
	"github.com/gin-gonic/gin"
	"github.com/mf-enterprise/ticket-service/internal/config"
	"github.com/mf-enterprise/ticket-service/internal/handler"
	"github.com/mf-enterprise/ticket-service/internal/middleware"
)

func SetupRouter(cfg *config.Config, h *handler.TicketHandler) *gin.Engine {
	r := gin.New()

	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(middleware.CORSMiddleware())

	api := r.Group("/api")
	api.Use(middleware.JWTAuthMiddleware(cfg.AccessSecret))

	{
		tickets := api.Group("/tickets")
		{
			tickets.GET("", h.ListTickets)
			tickets.POST("", h.CreateTicket)
			tickets.GET("/stats", h.GetStats)
			tickets.GET("/recent", h.GetRecentTickets)
			tickets.GET("/:id", h.GetTicket)
			tickets.PUT("/:id", h.UpdateTicket)
			tickets.DELETE("/:id", h.DeleteTicket)
			tickets.GET("/:id/threads", h.GetTicketThreads)
			tickets.POST("/:id/threads", h.CreateThread)
		}
	}

	return r
}
