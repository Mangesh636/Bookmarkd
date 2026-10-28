import { Account, AppwriteException, Client, ID, Query, TablesDB } from "node-appwrite";

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

const TODO_COLUMNS = {
  title: { type: "varchar", size: 160, required: true },
  description: { type: "text", required: false },
  isComplete: { type: "boolean", required: true },
  ownerId: { type: "varchar", size: 64, required: true },
} as const;

function config() {
  const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
  const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;
  const databaseId = process.env.APPWRITE_DATABASE_ID;
  // Use a dedicated table ID. Do not point this at an unrelated table.
  const tableId = process.env.APPWRITE_TODOS_TABLE_ID || "todos";

  if (!endpoint || !projectId || !apiKey || !databaseId) {
    throw new Error(
      "Missing Appwrite environment variables. Check VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID, APPWRITE_API_KEY, and APPWRITE_DATABASE_ID.",
    );
  }

  return { endpoint, projectId, apiKey, databaseId, tableId };
}

function tables() {
  const { endpoint, projectId, apiKey } = config();
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

  return new TablesDB(client);
}

/**
 * Ensure the Todo table exists and has the columns this feature expects.
 * This is idempotent: repeated calls only create missing schema resources.
 */
async function ensureTodoTable() {
  const { databaseId, tableId } = config();
  const db = tables();

  try {
    await db.getTable({ databaseId, tableId });
  } catch (error) {
    if (!(error instanceof AppwriteException) || error.code !== 404) {
      throw error;
    }

    // Use a JSON REST request for initial table creation. Some node-appwrite
    // SDK versions serialize nested createTable columns incorrectly, causing
    // Appwrite to receive the request without its required "columns" field.
    const { endpoint, projectId, apiKey } = config();
    const response = await fetch(
      `${endpoint.endsWith("/") ? endpoint.slice(0, -1) : endpoint}/tablesdb/${encodeURIComponent(databaseId)}/tables`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": projectId,
          "X-Appwrite-Key": apiKey,
        },
        body: JSON.stringify({
          tableId,
          name: "Todos",
          columns: [
            { key: "title", type: "varchar", size: 160, required: true },
            { key: "description", type: "text", required: false },
            { key: "isComplete", type: "boolean", required: true },
            { key: "ownerId", type: "varchar", size: 64, required: true },
          ],
          indexes: [{ key: "ownerId_index", type: "key", columns: ["ownerId"] }],
        }),
      },
    );

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;
      throw new Error(
        errorBody?.message ??
          `Failed to create Appwrite Todo table (HTTP ${response.status}).`,
      );
    }
    return;
  }

  const result = await db.listColumns({ databaseId, tableId });
  const existingKeys = new Set(result.columns.map((column) => column.key));
  const requiredSchemaKeys = new Set(Object.keys(TODO_COLUMNS));
  const systemKeys = new Set(["$id", "$createdAt", "$updatedAt"]);

  // Don't mutate a table that clearly belongs to another feature. In
  // particular, required unrelated columns would make Todo row creation fail.
  const unrelatedRequiredColumns = result.columns.filter(
    (column) =>
      column.required &&
      !requiredSchemaKeys.has(column.key) &&
      !systemKeys.has(column.key),
  );

  if (unrelatedRequiredColumns.length > 0) {
    throw new Error(
      `The Appwrite table "${tableId}" has unrelated required columns (${unrelatedRequiredColumns.map((column) => column.key).join(", ")}). Set APPWRITE_TODOS_TABLE_ID=todos (or another unused table ID) to let the app create a dedicated Todo table. The API key needs tables.write and columns.write scopes.`,
    );
  }

  if (!existingKeys.has("title")) {
    await db.createVarcharColumn({
      databaseId,
      tableId,
      key: "title",
      size: 160,
      required: true,
    });
  }
  if (!existingKeys.has("description")) {
    await db.createTextColumn({
      databaseId,
      tableId,
      key: "description",
      required: false,
    });
  }
  if (!existingKeys.has("isComplete")) {
    await db.createBooleanColumn({
      databaseId,
      tableId,
      key: "isComplete",
      required: true,
    });
  }
  if (!existingKeys.has("ownerId")) {
    await db.createVarcharColumn({
      databaseId,
      tableId,
      key: "ownerId",
      size: 64,
      required: true,
    });
  }

  const indexResult = await db.listIndexes({ databaseId, tableId });
  // Appwrite SDK/API versions have exposed index columns under different
  // field names. Check the key too, because the table-creation request may
  // already have created this index even if its column field isn't populated
  // in the list response.
  const indexes = indexResult.indexes as Array<{
    key?: string;
    columns?: string[];
    attributes?: string[];
  }>;
  const hasOwnerIndex = indexes.some(
    (index) =>
      index.key === "ownerId_index" ||
      index.columns?.includes("ownerId") ||
      index.attributes?.includes("ownerId"),
  );
  if (!hasOwnerIndex) {
    await db.createIndex({
      databaseId,
      tableId,
      key: "ownerId_index",
      type: "key",
      columns: ["ownerId"],
    });
  }
}

async function currentUser(jwt: string) {
  const { endpoint, projectId } = config();
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setJWT(jwt);

  return new Account(client).get();
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
  await ensureTodoTable();
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
  await ensureTodoTable();
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
  await ensureTodoTable();
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
  await ensureTodoTable();
  await assertOwner(data.taskId, user.$id);
  const { databaseId, tableId } = config();

  await tables().deleteRow({
    databaseId,
    tableId,
    rowId: data.taskId,
  });

  return { success: true };
}
