# Appwrite Todo setup

The dashboard uses Appwrite TablesDB through TanStack Start server functions. The server SDK automatically creates the dedicated Todo table and any missing Todo columns when a Todo operation runs.

## Environment

Set these variables in your local `.env` and deployment environment:

- `VITE_APPWRITE_ENDPOINT`
- `VITE_APPWRITE_PROJECT_ID`
- `APPWRITE_API_KEY`
- `APPWRITE_DATABASE_ID`
- `APPWRITE_TODOS_TABLE_ID=todos`

The API key must not use a `VITE_` prefix and must remain server-side. Give it the scopes needed to create tables and columns and manage rows: `tables.write`, `columns.write`, `indexes.write`, `rows.read`, and `rows.write`. Appwrite may also require read scopes for schema inspection; grant only the corresponding scopes shown by your Console when prompted.

## Automatic schema setup

On the first Todo list/create/update/delete request, the server checks whether the configured table exists. If it does not, the server creates a dedicated table with these columns:

| Key | Type | Required |
| --- | --- | --- |
| `title` | Varchar (160 characters) | Yes |
| `description` | Text | No |
| `isComplete` | Boolean (default false when creating the table) | Yes |
| `ownerId` | Varchar (64 characters) | Yes |

If the table already exists, the server adds any missing Todo columns. It refuses to use a table that has unrelated required columns, because those columns would make Todo row creation fail.

**Important:** Set `APPWRITE_TODOS_TABLE_ID=todos` (or another unused table ID). Do not point it at the existing metadata table with columns such as `key`, `type`, `required`, and `size`. The server will not delete or repurpose that table. Schema initialization requires an API key with the appropriate scopes. Existing rows are not deleted.

## Ownership

The server validates an Appwrite JWT on each operation, derives the owner from the validated account, filters list results by `ownerId`, and checks ownership before updating or deleting. Do not trust a user ID supplied by the browser.
