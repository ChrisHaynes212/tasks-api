import { test, expect } from "@playwright/test";

test.describe("create task", () => {
    test("can create a new task", async ({ request }) => {
        const name = "Go shopping"
        const description = "Milk, egg, bread"
        const dueAt = "2026-02-15T10:00:00Z"
        
        const response = await request.post("/tasks", {
            data: {
                "name": name,
                "description": description,
                "dueAt": dueAt
            }
        })

        expect(response).toBeOK()

        const body = await response.json()

        expect(body.id).toBeDefined()
        expect(body.name).toBe(name)
        expect(body.description).toBe(description)
        expect(new Date(body.dueAt)).toEqual(new Date(dueAt))
        expect(body.completedAt).toBeNull()
        expect(body.createdAt).toBeDefined()
    });
})

test.describe("get task by id", () => {
    const name = "Mow the grass"
    const description = "It's getting long!"
    const dueAt = "2026-02-20T12:00:00Z"
    let taskId: string

    test.beforeAll(async ({ request }) => {
        const response = await request.post("/tasks", {
            data: {
                "name": name,
                "description": description,
                "dueAt": dueAt
            }
        })

        expect(response).toBeOK()
        
        const body = await response.json()
        expect(body.id).toBeDefined()
        taskId = body.id
    })

    test("can get existing task by id", async ({ request }) => {
        const response = await request.get(`/tasks/${taskId}`)

        expect(response).toBeOK()

        const body = await response.json()
        
        expect(body.id).toBe(taskId)
        expect(body.name).toBe(name)
        expect(body.description).toBe(description)
        expect(new Date(body.dueAt)).toEqual(new Date(dueAt))
        expect(body.completedAt).toBeNull()
        expect(body.createdAt).toBeDefined()
    });
})

test.describe("get all tasks", () => {
    let incompleteTaskId: string
    let completedTaskId: string

    test.beforeAll(async ({ request }) => {
        // Create an incomplete task
        let response = await request.post("/tasks", {
            data: {
                name: "Incomplete task",
                description: "Haven't done this one yet...",
                dueAt: "2026-03-01T17:00:00Z"
            }
        })

        expect(response).toBeOK()

        let body = await response.json()
        expect(body.id).toBeDefined()
        incompleteTaskId = body.id

        // Create a task and then complete it
        response = await request.post("/tasks", {
            data: {
                name: "Completed task",
                description: "Woo! We did it!",
                dueAt: "2026-03-01T17:00:00Z"
            }
        })

        expect(response).toBeOK()

        body = await response.json()
        expect(body.id).toBeDefined()
        completedTaskId = body.id

        response = await request.patch(`/tasks/${completedTaskId}/complete`)

        expect(response).toBeOK()
    })

    test("can get all incomplete tasks", async ({ request }) => {
        const response = await request.get("/tasks")

        expect(response).toBeOK()
        
        const tasks = await response.json()
        const ids = tasks.map((task: any) => task.id)
        expect(ids).toContain(incompleteTaskId)
        expect(ids).not.toContain(completedTaskId)
    })

    test("can get all tasks including completed", async ({ request }) => {
        const response = await request.get("/tasks?includeCompleted=true")

        expect(response).toBeOK()
        
        const tasks = await response.json()
        const ids = tasks.map((task: any) => task.id)
        expect(ids).toContain(incompleteTaskId)
        expect(ids).toContain(completedTaskId)
    })
})

test.describe("complete task", () => {
    const name = "Cook dinner"
    const description = "Chicken, rice and vegetables"
    const dueAt = "2026-03-05T18:00:00Z"
    let taskId: string

    test.beforeAll(async ({ request }) => {
        const response = await request.post("/tasks", {
            data: {
                "name": name,
                "description": description,
                "dueAt": dueAt
            }
        })

        expect(response).toBeOK()
        
        const body = await response.json()
        expect(body.id).toBeDefined()
        taskId = body.id
    })

    test("can complete task", async ({ request }) => {
        const response = await request.patch(`/tasks/${taskId}/complete`)

        expect(response).toBeOK()

        const body = await response.json()

        expect(body.id).toBe(taskId)
        expect(body.name).toBe(name)
        expect(body.description).toBe(description)
        expect(new Date(body.dueAt)).toEqual(new Date(dueAt))
        expect(body.completedAt).toBeDefined()
        expect(body.createdAt).toBeDefined()
    })
})

test.describe("delete tasks", () => {
    let taskId: string

    test.beforeAll(async ({ request }) => {
        const response = await request.post("/tasks", {
            data: {
                name: "Put the recycling out",
                description: "Cardboard, glass and plastic",
                dueAt: "2026-02-16T20:00:00Z"
            }
        })

        expect(response).toBeOK()

        const body = await response.json()
        expect(body.id).toBeDefined()
        taskId = body.id
    })

    test("can delete task", async ({ request }) => {
        const response = await request.delete(`/tasks/${taskId}`)
        
        expect(response).toBeOK()
    })
})