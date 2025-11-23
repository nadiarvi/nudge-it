# Backend for Nudge-It

## 🗃️ Table of Contents
- [Backend for Nudge-It](#backend-for-nudge-it)
  - [🗃️ Table of Contents](#️-table-of-contents)
  - [⚙️ Setup](#️-setup)
  - [👤 User API](#-user-api)
    - [1. Sign Up](#1-sign-up)
    - [2. Login](#2-login)
    - [3. Get User Information](#3-get-user-information)
    - [4. Update User Information](#4-update-user-information)
  - [👥 Group API](#-group-api)
    - [1. Create a New Group](#1-create-a-new-group)
    - [2. Get a Group Information](#2-get-a-group-information)
    - [3. Delete a Group](#3-delete-a-group)
    - [4. Update a Group Information](#4-update-a-group-information)
    - [5. Get Members of a Group](#5-get-members-of-a-group)
    - [6. Add Members to a Group](#6-add-members-to-a-group)
    - [7. Delete Members from a Group](#7-delete-members-from-a-group)
  - [🗂️ Task API](#️-task-api)
    - [1. Create a New Task](#1-create-a-new-task)
    - [2. Get a Task by ID](#2-get-a-task-by-id)
    - [3. Get All Tasks in a Group](#3-get-all-tasks-in-a-group)
    - [4. Delete a Task](#4-delete-a-task)
  - [💬 Chat API](#-chat-api)
    - [1. Create or Get a Chat](#1-create-or-get-a-chat)
    - [2. Get All Chats for Current User](#2-get-all-chats-for-current-user)
    - [3. Get a Specific Chat](#3-get-a-specific-chat)
    - [4. Send a Message (User Chat)](#4-send-a-message-user-chat)
    - [5. Confirm and Save User Message (After Revision)](#5-confirm-and-save-user-message-after-revision)
    - [6. Send a Message (Nugget Chat)](#6-send-a-message-nugget-chat)
  - [🔔 Nudge API](#-nudge-api)
    - [1. Send a Nudge (Notification)](#1-send-a-nudge-notification)
    - [2. Get Nudges Received by User](#2-get-nudges-received-by-user)
    - [3. Get Nudges Sent by User](#3-get-nudges-sent-by-user)
    - [4. Get Nudges for a Task](#4-get-nudges-for-a-task)


## ⚙️ Setup
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


## 👤 User API

### 1. Sign Up

**Endpoint:** `POST api/users/signup`
- **Description:** Register a new user
- **Request Body:**
  - `name`: String (required)
  - `email`: String (required, must be valid email)
  - `password`: String (required, min 8 chars)

**Request Example:**
```json
{
  "name": "Nugget",
  "email": "nugget@email.com",
  "password": "password123"
}
```

**Responses:**
- `201 OK`: User created
- `422`: Invalid request
- `500`: Server error

---
### 2. Login

**Endpoint:** `POST api/users/login`
- **Description:** Login with email and password
- **Request Body:**
  - `email`: String
  - `password`: String

**Responses:**
- `200 OK`: Login successful
- `401`: Invalid credentials
- `500`: Server error

---
### 3. Get User Information

**Endpoint:** `GET api/users/:uid`
- **Description:** Get user details by user ID

**Responses:**
- `200 OK`: Returns user object
- `404`: User not found
- `500`: Server error

---
### 4. Update User Information

**Endpoint:** `PATCH api/users/:uid`
- **Description:** Update user details
- **Request Body:**
  - `name`: String (optional)
  - `email`: String (optional)

**Responses:**
- `200 OK`: User updated
- `404`: User not found
- `500`: Server error

---
## 👥 Group API

### 1. Create a New Group

**Endpoint:** `POST api/groups/create`
- **Description:** Create a new group
- **Request Body:**
  - `name`: String (required)
  - `members`: Array of user IDs (optional)

**Request Example:**
```json
{
  "name": "CS473",
  "members": ["userId1", "userId2"]
}
```

**Responses:**
- `201 OK`: Group created successfully
- `422`: Invalid request
- `500`: Server error

---
### 2. Get a Group Information

**Endpoint:** `GET api/groups/:gid`
- **Description:** Fetch a group's information by ID

**Responses:**
- `200 OK`: Returns group object
- `404`: Group does not exist
- `500`: Server error

---
### 3. Delete a Group

**Endpoint:** `DELETE api/groups/:gid`
- **Description:** Delete a group by ID

**Responses:**
- `200 OK`: Group deleted
- `404`: Group does not exist
- `500`: Server error

---
### 4. Update a Group Information

**Endpoint:** `PATCH api/groups/:gid`
- **Description:** Update group details (name, tasks, chats)
- **Request Body:**
  - `name`: String (optional)
  - `tasks`: Array of task IDs (optional)
  - `chats`: Array of chat IDs (optional)

**Responses:**
- `200 OK`: Group updated
- `404`: Group does not exist
- `500`: Server error

---
### 5. Get Members of a Group

**Endpoint:** `GET api/groups/:gid/members`
- **Description:** Get the list of members in a group

**Responses:**
- `200 OK`: Returns array of user IDs
- `404`: Group does not exist
- `500`: Server error

---
### 6. Add Members to a Group

**Endpoint:** `PATCH api/groups/:gid/members`
- **Description:** Add one or more users to a group
- **Request Body:**
  - `userIds`: Array of user IDs to add

**Request Example:**
```json
{
  "userIds": ["userId3", "userId4"]
}
```

**Responses:**
- `200 OK`: Members added
- `404`: Group or user does not exist
- `500`: Server error

---
### 7. Delete Members from a Group

**Endpoint:** `DELETE api/groups/:gid/members`
- **Description:** Remove one or more users from a group
- **Request Body:**
  - `userIds`: Array of user IDs to remove

**Request Example:**
```json
{
  "userIds": ["userId2"]
}
```

**Responses:**
- `200 OK`: Members removed
- `404`: Group does not exist
- `500`: Server error

---
## 🗂️ Task API

### 1. Create a New Task

**Endpoint:** `POST api/tasks/create`
- **Description:** Create a new task for a group
- **Request Body:**
  - `group_id`: String (required)
  - `title`: String (required)
  - `deadline`: Date (optional)
  - `assignee`: Array of User ID ([String], optional)
  - `status`: String (optional, set default to TO-DO)
  - `comments`: Array of Comments (optional)
  - `nudges`: Array (optional)

**Responses:**
- `201 OK`: Task created
- `422`: Invalid request
- `500`: Server error

---
### 2. Get a Task by ID

**Endpoint:** `GET api/tasks/:gid/:tid`
- **Description:** Get a specific task by its ID and group ID

**Responses:**
- `200 OK`: Returns task object
- `400`: Task does not exist
- `500`: Server error

---
### 3. Get All Tasks in a Group

**Endpoint:** `GET api/tasks/:gid`
- **Description:** Get all tasks for a group

**Responses:**
- `200 OK`: Returns array of tasks and total count
- `500`: Server error

---
### 4. Delete a Task

**Endpoint:** `DELETE api/tasks/:gid/:tid`
- **Description:** Delete a task by its ID and group ID

**Responses:**
- `200 OK`: Task deleted
- `400`: Task does not exist
- `500`: Server error

---
## 💬 Chat API

### 1. Create or Get a Chat

**Endpoint:** `POST api/chats/create`
- **Description:** Create or get a chat between two users or with Nugget in a group
- **Request Body:**
  - `otherUserId`: String (required)
  - `groupId`: String (required)
  - `type`: String, either "user" or "nugget" (required)

**Request Example:**
```json
{
  "otherUserId": "userId2",
  "groupId": "groupId1",
  "type": "user"
}
```

**Responses:**
- `201 OK`: Chat created
- `200 OK`: Existing chat returned
- `422`: Invalid request
- `500`: Server error

---
### 2. Get All Chats for Current User

**Endpoint:** `GET api/chats/get`
- **Description:** Get all chats for the current user in a group

**Responses:**
- `200 OK`: Returns array of chats
- `500`: Server error

---
### 3. Get a Specific Chat

**Endpoint:** `GET api/chats/:cid`
- **Description:** Get a specific chat by chat ID

**Responses:**
- `200 OK`: Returns chat object
- `404`: Chat not found
- `500`: Server error

---
### 4. Send a Message (User Chat)

**Endpoint:** `POST api/chats/:cid/messages/user`
- **Description:** Send a message in a user chat. The backend will check the tone and may suggest a revision.
- **Request Body:**
  - `content`: String (required)

**Request Example:**
```json
{
  "content": "Hey, why didn't you finish your part?"
}
```

**Responses:**
- `201 OK`: Message sent (if no revision needed)
- `200 OK`: If needsRevision = true, response includes both original and suggested message. You must call `POST api/chats/:cid/messages/confirm` to save the chosen message.
- `500`: Server error

**Note:**
- If `needsRevision = true` in the response from `POST api/chats/:cid/messages/user`, you must call `POST api/chats/:cid/messages/confirm` with the user's choice to save the message.

---
### 5. Confirm and Save User Message (After Revision)

**Endpoint:** `POST api/chats/:cid/messages/confirm`
- **Description:** Confirm and save the user's chosen message after revision suggestion.
- **Request Body:**
  - `chosenContent`: String (required)

**Request Example:**
```json
{
  "chosenContent": "You could have asked for help if you needed it."
}
```

**Responses:**
- `201 OK`: Message saved
- `500`: Server error

---
### 6. Send a Message (Nugget Chat)

**Endpoint:** `POST api/chats/:cid/messages/nugget`
- **Description:** Send a message in a Nugget chat. Nugget will reply with advice based on chat history.
- **Request Body:**
  - `content`: String (required)

**Request Example:**
```json
{
  "content": "I'm frustrated with my teammate. What should I do?"
}
```

**Responses:**
- `201 OK`: Message sent and Nugget reply added
- `500`: Server error

---
## 🔔 Nudge API

### 1. Send a Nudge (Notification)

**Endpoint:** `POST api/nudges/create`
- **Description:** Send a nudge notification (reminder, phone call, or email to TA) related to a task in a group
- **Request Body:**
  - `type`: String, one of ["reminder", "phone_call", "email_ta"] (required)
  - `group_id`: String (required)
  - `task_id`: String (required)
  - `sender`: String (required)
  - `receiver`: String (required)

**Request Example:**
```json
{
  "type": "reminder",
  "group_id": "groupId1",
  "task_id": "taskId1",
  "sender": "userId1",
  "receiver": "userId2"
}
```

**Responses:**
- `201 OK`: Nudge created and notification sent
- `422`: Invalid request
- `500`: Server error

---
### 2. Get Nudges Received by User

**Endpoint:** `GET api/nudges/:gid/:uid/received`
- **Description:** Get all nudges received by a user in a group

**Responses:**
- `200 OK`: Returns array of nudges and totalNudge
- `500`: Server error

---
### 3. Get Nudges Sent by User

**Endpoint:** `GET api/nudges/:gid/:uid/sent`
- **Description:** Get all nudges sent by a user in a group

**Responses:**
- `200 OK`: Returns array of nudges and totalNudge
- `500`: Server error

---
### 4. Get Nudges for a Task

**Endpoint:** `GET api/nudges/:gid/:tid`
- **Description:** Get all nudges related to a specific task in a group

**Responses:**
- `200 OK`: Returns array of nudges and totalNudge
- `500`: Server error