# Admin Authentication

ระบบ Admin Authentication สำหรับ DEPA API ที่แยกออกจากระบบ TechHunt login

## Features

- ✅ Admin signup (สมัครสมาชิก admin)
- ✅ Admin signin (เข้าสู่ระบบ admin)
- ✅ JWT token-based authentication
- ✅ Refresh token support
- ✅ Password hashing with bcrypt
- ✅ Admin-only route protection
- ✅ Admin logout functionality
- ✅ Separate database tables for admin data

## API Endpoints

### 1. Admin Signup

```http
POST /auth/admin/signup
Content-Type: application/json

{
  "username": "admin123",
  "email": "admin@depa.com",
  "password": "SecureAdminPass123!"
}
```

**Response (201 Created):**

```json
{
  "admin": {
    "id": "uuid-here",
    "username": "admin123",
    "email": "admin@depa.com"
  },
  "access_token": "jwt-token-here",
  "refresh_token": "refresh-token-here"
}
```

### 2. Admin Signin

```http
POST /auth/admin/signin
Content-Type: application/json

{
  "usernameOrEmail": "admin123",
  "password": "SecureAdminPass123!"
}
```

**Response (200 OK):**

```json
{
  "admin": {
    "id": "uuid-here",
    "username": "admin123",
    "email": "admin@depa.com"
  },
  "access_token": "jwt-token-here",
  "refresh_token": "refresh-token-here"
}
```

### 3. Refresh Token (รองรับ admin)

```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh-token-here"
}
```

### 4. Admin Profile (Admin Only)

```http
GET /auth/admin/profile
Authorization: Bearer {admin-access-token}
```

### 5. Logout (รองรับ admin)

```http
POST /auth/logout
Authorization: Bearer {access-token}
Content-Type: application/json

{
  "refreshToken": "refresh-token-here"
}
```

## JWT Token Payload

Admin tokens จะมี payload ดังนี้:

```json
{
  "id": "admin-uuid",
  "email": "admin@depa.com",
  "sessiontoken": null,
  "memberid": null,
  "userType": "admin",
  "role": "admin",
  "isAdmin": true
}
```

## Protected Routes

สำหรับ routes ที่ต้องการ admin access เท่านั้น:

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';

@UseGuards(JwtAuthGuard, AdminGuard)
@Get('admin-only-route')
async adminOnlyFunction() {
  // Only admin users can access this
}
```

## Database Schema

ระบบใช้ 2 tables แยกสำหรับ admin:

### UserAdmin Model

```prisma
model UserAdmin {
  id        String   @id @default(uuid()) @db.Uuid
  email     String   @unique
  username  String   @unique
  password  String   // bcrypt hashed
  createdAt DateTime @default(now()) @db.Timestamptz()
  updatedAt DateTime @updatedAt @db.Timestamptz()

  refreshTokens AdminRefreshToken[]
}
```

### AdminRefreshToken Model

```prisma
model AdminRefreshToken {
  id        String     @id @default(uuid()) @db.Uuid
  token     String     @unique
  adminId   String     @db.Uuid
  admin     UserAdmin  @relation(fields: [adminId], references: [id], onDelete: Cascade)
  expiresAt DateTime   @db.Timestamptz()
  issuedAt  DateTime   @default(now()) @db.Timestamptz()
  revokedAt DateTime?  @db.Timestamptz()

  @@index([adminId])
  @@index([token])
}
```

## Testing

### ทดสอบการทำงานผ่าน Swagger UI:

http://localhost:8000/docs

### ทดสอบด้วย curl:

```bash
# 1. Admin Signup
curl -X POST http://localhost:8000/auth/admin/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testadmin",
    "email": "test@admin.com",
    "password": "TestPass123!"
  }'

# 2. Admin Signin
curl -X POST http://localhost:8000/auth/admin/signin \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "testadmin",
    "password": "TestPass123!"
  }'

# 3. Admin Profile (Admin Only)
curl -X GET http://localhost:8000/auth/admin/profile \
  -H "Authorization: Bearer {admin-access-token}"

# 4. Refresh Token
curl -X POST http://localhost:8000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "admin-refresh-token"
  }'

# 5. Logout
curl -X POST http://localhost:8000/auth/logout \
  -H "Authorization: Bearer {access-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "refresh-token"
  }'
```

## Security Features

- ✅ Bcrypt password hashing (salt rounds: 12)
- ✅ JWT token expiration (1 day)
- ✅ Refresh token expiration (7 days)
- ✅ Unique username and email validation
- ✅ Admin role verification via AdminGuard
- ✅ Token revocation support
- ✅ Separate database tables for security isolation
- ✅ Admin and regular user token separation

## Error Responses

- `409 Conflict` - Admin with email/username already exists
- `401 Unauthorized` - Invalid credentials / Invalid or expired tokens
- `400 Bad Request` - Invalid input data
- `403 Forbidden` - Admin access required (when regular user tries to access admin routes)

## Implementation Summary

### ✅ สิ่งที่เสร็จแล้ว:

1. **Admin Authentication Service**:

   - `adminSignup()` - สร้าง admin account พร้อม hash password
   - `adminSignin()` - ตรวจสอบ credentials และสร้าง JWT
   - `generateAdminRefreshToken()` - สร้าง refresh token สำหรับ admin
   - `revokeAdminRefreshToken()` - ยกเลิก refresh token
   - `revokeAllAdminRefreshTokens()` - ยกเลิก token ทั้งหมดของ admin

2. **Admin Authentication Controller**:

   - `POST /auth/admin/signup` - สมัครสมาชิก admin
   - `POST /auth/admin/signin` - เข้าสู่ระบบ admin
   - `GET /auth/admin/profile` - ดูข้อมูล admin (admin only)

3. **Database Schema**:

   - `UserAdmin` table สำหรับเก็บข้อมูล admin
   - `AdminRefreshToken` table สำหรับเก็บ refresh tokens ของ admin

4. **JWT Strategy Enhancement**:

   - รองรับการ validate ทั้ง User และ UserAdmin tokens
   - แยกแยะ admin tokens ด้วย `isAdmin` flag

5. **Admin Security Guard**:

   - `AdminGuard` สำหรับป้องกัน routes ที่ต้องการ admin access เท่านั้น

6. **Enhanced Refresh Token System**:

   - รองรับ refresh token ทั้งสำหรับ user และ admin
   - แยก database tables สำหรับความปลอดภัย

7. **Enhanced Logout System**:
   - รองรับการ logout ทั้ง admin และ regular user

ระบบ Admin Authentication พร้อมใช้งานแล้ว! 🎉
