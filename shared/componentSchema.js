// Shared component schema definitions
// This file contains common schemas used by both frontend and backend

export const componentSchema = {
  id: String,
  name: String,
  provider: String, // "AWS", "Azure", "GCP"
  category: String, // "Networking", "Compute", "Storage", etc.
  config: Object, // Component-specific configuration
  pricing: Object, // Pricing information
  icon: String, // Optional icon identifier
  description: String, // Optional description
}

// Example component structure
export const exampleComponent = {
  id: "aws-api-gateway",
  name: "API Gateway",
  provider: "AWS",
  category: "Networking",
  config: {
    requestsPerMonth: 1000000
  },
  pricing: {
    perMillionRequests: 3.50
  },
  icon: "api-gateway",
  description: "Amazon API Gateway is a fully managed service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs."
}
