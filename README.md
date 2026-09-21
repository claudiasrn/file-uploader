# File Uploader

A stripped-down personal storage service — sign up, organise files into folders, upload them to cloud storage, and share a folder with anyone via an expiring link.

## Features

- Session-based authentication with Passport, sessions persisted in PostgreSQL
- Create, rename and delete folders
- Upload files to Supabase Storage with a size limit
- File detail view with name, size, type and upload time
- Downloads via short-lived signed URLs — the storage bucket is private
- Share a folder through a public link that expires after a duration you choose

## Stack

| | |
|---|---|
| Server | Express 5 |
| Views | EJS |
| Database | PostgreSQL via Prisma ORM 7 |
| Auth | Passport (local strategy), bcryptjs |
| Sessions | express-session + prisma-session-store |
| Uploads | Multer (memory storage) |
| File storage | Supabase Storage |

## Notes

Every folder and file query is scoped to the logged-in user's id inside the `where` clause, so a record belonging to someone else is indistinguishable from one that doesn't exist.

Share links authorise a single folder. The guest download route checks that the requested file belongs to the shared folder, not merely that the token is valid.

Files are stored in a private bucket. Downloads redirect to a signed URL valid for 60 seconds rather than exposing a permanent public address.