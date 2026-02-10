# Video Streaming Backend (Java + Spring Boot)

This is a production-ready backend for the Video Streaming application, built with Java 17 and Spring Boot 3.

## Prerequisites

- Java 17 or higher
- Maven 3.8+
- MongoDB instance
- Cloudinary Account

## Setup

1. **Navigate to the directory:**
   ```bash
   cd backend-java
   ```

2. **Configure Environment Variables:**
   You can either set these in your OS environment or update `src/main/resources/application.properties` directly (not recommended for secrets).
   
   Required variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `CLOUDINARY_CLOUD_NAME`: Cloudinary Cloud Name
   - `CLOUDINARY_API_KEY`: Cloudinary API Key
   - `CLOUDINARY_API_SECRET`: Cloudinary API Secret
   - `ACCESS_TOKEN_SECRET`: Secret for JWT Access Token
   - `ACCESS_TOKEN_EXPIRY`: Expiry for Access Token (in ms, e.g., 86400000)
   - `REFRESH_TOKEN_SECRET`: Secret for JWT Refresh Token
   - `REFRESH_TOKEN_EXPIRY`: Expiry for Refresh Token (in ms, e.g., 864000000)

3. **Build the Project:**
   ```bash
   mvn clean install
   ```

4. **Run the Application:**
   ```bash
   mvn spring-boot:run
   ```

## Architecture

- **Layered Architecture**: Controller -> Service -> Repository
- **Security**: Spring Security with JWT Authentication (Stateless)
- **Database**: MongoDB with Spring Data
- **Storage**: Cloudinary for Video/Image storage
- **Validation**: Jakarta Validation API
- **Error Handling**: Global Exception Handler with standardized error responses

## API Endpoints

### Authentication
- `POST /api/v1/users/register`: Register a new user (Multipart)
- `POST /api/v1/users/login`: Login
- `GET /api/v1/users/current-user`: Get current user profile

### Videos
- `GET /api/v1/videos`: Get all published videos
- `POST /api/v1/videos`: Upload a video (Multipart)
- `GET /api/v1/videos/{videoId}`: Get video details
- `PATCH /api/v1/videos/toggle/publish/{videoId}`: Toggle publish status

### Comments
- `GET /api/v1/comments/{videoId}`: Get comments for a video
- `POST /api/v1/comments/{videoId}`: Add a comment to a video
- `PATCH /api/v1/comments/c/{commentId}`: Update a comment
- `DELETE /api/v1/comments/c/{commentId}`: Delete a comment

### Likes
- `POST /api/v1/likes/toggle/v/{videoId}`: Toggle like for a video
- `POST /api/v1/likes/toggle/c/{commentId}`: Toggle like for a comment
- `POST /api/v1/likes/toggle/t/{tweetId}`: Toggle like for a tweet

### Tweets
- `POST /api/v1/tweets`: Create a tweet
- `GET /api/v1/tweets/user/{userId}`: Get user's tweets
- `PATCH /api/v1/tweets/{tweetId}`: Update a tweet
- `DELETE /api/v1/tweets/{tweetId}`: Delete a tweet

### Playlists
- `POST /api/v1/playlist`: Create a playlist
- `GET /api/v1/playlist/{playlistId}`: Get a playlist by ID
- `PATCH /api/v1/playlist/add/{videoId}/{playlistId}`: Add video to playlist
- `PATCH /api/v1/playlist/remove/{videoId}/{playlistId}`: Remove video from playlist
- `DELETE /api/v1/playlist/{playlistId}`: Delete a playlist
- `PATCH /api/v1/playlist/{playlistId}`: Update playlist details
- `GET /api/v1/playlist/user/{userId}`: Get user's playlists

### Subscriptions
- `GET /api/v1/subscriptions/c/{channelId}`: Toggle subscription to a channel
- `GET /api/v1/subscriptions/u/{subscriberId}`: Get channels subscribed to by user
