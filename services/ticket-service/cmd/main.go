package main

import (
	"fmt"
	"log"

	"github.com/mf-enterprise/ticket-service/internal/config"
	"github.com/mf-enterprise/ticket-service/internal/handler"
	"github.com/mf-enterprise/ticket-service/internal/router"
	"github.com/mf-enterprise/ticket-service/internal/models"
)

func main() {
	cfg := config.LoadConfig()

	db, err := config.ConnectDatabase(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect database: %v", err)
	}

	if err := db.AutoMigrate(&models.Ticket{}, &models.TicketThread{}); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	h := handler.NewTicketHandler(db)
	r := router.SetupRouter(cfg, h)

	fmt.Printf("[TicketService] Starting server on port %s\n", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
