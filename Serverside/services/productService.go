package services

import (
	"context"
	"serverside/database"
	"serverside/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
)

// CreateProduct saves a new product in the MongoDB collection
func CreateProduct(product models.Product) (models.Product, error) {
	collection := database.GetCollection("products") // Ensure the correct collection is used
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, product)
	if err != nil {
		return models.Product{}, err
	}

	return product, nil
}

func GetAllProducts() ([]models.Product, error) {
	collection := database.GetCollection("products") // Ensure the correct collection is used
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Query all products
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	// Decode products into a slice
	var products []models.Product
	if err := cursor.All(ctx, &products); err != nil {
		return nil, err
	}

	return products, nil
}
