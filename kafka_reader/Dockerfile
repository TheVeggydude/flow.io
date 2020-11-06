FROM golang:1.13-alpine as builder
RUN apk add --no-cache git

RUN mkdir /src
WORKDIR /src

ENV GO111MODULE on
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o out/app ./examples/kafka_reader/reader.go

# Run stage
FROM alpine:latest

COPY --from=builder /src/out/app .

ENTRYPOINT ["/app"]