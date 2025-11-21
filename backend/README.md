## Backend for Nudge-It

### Setup
1. **Install Dependencies**
   ```
   yarn install
   ```
2. **Environment Setup**  
   Create a `.env` file in `backend/` which contains:
   ```
   PORT=8000
   MONGODB_USERNAME="YOUR_MONGODB_USERNAME"
   MONGODB_PASSWORD="YOUR_MONGODB_USERNAME"
   JWT_SECRET="YOUR_JWT_SECRET"
   OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
   ```