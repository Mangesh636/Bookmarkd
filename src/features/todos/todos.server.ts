import { Account, Client, ID, Query, TablesDB } from "node-appwrite";

export type Todo = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  title: string;
  description: string;
  isComplete: boolean;
  ownerId: string;
};

type AuthInput = { jwt: string };
type CreateInput = AuthInput & { title: string; description: string };
type UpdateInput = AuthInput & {
  taskId: string;
  title: string;
  description: string;
  isComplete: boolean;
};
type DeleteInput = AuthInput & { taskId: string };

function config() {
  const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
  const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;
  const databaseId = process.env.APPWRITE_DATABASE_ID;
  const tableId = process.env.APPWRITE_TODOS_TABLE_ID;

  if (!endpoint || !projectId || !apiKey || !databaseId || !tableId) {
    throw new Error(
      "Missing Appwrite environment variables. Check VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID, APPWRITE_API_KEY, APPWRITE_DATABASE_ID, and APPWRITE_TODOS_TABLE_ID.",
    );
  }

  return { endpoint, projectId, apiKey, databaseId, tableId };
}

async function currentUser(jwt: string) {
  const { endpoint, projectId } = config();
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setJWT(jwt);

  return new Account(client).get();
}

function tables() {
  const { endpoint, projectId, apiKey } = config();
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

  return new TablesDB(client);
}

async function assertOwner(taskId: string, ownerId: string) {
  const { databaseId, tableId } = config();
  const row = (await tables().getRow({
    databaseId,
    tableId,
    rowId: taskId,
  })) as Todo;

  if (row.ownerId !== ownerId) {
    throw new Error("Task not found.");
  }
}

export async function listTodoRecords(data: AuthInput): Promise<Todo[]> {
  const user = await currentUser(data.jwt);
  const { databaseId, tableId } = config();
  const response = await tables().listRows({
    databaseId,
    tableId,
    queries: [
      Query.equal("ownerId", user.$id),
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ],
  });

  return response.rows as Todo[];
}

export async function createTodoRecord(data: CreateInput): Promise<Todo> {
  const user = await currentUser(data.jwt);
  const { databaseId, tableId } = config();

  return (await tables().createRow({
    databaseId,
    tableId,
    rowId: ID.unique(),
    data: {
      title: data.title,
      description: data.description,
      isComplete: false,
      ownerId: user.$id,
    },
  })) as Todo;
}

export async function updateTodoRecord(data: UpdateInput): Promise<Todo> {
  const user = await currentUser(data.jwt);
  await assertOwner(data.taskId, user.$id);
  const { databaseId, tableId } = config();

  return (await tables().updateRow({
    databaseId,
    tableId,
    rowId: data.taskId,
    data: {
      title: data.title,
      description: data.description,
      isComplete: data.isComplete,
    },
  })) as Todo;
}

export async function deleteTodoRecord(data: DeleteInput): Promise<{ success: true }> {
  const user = await currentUser(data.jwt);
  await assertOwner(data.taskId, user.$id);
  const { databaseId, tableId } = config();

  await tables().deleteRow({
    databaseId,
    tableId,
    rowId: data.taskId,
  });

  return { success: true };
}
