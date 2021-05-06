SRC_DIR=./src
DIST_DIR=./dist

clean:
	@rm -rf $(DIST_DIR)
	@mkdir $(DIST_DIR)

lint:
	@eslint $(SRC_DIR) --ext .ts

build:
	@echo "Looking for lint errors..."
	@make lint
	@echo "Removing dist folder..."
	@make clean
	@echo "Compiling typescript files..."
	@tsc
	@echo "✔ Build done.\n"

start:
	@node $(DIST_DIR)/index.js

dev:
	@make build
	@echo "Starting dev server...\n"
	@make start