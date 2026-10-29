# Bookmark P0 setup

## Environment

Set these client-side variables in your local `.env` file and restart the dev server:

- `VITE_APPWRITE_DATABASE_ID`: the Appwrite database ID for Bookmarkd.
- `VITE_APPWRITE_BOOKMARKS_COLLECTION_ID`: the collection ID for bookmark documents.

The app uses the signed-in user's Appwrite session. Do not put an Appwrite API key in a `VITE_*` variable. In the collection permissions, allow **Create** for authenticated users (`Role.users()`). Keep collection-wide Read, Update, and Delete permissions disabled; per-document permissions grant those operations only to the bookmark owner.

## Collection attributes

Create a `bookmarks` collection in the selected database and add these string attributes:

| Attribute | Suggested size | Required |
| --- | ---: | --- |
| `ownerId` | 36 | Yes |
| `url` | 2048 | Yes |
| `title` | 200 | Yes |
| `description` | 2000 | Yes |
| `siteName` | 255 | Yes |
| `imageUrl` | 2048 | Yes |
| `faviconUrl` | 2048 | Yes |

The app writes empty strings when optional metadata is unavailable, so these attributes should accept empty values.

Enable **Document Security** for the collection. Bookmark documents are created with read, update, and delete permissions for the owning user.

Add these indexes:

- Key index on `ownerId` (supports the user's bookmark list query).
- Unique index on `ownerId` + `url` (prevents duplicate URLs for the same user and supports duplicate checks).
The unique composite index on `ownerId` + `url` also supports the duplicate-check query; if your Appwrite version asks for a separate query index, add a key index on those same attributes.

The dashboard currently loads the most recent 100 bookmarks. Metadata lookup uses Microlink as a best-effort request; if it fails, the URL still saves with a domain-based title.
