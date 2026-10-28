# Appwrite Todo setup

The dashboard uses Appwrite TablesDB through TanStack Start server functions. The API key must stay on the server.

## Environment

Set these variables in your local .env and deployment environment:
- VITE_APPWRITE_ENDPOINT
- VITE_APPWRITE_PROJECT_ID
- APPWRITE_API_KEY
- APPWRITE_DATABASE_ID
- APPWRITE_TODOS_TABLE_ID

The API key must not use a VITE_ prefix. Give it only rows.read and rows.write scopes.

## Table schema

Create a table in Appwrite Console, then configure these columns:

| Key | Type | Required |
| --- | --- | --- |
| title | Varchar (160 or larger) | Yes |
| description | Text | No |
| isComplete | Boolean | Yes |
| ownerId | Varchar | Yes |

Use the IDs from the Console for APPWRITE_DATABASE_ID and APPWRITE_TODOS_TABLE_ID.

## Ownership

The server validates a short-lived Appwrite JWT on each operation, derives the owner from the validated account, filters list results by ownerId, and checks ownership before updating or deleting. Do not trust a user ID supplied by the browser.
