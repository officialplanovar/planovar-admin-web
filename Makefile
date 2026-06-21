# Planovar Admin Console — self-contained Makefile (deployable independently).
.PHONY: help install dev build start lint

PORT ?= 3003
CYAN  := \033[0;36m
RESET := \033[0m

help: ## Show this help
	@echo ""
	@echo "  Planovar Admin Console – commands (port $(PORT))"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-12s$(RESET) %s\n", $$1, $$2}'
	@echo ""

install: ## Install dependencies
	npm install

dev: ## Start the dev server (port $(PORT))
	npm run dev -- -p $(PORT)

build: ## Production build
	npm run build

start: ## Run the production server (port $(PORT))
	npm run start -- -p $(PORT)

lint: ## Lint
	npm run lint
