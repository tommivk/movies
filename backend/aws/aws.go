package aws

import (
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"os"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
)

var client *s3.Client

func CreateClient() error {
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithSharedConfigFiles([]string{".env"}))
	if err != nil {
		return err
	}
	client = s3.NewFromConfig(cfg)
	return nil
}

func UploadImage(path string, image *multipart.FileHeader) (string, error) {
	imageId := uuid.New().String()
	file, err := image.Open()
	if err != nil {
		return "", err
	}
	body := file.(io.Reader)
	BUCKET := os.Getenv("S3_BUCKET_NAME")
	key := fmt.Sprintf("%s/%s", path, imageId)
	_, err = client.PutObject(context.TODO(), &s3.PutObjectInput{Bucket: &BUCKET, Key: &key, Body: body})
	return key, err
}
