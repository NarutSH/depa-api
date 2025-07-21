# Admin Authentication API

This document describes the admin authentication endpoints for the DEPA API.

## Admin Authentication Endpoints

### 1. Admin Signup

**POST** `/auth/admin/signup`

Create a new admin account.

**Request Body:**

```json
{
  "email": "admin@depa.go.th",
  "username": "admin_user",
  "password": "SecurePassword123!"
}
```

**Response:**

```json
{
  "admin": {
    "id": "uuid",
    "username": "admin_user",
    "email": "admin@depa.go.th"
  },
  "access_token": "jwt_token",
  "refresh_token": "refresh_token"
}
```

**Status Codes:**

- `201`: Admin successfully registered
- `409`: Email or username already exists

### 2. Admin Signin

**POST** `/auth/admin/signin`

Login with admin credentials.

**Request Body:**

```json
{
  "emailOrUsername": "admin@depa.go.th",
  "password": "SecurePassword123!"
}
```

**Response:**

```json
{
  "admin": {
    "id": "uuid",
    "username": "admin_user",
    "email": "admin@depa.go.th"
  },
  "access_token": "jwt_token",
  "refresh_token": "refresh_token"
}
```

**Status Codes:**

- `200`: Admin successfully logged in
- `401`: Invalid credentials

### 3. Get Admin Profile

**GET** `/auth/admin/me`

Get current admin profile information.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "id": "uuid",
  "username": "admin_user",
  "email": "admin@depa.go.th",
  "createdAt": "2025-07-21T10:00:00.000Z",
  "updatedAt": "2025-07-21T10:00:00.000Z"
}
```

**Status Codes:**

- `200`: Profile retrieved successfully
- `401`: Unauthorized (not admin or invalid token)

### 4. Admin Logout

**POST** `/auth/admin/logout`

Logout and revoke admin refresh token.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "refreshToken": "refresh_token"
}
```

**Response:**

```json
{
  "success": true
}
```

**Status Codes:**

- `200`: Admin logged out successfully
- `401`: Unauthorized

### 5. Admin Logout All

**POST** `/auth/admin/logout-all`

Logout from all devices by revoking all admin refresh tokens.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true
}
```

**Status Codes:**

- `200`: All admin sessions logged out successfully
- `401`: Unauthorized

### 6. Refresh Token

**POST** `/auth/refresh`

Refresh access token using refresh token (supports both user and admin tokens).

**Request Body:**

```json
{
  "refreshToken": "refresh_token"
}
```

**Response:**

```json
{
  "access_token": "new_jwt_token",
  "refresh_token": "new_refresh_token"
}
```

**Status Codes:**

- `200`: Token successfully refreshed
- `401`: Invalid refresh token

## Security Features

- **Password Requirements**: Minimum 8 characters with uppercase, lowercase, numbers, and symbols
- **Username Validation**: Minimum 3 characters
- **Email Validation**: Valid email format required
- **Token Expiration**: Access tokens expire in 1 day, refresh tokens in 7 days
- **Separate Admin Tables**: Admin data stored separately from regular users for security
- **Admin Guard**: Specific guard to protect admin-only endpoints
- **bcrypt Hashing**: Passwords hashed with 12 salt rounds

## Token Payload

Admin JWT tokens contain:

```json
{
  "id": "admin_uuid",
  "username": "admin_user",
  "email": "admin@depa.go.th",
  "isAdmin": true,
  "iat": 1642781234,
  "exp": 1642867634
}
```

## Database Schema

### UserAdmin Table

- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `username`: String (Unique)
- `password`: String (bcrypt hashed)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### AdminRefreshToken Table

- `id`: UUID (Primary Key)
- `token`: String
- `adminId`: UUID (Foreign Key to UserAdmin)
- `expiresAt`: DateTime
- `issuedAt`: DateTime
- `revokedAt`: DateTime (nullable)
