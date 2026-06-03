#!/usr/bin/env bash

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== NutriGuard Team Setup Script ===${NC}\n"

# 1. Setup Environment Files
echo -e "${YELLOW}[1/5] Setting up environment files...${NC}"
if [ -f "client/.env" ]; then
    echo "client/.env already exists."
else
    if [ -f "client/.env.example" ]; then
        cp client/.env.example client/.env
    else
        echo "VITE_API_URL=http://localhost:3000/api" > client/.env
    fi
    echo "Created client/.env"
fi

if [ -f "server/.env" ]; then
    echo "server/.env already exists."
else
    if [ -f "server/.env.example" ]; then
        cp server/.env.example server/.env
    else
        echo -e "${RED}Error: server/.env.example not found.${NC}"
    fi
    echo "Created server/.env"
fi

# 2. Install Dependencies
echo -e "\n${YELLOW}[2/5] Installing dependencies...${NC}"
echo "Installing client dependencies..."
cd client && npm install
cd ..

echo "Installing server dependencies..."
cd server && npm install
cd ..

# 3. Setup Database Schema
echo -e "\n${YELLOW}[3/5] Running Prisma generate...${NC}"
cd server
npx prisma generate

echo -e "\n${YELLOW}[4/5] Syncing database schema...${NC}"
echo -e "Attempting to push schema to PostgreSQL. (Make sure PostgreSQL is running)"
npx prisma db push

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Database synced successfully!${NC}"
else
    echo -e "${RED}Warning: Database sync failed.${NC}"
    echo -e "Please ensure PostgreSQL is running, the database 'nutriguard' exists, and credentials in server/.env are correct."
    echo -e "After configuring, run 'npx prisma db push' manually inside the 'server' directory."
fi

cd ..

# 5. Setup AI
echo -e "\n${YELLOW}[5/5] Setting up AI...${NC}"
echo "Creating AI virtual environment..."
cd ai && python -m venv .venv
echo "Activating AI virtual environment..."
.venv\Scripts\activate
echo "Installing AI dependencies..."
pip install -r requirements.txt
cd ..

echo -e "\n${GREEN}=== Setup Complete! ===${NC}"
echo -e "To start the development servers, run these commands in separate terminals:"
echo -e "  - Frontend: ${YELLOW}cd client && npm run dev${NC}"
echo -e "  - Backend:  ${YELLOW}cd server && npm run dev${NC}"
echo -e "  - AI:       ${YELLOW}cd ai && .venv\Scripts\activate && uvicorn main:app --reload${NC}"
echo -e "\nSelamat berkarya bersama tim NutriGuard! 🚀"