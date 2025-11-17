// NOTE FOR EVERYTHING @BE
// can u guys give the endpoint that already preprocess the data into these formats
// so FE can directly use them HEHE THANKIES

// @ BE: dummy data for member lists in create task modal
export const MEMBER_LISTS = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];

// @ BE: dummy data for comments in task details
export const SAMPLE_COMMENTS = [
    {
        id: '1',
        user: 'Alice',
        text: 'Looking forward to the task!',
        timestamp: '2024-10-01T10:00:00Z',
    },
    {
        id: '2',
        user: 'Bob',
        text: 'Please review the latest updates.',
        timestamp: '2024-10-02T12:30:00Z',
    }
]

// @BE: dummy data for dashboard
// input: userid/username
export const MY_TASKS = (userId: string) => [
    {
        category: 'To Do',
        tasks: [{
            id: "task-1",
            title: "Design Landing Page",
            deadline: "2024-09-15",
            assignedTo: userId,
            status: "To Do",
            reviewer: "Not Assigned",
            nudgeCount: 1,
        }, {
            id: "task-11",
            title: "Design Landing Page",
            deadline: "2024-09-15",
            assignedTo: userId,
            status: "To Do",
            reviewer: "Not Assigned",
            nudgeCount: 0,
        }]
    },
    {
        category: 'To Review',
        tasks: [{
            id: "task-2",
            title: "Task 2 Title",
            deadline: "2024-09-15",
            assignedTo: "Bob",
            status: "In Review",
            reviewer: userId,
            nudgeCount: 2,
        }]
    },
    {
        category: 'Pending for Review',
        tasks: [{
            id: "task-3",
            title: "Design Landing Page",
            deadline: "2024-09-15",
            assignedTo: userId,
            status: "In Review",
            reviewer: "Charlie",
            nudgeCount: 0,
        }]
    }
]

export const ALL_TASKS = (userId: string) => [
    {
        title: "Implement user authentication",
        deadline: "Fri, 24 Oct 2025",
        user: "Alice",
        status: "To Do",
        reviewer: null,
        nudgeCount: 2,
    }, 
    {
        title: "Implement user authentication",
        deadline: "Fri, 24 Oct 2025",
        user: "Alice",
        status: "Revise",
        reviewer: "Bob",
        nudgeCount: 3,
    },
    {  
        title: "Design database schema",
        deadline: "Mon, 27 Oct 2025",
        user: "Bob",
        status: "In Review",
        reviewer: "Eve",
        nudgeCount: 1,
    }, 
    {
        title: "Design the chatbox",
        deadline: "Wed, 29 Oct 2025",
        user: "Charlie",
        status: "In Review",
        reviewer: "Not Assigned",
        nudgeCount: 0,
    },
    {
        title: "Implement user authentication",
        deadline: "Thu, 30 Oct 2025",
        user: "Alice",
        status: "To Do",
        reviewer: null,
        nudgeCount: 0,
    }, 
]