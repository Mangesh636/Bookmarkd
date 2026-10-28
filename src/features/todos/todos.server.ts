import { Account, Client, ID, Query, TablesDB } from "node-appwrite";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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

type Todo = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  title: string;
  description: string;
  isComplete: boolean;
  ownerId: string;
};

function config() {
  const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
  const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;
  const databaseId = process.env.APPWRITE_DATABASE_ID;
  const tableId = process.env.APPWRITE_TODOS_TABLE_ID;
  if (!endpoint || !projectId || !apiKey || !databaseId || !tableId) {
    throw new Error("Missing Appwrite server environment variables.");
  }
  return { endpoint, projectId, apiKey, databaseId, tableId };
}

async function currentUser(jwt: string) {
  const { endpoint, projectId } = config();
  const client = new Client().setEndpoint(endpoint).setProject(projectId).setJWT(jwt);
  return new Account(client).get();
}

function tables() {
  const { endpoint, projectId, apiKey } = config();
  return new TablesDB(new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey));
}

async function assertOwner(taskId: string, ownerId: string) {
  const { databaseId, tableId } = config();
  const row = (await tables().getRow({ databaseId, tableId, rowId: taskId })) as Todo;
  if (row.ownerId !== ownerId) throw new Error("Task not found.");
}

export const listTodos = createServerFn({ method: "POST" })
  .validator(authInput)
  .handler(async ({ data }) => {
    const user = await currentUser(data.jwt);
    const { databaseId, tableId } = config();
    const response = await tables().listRows({
      databaseId,
      tableId,
      queries: [Query.equal("ownerId", user.$id), Query.orderDesc("$createdAt"), Query.limit(100)],
    });
    return response.rows as Todo[];
  });

export const createTodo = createServerFn({ method: "POST" })
  .validator(createInput)
  .handler(async ({ data }) => {
    const user = await currentUser(data.jwt);
    const { databaseId, tableId } = config();
    return (await tables().createRow({
      databaseId, tableId, rowId: ID.unique(),
      data: { title: data.title, description: data.description, isComplete: false, ownerId: user.$id },
    })) as Todo;
  });

export const updateTodo = createServerFn({ method: "POST" })
  .validator(updateInput)
  .handler(async ({ data }) => {
    const user = await currentUser(data.jwt);
    await assertOwner(data.taskId, user.$id);
    const { databaseId, tableId } = config();
    return (await tables().updateRow({
      databaseId, tableId, rowId: data.taskId,
      data: { title: data.title, description: data.description, isComplete: data.isComplete },
    })) as Todo;
  });

export const deleteTodo = createServerFn({ method: "POST" })
  .validator(deleteInput)
  .handler(async ({ data }) => {
    const user = await currentUser(data.jwt);
    await assertOwner(data.taskId, user.$id);
    const { databaseId, tableId } = config();
    await tables().deleteRow({ databaseId, tableId, rowId: data.taskId });
    return { success: true };
  });
