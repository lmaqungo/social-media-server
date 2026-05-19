# Social media backend

express.js RESTFUL api for the Brainrot social media application.

## 📄 Features

### Auth

- Google OAuth method initializes a new user into the database, using the associated display photo and username as the data entries.
- Additional ‘guest login’ auth method that uses a CustomStrategy to authorize the session with a pre-generated ‘guest’ user.

### Error-Handling

- Custom Error classes NotFoundError, ValidationError, UnauthorizedError are defined which are thrown in the routes when appropriate. An error handling middleware responds to the errors by sending a  server response to the client that corresponds to the particular error.

### Server routing

- Robust CRUD logic built for performance: each route contains error-handling and authentication operations.

### Supabase Integration

- Image attachments are all uploaded into a Supabase file bucket, and the attachment URL is returned and saved into the database.

## 🧰 Languages and tools

[![languages and tools](https://skillicons.dev/icons?i=ts,prisma,supabase,express)](https://skillicons.dev)

## 🧠 Project Insights

The back and forth development of the app has made it clear that my brain is more oriented towards the data-driven and logical characteristics of back-end development, and as a result will be the type of development that I will seek out.
