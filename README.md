User Authentication and Management API

This document details the available REST endpoints for user creation, authentication, and retrieval.

🚀 Getting Started

The application is assumed to be running locally using the following command:

npm run dev


All API paths listed below are relative to the running server.

🔒 Authentication Endpoints

Method

Path

Description

POST

/create-users

Registers a new user with a username and password.

POST

/login

Authenticates a user and returns their ID upon success.

1. Register User (POST /create-users)

Creates a new user account.

Request Body

Field

Type

Description

username

string

The desired unique username.

password

string

The user's secure password.

{
    "username": "newuser123",
    "password": "securepassword123"
}


Success Response (HTTP 201 Created)

Returns the ID of the newly created user.

{
    "userId": "66f7f2b1c3d4e5f6a7b8c9d0"
}


2. User Login (POST /login)

Authenticates an existing user.

Request Body

The same structure as /create-users.

{
    "username": "existinguser",
    "password": "correctpassword"
}


Success Response (HTTP 200 OK)

{
    "message": "Login successful",
    "userId": "66f7f2b1c3d4e5f6a7b8c9d0"
}


Error Responses (HTTP 400 Bad Request / HTTP 404 Not Found)

{
    "message": "Username not found"
}


{
    "message": "Password incorrect"
}


{
    "message": "Username and password are required"
}


👤 User Management Endpoint

3. Get User Details (GET /get-users/:userid)

Retrieves the details of a specific user by their ID.

Path Parameters

Parameter

Type

Description

userid

string

The unique MongoDB ObjectId of the user to retrieve.

Success Response (HTTP 200 OK)

Returns the user's document, including their hashed password (note: in production, the password field should be excluded).

{
    "_id": "66f7f2b1c3d4e5f6a7b8c9d0",
    "username": "existinguser",
    "password": "hashed_password_string_here"
}


Error Response (HTTP 500 Internal Server Error)

This typically occurs if the provided userid path parameter is not a valid MongoDB ObjectId format.

{
    "status": 500,
    "message": "Invalid ObjectId: 12345",
    "stack": {}
}
