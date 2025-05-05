package middleware

import (
	"net/http"
)

// AuthMiddleware simulates checking JWT token (make it real later)
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Example: Allow all for now
		next.ServeHTTP(w, r)
	})
}
