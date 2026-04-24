FROM golang:1.26 AS builder
WORKDIR /app

# Adds hot reloading
RUN go install github.com/air-verse/air@latest 

COPY go.mod go.sum ./
RUN go mod download
COPY . .

CMD ["air", "-c", ".air.toml"]
