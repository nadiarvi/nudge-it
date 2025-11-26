# Frontend for Nudge-it

- [Frontend for Nudge-it](#frontend-for-nudge-it)
  - [⚙️ Setup](#️-setup)
  - [💻 Repository Structure](#-repository-structure)


## ⚙️ Setup
1. **Install Dependencies**
   ```
   npm install
   ```
     
2. **Environment Setup**  
   Create a `.env` file in `frontend/` which contains:
   ```
   EXPO_PUBLIC_API_BASE_URL=https://nudge-it.onrender.com
   ```
     
3. **Run the Application**
   ```
   npx expo start
   ```
   > Note: add `--clear` flag if bundling issues are encountered
     
4. **Run the Simulator**  
   Open [Expo Go](https://expo.dev/go) on your mobile device and scan the QR code given in the terminal.

## 💻 Repository Structure
```
frontend
├── api              # API clients and network logic
│   ├── authApi.ts
│   └── axiosClient.ts
├── app              # Main app screens and navigation
│   ├── _layout.tsx
│   ├── (tabs)         # Tab navigation screens
│   │   ├── _layout.tsx    # Tabs layout
│   │   ├── chat.tsx       # Chat tab
│   │   ├── index.tsx      # Main tab (dashboard)
│   │   ├── profile.tsx    # Profile tab
│   │   └── task.tsx       # Task tab
│   ├── chat-member.tsx
│   ├── chatbot.tsx
│   ├── login.tsx
│   ├── register-group.tsx
│   └── task-detail.tsx
├── app.json
├── components       # Reusable UI components
│   ├── icons        # SVG Icons
│   └── ui           # React UI components
├── constants        # Static data and theme config
├── contexts         # React context providers
├── eas.json
├── eslint.config.js
├── expo-env.d.ts
├── hooks            # Custom React hooks
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
├── types            # TypeScript type definitions
└── utils            # Utility/helper functions
```