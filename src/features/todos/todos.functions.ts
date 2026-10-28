import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
	createTodoRecord,
	deleteTodoRecord,
	listTodoRecords,
	updateTodoRecord,
} from "./todos.server";

const authInput = z.object({ jwt: z.string().min(1) });
const createInput = authInput.extend({
	title: z.string().trim().min(1).max(160),
	description: z.string().trim().max(2000).default(""),
});
const updateInput = authInput.extend({
	taskId: z.string().min(1),
	title: z.string().trim().min(1).max(160),
	description: z.string().trim().max(2000),
	isComplete: z.boolean(),
});
const deleteInput = authInput.extend({ taskId: z.string().min(1) });

export const listTodos = createServerFn({ method: "POST" })
	.validator(authInput)
	.handler(({ data }) => listTodoRecords(data));

export const createTodo = createServerFn({ method: "POST" })
	.validator(createInput)
	.handler(({ data }) => createTodoRecord(data));

export const updateTodo = createServerFn({ method: "POST" })
	.validator(updateInput)
	.handler(({ data }) => updateTodoRecord(data));

export const deleteTodo = createServerFn({ method: "POST" })
	.validator(deleteInput)
	.handler(({ data }) => deleteTodoRecord(data));
