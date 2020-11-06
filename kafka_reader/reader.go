package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/segmentio/kafka-go"
)

func getKafkaReader(kafkaURL, topic, groupID string) *kafka.Reader {
	brokers := strings.Split(kafkaURL, ",")
	return kafka.NewReader(kafka.ReaderConfig{
		Brokers:  brokers,
		GroupID:  groupID,
		Topic:    topic,
		MinBytes: 10e3, // 10KB
		MaxBytes: 10e6, // 10MB
	})
}

func main() {
	// get kafka reader using environment variables.
	kafkaURL := os.Getenv("KAFKA_URL")
	fmt.Printf(`Kafka URL: %v \n`, kafkaURL)
	topic := os.Getenv("TOPIC")
	fmt.Printf(`Topic: %v \n`, topic)
	groupID := os.Getenv("GROUP_ID")
	fmt.Printf(`Group ID: %v \n`, groupID)

	reader := getKafkaReader(kafkaURL, topic, groupID)
	defer reader.Close()

	fmt.Println("Starting consumer...")
	for {
		m, err := reader.ReadMessage(context.Background())
		if err != nil {
			log.Fatalln(err)
		}
		fmt.Printf("message at topic:%v partition:%v offset:%v	%s = %s\n", m.Topic, m.Partition, m.Offset, string(m.Key), string(m.Value))
	}
}
