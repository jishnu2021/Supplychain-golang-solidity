package main

import (
	"log"
	"net/http"
	"serverside/database"
	"serverside/routes"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	// 1. Connect MongoDB
	database.ConnectDatabase()

	// 2. Init Router
	router := mux.NewRouter()

	// 3. Register Routes
	routes.RegisterRoutes(router)

	// 4. Enable CORS
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:8080"}, // Allow your frontend origin
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}).Handler(router)

	// 5. Start server
	log.Println("🚀 Server running at http://localhost:5000")
	log.Fatal(http.ListenAndServe(":5000", corsHandler))
}
