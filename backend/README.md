# Backend for Nudge-it

## 🗃️ Table of Contents
- [Backend for Nudge-it](#backend-for-nudge-it)
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
    - [8. Join Group by Invite Code](#8-join-group-by-invite-code)
  - [🗂️ Task API](#️-task-api)
    - [1. Create a New Task](#1-create-a-new-task)
    - [2. Get a Task by ID](#2-get-a-task-by-id)
    - [3. Get All Tasks in a Group](#3-get-all-tasks-in-a-group)
    - [4. Delete a Task](#4-delete-a-task)
    - [5. Get All Tasks Related to a User in a Group](#5-get-all-tasks-related-to-a-user-in-a-group)
    - [6. Update a Task](#6-update-a-task)
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
  - `first_name`: String (required)
  - `last_name` : String (required)
  - `email`: String (required, must be valid email)
  - `password`: String (required, min 8 chars)

**Request Example:**
```json
{
  "first_name": "Nugget",
  "last_name": "Mister",
  "email": "nugget@email.com",
  "password": "password123"
}
```

**Responses:**
- `201 OK`: User created
```json
{
  "userId": "userid",
  "first_name": "Nugget",
  "last_name": "Mister",
  "email": "nugget@email.com",
  "password": "password123"
}
```
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
```json
{
  "message": "Login successful",
  "_id": "userid",
  "email": "dummy@example.com",
  "password": "12345678",
  "first_name": "Nugget",
  "last_name": "Mister",
  "groups": ["groupid1", "groupid2"]
  "token"
}
```
- `401`: Invalid credentials
- `500`: Server error

---
### 3. Get User Information

**Endpoint:** `GET api/users/:uid`
- **Description:** Get user details by user ID

**Responses:**
- `200 OK`: Returns user object without password
```json
{
  "_id": "userid",
  "email": "dummy@example.com",
  "first_name": "Nugget",
  "last_name": "Mister",
  "groups": ["groupid1", "groupid2"]
}
```
- `404`: User not found
- `500`: Server error

---
### 4. Update User Information

**Endpoint:** `PATCH api/users/:uid`
- **Description:** Update user details
- **Request Body:**
  - `first_name`: String (optional)
  - `last_name`: String (optional)
  - `email`: String (optional)

**Responses:**
- `200 OK`: User updated
```json
{
  "message":"User updated",
  "_id": "userid",
  "email": "dummy@example.com",
  "password": "12345678",
  "first_name": "Nugget",
  "last_name": "Mister",
  "groups": ["groupid1", "groupid2"]
}
```
- `404`: User not found
- `500`: Server error

---
## 👥 Group API

### 1. Create a New Group

**Endpoint:** `POST api/groups/create/:uid`
- **Description:** Create a new group. The creator (uid) is automatically added as a member.
- **Request Body:**
  - `name`: String (required)
  - `members`: Array of user IDs (optional)
  - `ta_email`: String (optional)
  - `nudge_limit`: Integer (optional, default: 1)

**Request Example:**
```json
{
  "name": "CS473",
  "members": ["userId1", "userId2"],
  "ta_email": "ta@email.com",
  "nudge_limit": 2
}
```

**Responses:**
- `201 OK`: Group created successfully
```json
{
  "groupId": "groupid",
  "group": {
    "_id": "groupid",
    "name": "CS473",
    "nudge_limit": 2,
    "members": [
      {
        "_id": "userId1",
        "first_name": "Alice",
        "last_name": "Smith",
        "email": "alice@email.com"
      }
    ],
    "ta_email": "ta@email.com",
    "chats": [],
    "tasks": [],
    "invite_code": "ABC123"
  }
}
```
- `422`: Invalid request
- `500`: Server error

---

### 2. Get a Group Information

**Endpoint:** `GET api/groups/:gid`
- **Description:** Fetch a group's information by ID

**Responses:**
- `200 OK`: Returns group object
```json
{
  "_id": "groupid",
  "name": "CS473",
  "nudge_limit": 2,
  "members": [
    {
      "_id": "userId1",
      "first_name": "Alice",
      "last_name": "Smith",
      "email": "alice@email.com"
    }
  ],
  "ta_email": "ta@email.com",
  "tasks": ["taskId1", "taskId2"], 
  "chats": ["chatId1"],
  "invite_code": "ABC123"
}
```
- `404`: Group does not exist
- `500`: Server error

---

### 3. Delete a Group

**Endpoint:** `DELETE api/groups/:gid`
- **Description:** Delete a group by ID

**Responses:**
- `200 OK`: Group deleted
```json
{
  "message": "Group deleted",
  "groupId": "groupid"
}
```
- `404`: Group does not exist
- `500`: Server error

---

### 4. Update a Group Information

**Endpoint:** `PATCH api/groups/:gid`
- **Description:** Update group details (name, tasks, chats, ta_email, nudge_limit)
- **Request Body:**
  - `name`: String (optional)
  - `ta_email`: String (optional)
  - `tasks`: Array of task IDs (optional)
  - `chats`: Array of chat IDs (optional)
  - `nudge_limit`: Integer (optional)

**Request Example:**
```json
{
  "name": "CS473 Updated",
  "nudge_limit": 3,
  "ta_email": "newta@email.com"
}
```

**Responses:**
- `200 OK`: Group updated
```json
{
  "group": {
    "_id": "groupid",
    "name": "CS473 Updated",
    "nudge_limit": 3,
    "members": [
      {
        "_id": "userId1",
        "first_name": "Alice",
        "last_name": "Smith",
        "email": "alice@email.com"
      }
    ],
    "ta_email": "newta@email.com",
    "chats": ["chatId1"],
    "tasks": ["taskId1"],
    "invite_code": "ABC123"
  }
}
```
- `404`: Group does not exist
- `500`: Server error

---

### 5. Get Members of a Group

**Endpoint:** `GET api/groups/:gid/members`
- **Description:** Get the list of members in a group (returns full user objects)

**Responses:**
- `200 OK`: Returns array of user objects
```json
{
  "members": [
    {
      "_id": "userId1",
      "first_name": "Alice",
      "last_name": "Smith",
      "email": "alice@email.com"
    }
  ]
}
```
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
  "userIds": ["userId2", "userId3"]
}
```

**Responses:**
- `200 OK`: Members added
```json
{
  "message": "Member added to the group",
  "existingGroup": {
    "_id": "groupid",
    "name": "CS473",
    "members": [
      // ...full user objects
    ],
    "chats": ["chatId1"],
    "tasks": ["taskId1"]
  }
}
```
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
```json
{
  "existingGroup": {
    "_id": "groupid",
    "name": "CS473",
    "members": [
      // ...full user objects
    ],
    "ta_email": "ta@email.com",
    "tasks": ["taskId1", "taskId2"], 
    "chats": ["chatId1"],
    "invite_code": "ABC123"
  }
}
```
- `404`: Group does not exist
- `500`: Server error

---

### 8. Join Group by Invite Code

**Endpoint:** `PATCH api/groups/:uid/join`
- **Description:** Join a group using an invite code
- **Request Body:**
  - `inviteCode`: String (required)

**Request Example:**
```json
{
  "inviteCode": "ABC123"
}
```

**Responses:**
- `200 OK`: Successfully joined the group
```json
{
  "message": "Successfully joined the group.",
  "group": {
    "_id": "groupid",
    "name": "CS473",
    "members": [
      // ...full user objects
    ],
    "ta_email": "ta@email.com",
    "tasks": ["taskId1", "taskId2"], 
    "chats": ["chatId1"],
    "invite_code": "ABC123"
  }
}
```
- `404`: Invalid invitation code
- `409`: Already a member
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
  - `assignee`: String or [String] (optional)
  - `reviewer`: String (optional)
  - `status`: String (optional)
  - `comments`: Array (optional)
  - `nudges`: Array (optional)

**Request Example:**
```json
{
  "group_id": "groupid",
  "title": "Design Landing Page",
  "deadline": "2025-12-01T00:00:00Z",
  "assignee": "userId1",
  "reviewer": "userId2",
  "status": "To-Do"
}
```

**Responses:**
- `201 OK`: Task created
```json
{
  "taskId": "taskid",
  "task": {
    "_id": "taskid",
    "group_id": "groupid",
    "title": "Design Landing Page",
    "deadline": "2025-12-01T00:00:00Z",
    "assignee": ["userId1"],
    "reviewer": ["userId2"],
    "status": "To-Do",
    "comments": [],
    "nudges": []
  }
}
```
- `422`: Invalid request
- `500`: Server error

---
### 2. Get a Task by ID

**Endpoint:** `GET api/tasks/:gid/:tid`
- **Description:** Get a specific task by its ID and group ID

**Responses:**
- `200 OK`: Returns task object
```json
{
  "_id": "taskid",
  "group_id": "groupid",
  "title": "Design Landing Page",
  "deadline": "2025-12-01T00:00:00Z",
  "assignee": ["userId1"],
  "reviewer": ["userId2"],
  "status": "To-Do",
  "comments": [],
  "nudges": [],
  "createdAt": "date2",
  "updatedAt": "date2" 
}
```
- `400`: Task does not exist
- `500`: Server error

---
### 3. Get All Tasks in a Group

**Endpoint:** `GET api/tasks/:gid`
- **Description:** Get all tasks for a group

**Responses:**
- `200 OK`: Returns array of tasks and total count
```json
{
  "tasks": [
    {
      "id": "taskid1",
      "group_id": "grpid1",
      "title": "do this",
      "deadline": "date1",
      "assignee": ["userId1"],
      "reviewer": ["userId2"],
      "status": "To Do",
      "comments": [],
      "nudges": [],
      "createdAt": "date2",
      "updatedAt": "date2" 
    },
    {
      "_id": "taskid2",
      "title": "Write Documentation",
      "deadline": "date3",
      "assignee": ["userId3"],
      "reviewer": ["userId4"],
      "status": "In Review",
      "comments": [],
      "nudges": [],
      "createdAt": "date4",
      "updatedAt": "date4" 
    }
  ],
  "total_tasks": 2
}
```
- `500`: Server error

---
### 4. Delete a Task

**Endpoint:** `DELETE api/tasks/:gid/:tid`
- **Description:** Delete a task by its ID and group ID

**Responses:**
- `200 OK`: Task deleted
```json
{
  "message": "Task deleted",
  "taskId": "taskid"
}
```
- `400`: Task does not exist
- `500`: Server error

---
### 5. Get All Tasks Related to a User in a Group

**Endpoint:** `GET api/tasks/:gid/user/:uid`
- **Description:** Get all tasks assigned to or reviewed by a user in a group, grouped by category (To Do, To Review, Pending for Review)

**Responses:**
- `200 OK`: Returns result array, each with category name and list of tasks
```json
{
  "result": [
    {
      "category": "To Do",
      "tasks": [
        {
          "id": "taskid1",
          "title": "Design Landing Page",
          "deadline": "2025-12-01T00:00:00Z",
          "assignee": ["userId1"],
          "status": "To-Do",
          "reviewer": ["userId2"],
          "nudges": []
        }
      ]
    },
    {
      "category": "To Review",
      "tasks": [
        {
          "id": "taskid2",
          "title": "Write Documentation",
          "deadline": "2025-12-02T00:00:00Z",
          "assignee": ["userId2"],
          "status": "In Review",
          "reviewer": ["userId1"],
          "nudges": []
        }
      ]
    },
    {
      "category": "Pending for Review",
      "tasks": [
        {
          "id": "task-3",
          "title": "Design Landing Page",
          "deadline": "2024-09-15T00:00:00.000Z",
          "assignee": ["userId1"],
          "status": "In Review",
          "reviewer": ["userId2"],
          "nudges": []
        }
      ]
    }
  ]
}
```
- `500`: Server error

---
### 6. Update a Task

**Endpoint:** `PATCH api/tasks/:gid/:tid`
- **Description:** Update a task by its ID and group ID
- **Request Body:**
  - `title`: String (optional)
  - `deadline`: Date (optional)
  - `assignee`: Array of User ID ([String], optional)
  - `reviewer`: Array of User ID ([String], optional)
  - `status`: String (optional)
  - `comments`: Array of Comments (optional)
  - `nudges`: Array (optional)

**Request Example:**
```json
{
  "title": "Update Landing Page",
  "reviewer": ["userId3"],
  "status": "In Review"
}
```

**Responses:**
- `200 OK`: Task updated
```json
{
  "message": "Task updated",
  "task": {
    "_id": "taskid",
    "title": "Update Landing Page",
    "reviewer": ["userId3"],
    "status": "In Review"
    // ...other fields
  }
}
```
- `400`: Task does not exist
- `500`: Server error

---
## 💬 Chat API

### 1. Create or Get a Chat

**Endpoint:** `POST api/chats/create/:uid`
- **Description:** Create or get a chat between two users or with Nugget in a group
- **Request Body:**
  - `otherUserId`: String (required)
  - `groupId`: String (required)
  - `type`: String, either "user" or "nugget" (required)

**Request Example:**
```json
{
  "otherUserId": "userId2",
  "groupId": "groupid",
  "type": "user"
}
```

**Responses:**
- `201 OK`: Chat created
```json
// for type = user
{
    "id": "chatid1",
    "type": "user",
    "people": ["userid1", "userid2"],
    "group_id": "groupid1",
    "about": null,
    "messages": [],
    "createdAt": "date1",
    "updatedAt": "date2"
}
// for type = nugget
{
    "id": "chatid1",
    "type": "nugget",
    "people": ["userid1"],
    "group_id": "groupid1",
    "about": "userid2",
    "messages": [],
    "createdAt": "date3",
    "updatedAt": "date4"
}
```
- `200 OK`: Existing chat returned
- `422`: Invalid request
- `500`: Server error

---
### 2. Get All Chats for Current User

**Endpoint:** `GET api/chats/:gid/:uid`
- **Description:** Get all chats for the current user in a group

**Responses:**
- `200 OK`: Returns array of chats
```json
{
  "chats": [
    {
      "id": "chatid1",
      "type": "user",
      "people": ["userid1", "userid2"],
      "group_id": "groupid1",
      "about": null,
      "messages": [
        {
          "senderType": "user",
          "sender": "userid1",
          "receiver": "userid2",
          "content": "Hi",
          "timestamp": "date1"
        }
      ],
      "createdAt": "date1",
      "updatedAt": "date1"
    },
    {
      "id": "chatid2",
      "type": "nugget",
      "people": ["userid1"],
      "group_id": "groupid1",
      "about": "userid2",
      "messages": [],
      "createdAt": "date3",
      "updatedAt": "date3"
    }
  ]
}
```
- `500`: Server error

---
### 3. Get a Specific Chat

**Endpoint:** `GET api/chats/:cid`
- **Description:** Get a specific chat by chat ID

**Responses:**
- `200 OK`: Returns chat object
```json
{
  "id": "chatid1",
  "type": "user",
  "people": ["userid1", "userid2"],
  "group_id": "groupid1",
  "about": null,
  "messages": [
    {
      "senderType": "user",
      "sender": "userid1",
      "receiver": "userid2",
      "content": "Hi",
      "timestamp": "date1"
    }
  ],
  "createdAt": "date1",
  "updatedAt": "date1"
}
```
- `404`: Chat not found
- `500`: Server error

---
### 4. Send a Message (User Chat)

**Endpoint:** `POST api/chats/:cid/:uid/user`
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
```json
{
  "message": "Message sent",
  "needsRevision": false,
  "chat": {
    "id": "chatid1",
    "type": "user",
    "people": ["userid1", "userid2"],
    "group_id": "groupid1",
    "about": null,
    "messages": [
      {
        "senderType": "user",
        "sender": "userid1",
        "receiver": "userid2",
        "content": "Hey, why didn't you finish your part?",
        "timestamp": "date1"
      }
    ],
    "createdAt": "date1",
    "updatedAt": "date1"
  }
}
```
- `200 OK`: If needsRevision = true, response includes both original and suggested message. You must call `POST api/chats/:cid/:uid/confirm` to save the chosen message.
```json
{
  "needsRevision": true,
  "original": "Your idea is stupid.",
  "suggestion": "I'm not sure this idea will work well. Can we think about another approach?"
}

```
- `500`: Server error

**Note:**
- If `needsRevision = true` in the response from `POST api/chats/:cid/messages/user`, you must call `POST api/chats/:cid/messages/confirm` with the user's choice to save the message.

---
### 5. Confirm and Save User Message (After Revision)

**Endpoint:** `POST api/chats/:cid/:uid/confirm`
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
```json
{
  "message": "Message sent",
  "needsRevision": false,
  "chat": {
    "id": "chatid1",
    "type": "user",
    "people": ["userid1", "userid2"],
    "group_id": "groupid1",
    "about": null,
    "messages": [
      {
        "senderType": "user",
        "sender": "userid1",
        "receiver": "userid2",
        "content": "Hi",
        "timestamp": "date1"
      },
      {
        "senderType": "user",
        "sender": "userid1",
        "receiver": "userid2",
        "content": "You could have asked for help if you needed it.",
        "timestamp": "date2"
      }
    ],
    "createdAt": "date2",
    "updatedAt": "date2"
  }
}
```
- `500`: Server error

---
### 6. Send a Message (Nugget Chat)

**Endpoint:** `POST api/chats/:cid/:uid/nugget`
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
```json
{
  "id": "chatid2",
  "type": "nugget",
  "people": ["userid1"],
  "group_id": "groupid1",
  "about": "userid2",
  "messages": [
    {
      "senderType": "nugget",
      "sender": "userid1",
      "receiver": null,
      "content": "I'm frustrated with my teammate. What should I do?",
      "timestamp": "date1"
    },
    {
      "senderType": "nugget",
      "sender": null,
      "receiver": "userid1",
      "content": "Try starting with how you feel and focus on the shared goal of finishing the project!",
      "timestamp": "date2"
    }],
  "createdAt": "date3",
  "updatedAt": "date3"
}
```
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
```json
// non-TA related
{
  "message": "Nudge created",
  "type": "reminder",
  "group_id": "groupId1",
  "task_id": "taskId1",
  "sender": "userId1",
  "receiver": "userId2",
  "ta_email": null,
  "createdAt": "date"
}
// TA related
{
  "message": "Nudge created",
  "type": "email_ta",
  "group_id": "groupId1",
  "task_id": "taskId1",
  "sender": "userId1",
  "receiver": "userId2",
  "ta_email": "ta@gmail.com",
  "createdAt": "date"
}
```
- `422`: Invalid request
- `500`: Server error

---
### 2. Get Nudges Received by User

**Endpoint:** `GET api/nudges/:gid/:uid/received`
- **Description:** Get all nudges received by a user in a group

**Responses:**
- `200 OK`: Returns array of nudges and totalNudge
```json
{
  "nudges": [
    {
      "_id": "nudgeid1",
      "type": "reminder",
      "group_id": "groupid1",
      "task_id": "taskid1",
      "sender": "userid1",
      "receiver": "userid2",
      "ta_email": null,
      "createdAt": "date1"
    },
    {
      "_id": "nudgeid2",
      "type": "phone_call",
      "group_id": "groupid1",
      "task_id": "taskid2",
      "sender": "userid3",
      "receiver": "userid2",
      "ta_email": null,
      "createdAt": "date2"
    }
  ],
  "totalNudge": 2
}
```
- `500`: Server error

---
### 3. Get Nudges Sent by User

**Endpoint:** `GET api/nudges/:gid/:uid/sent`
- **Description:** Get all nudges sent by a user in a group

**Responses:**
- `200 OK`: Returns array of nudges and totalNudge
```json
{
  "nudges": [
    {
      "_id": "nudgeid1",
      "type": "reminder",
      "group_id": "groupid1",
      "task_id": "taskid1",
      "sender": "userid1",
      "receiver": "userid2",
      "ta_email": null,
      "createdAt": "date1"
    },
    {
      "_id": "nudgeid2",
      "type": "reminder",
      "group_id": "groupid1",
      "task_id": "taskid1",
      "sender": "userid1",
      "receiver": "userid3",
      "ta_email": null,
      "createdAt": "date2"
    }
  ],
  "totalNudge": 2
}
```
- `500`: Server error

---
### 4. Get Nudges for a Task

**Endpoint:** `GET api/nudges/:gid/:tid`
- **Description:** Get all nudges related to a specific task in a group

**Responses:**
- `200 OK`: Returns array of nudges and totalNudge
```json
{
  "nudges": [
    {
      "_id": "nudgeid1",
      "type": "reminder",
      "group_id": "groupid1",
      "task_id": "taskid1",
      "sender": "userid1",
      "receiver": "userid2",
      "ta_email": null,
      "createdAt": "date1"
    },
    {
      "_id": "nudgeid2",
      "type": "phone_call",
      "group_id": "groupid1",
      "task_id": "taskid1",
      "sender": "userid3",
      "receiver": "userid2",
      "ta_email": null,
      "createdAt": "date2"
    }
  ],
  "totalNudge": 2
}
```
- `500`: Server error