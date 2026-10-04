FROM golang:1.23-alpine AS builder

WORKDIR /app

ENV GOTOOLCHAIN=local
ENV GOSUMDB=off
ENV GOFLAGS=-mod=mod

COPY services/ticket-service/go.mod services/ticket-service/go.sum* ./
RUN go mod download

COPY services/ticket-service .

RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o /ticket-service ./cmd/

FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root

COPY --from=builder /ticket-service .

EXPOSE 8001

CMD ["./ticket-service"]