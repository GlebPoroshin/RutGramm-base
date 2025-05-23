.PHONY: proto-gen clean

# Generate protobuf code for all services
proto-gen: clean
	mkdir -p ./proto/gen/auth
	mkdir -p ./proto/gen/user
	mkdir -p ./proto/gen/chat
	
	# Generate auth service protos
	protoc --proto_path=proto \
		--go_out=proto/gen --go_opt=paths=source_relative \
		--go-grpc_out=proto/gen --go-grpc_opt=paths=source_relative \
		auth/auth.proto

	# Generate user service protos
	protoc --proto_path=proto \
		--go_out=proto/gen --go_opt=paths=source_relative \
		--go-grpc_out=proto/gen --go-grpc_opt=paths=source_relative \
		user/user.proto

	# Generate chat service protos
	protoc --proto_path=proto \
		--go_out=proto/gen --go_opt=paths=source_relative \
		--go-grpc_out=proto/gen --go-grpc_opt=paths=source_relative \
		chat/chat.proto

clean:
	rm -rf ./proto/gen

# Install required protoc plugins
install-protoc-plugins:
	go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
	go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest 