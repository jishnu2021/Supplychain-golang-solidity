package controllers

import (
	"encoding/json"
	
	// "fmt"
	"net/http"
	"serverside/models" // Import the Product structure from product.go
	"serverside/services"
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// CreateProduct creates a new product
func CreateProduct(w http.ResponseWriter, r *http.Request) {
	var product models.Product // Use the Product structure from models

	if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
		http.Error(w, "Invalid input: "+err.Error(), http.StatusBadRequest)
		return
	}

	if product.Name == "" || product.Category == "" || product.Origin == "" || product.Destination == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	if product.Status == "" {
		product.Status = "Manufactured"
	}

	product.ID = primitive.NewObjectID()
	product.History = []models.HistoryEntry{
		{
			Timestamp: time.Now(),
			Status:    product.Status,
			
		},
	}

	savedProduct, err := services.CreateProduct(product)
	if err != nil {
		http.Error(w, "Failed to create product: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(savedProduct)
}

func GetAllProducts(w http.ResponseWriter, r *http.Request) {
    // Call the service layer to fetch all products
    products, err := services.GetAllProducts()
    if err != nil {
        http.Error(w, "Failed to fetch products: "+err.Error(), http.StatusInternalServerError)
        return
    }

    // Respond with the list of products in JSON format
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(products)
}