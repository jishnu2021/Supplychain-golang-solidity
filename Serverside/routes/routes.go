package routes

import (
	"serverside/controllers"
	"serverside/middleware"

	"github.com/gorilla/mux"
)

func RegisterRoutes(router *mux.Router) {
	api := router.PathPrefix("/api").Subrouter()

	// Middleware (optional JWT auth)
	api.Use(middleware.AuthMiddleware)

	// Routes
	api.HandleFunc("/products", controllers.CreateProduct).Methods("POST")
	api.HandleFunc("/products", controllers.GetAllProducts).Methods("GET")
	// api.HandleFunc("/products/{id}", controllers.GetProduct).Methods("GET")
	// api.HandleFunc("/products/{id}/update-status", controllers.UpdateProductStatus).Methods("PUT")
	// api.HandleFunc("/products/{id}/history", controllers.GetProductHistory).Methods("GET")

	// User Routes
	api.HandleFunc("/register", controllers.RegisterUser).Methods("POST")
	api.HandleFunc("/login", controllers.LoginUser).Methods("POST")
	api.HandleFunc("/update-details", controllers.UpdateAccountDetails).Methods("PUT")
	api.HandleFunc("/change-password", controllers.ChangePassword).Methods("PUT")
}
