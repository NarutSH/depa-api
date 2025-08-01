# ---- STAGE 1: Base Dependencies ----
# Stage นี้มีหน้าที่เดียวคือติดตั้ง Dependencies ทั้งหมดและสร้าง Prisma Client ให้สมบูรณ์
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
# (แก้ไข) คัดลอกโฟลเดอร์ prisma ทั้งหมด (รวม migrations)
COPY prisma ./prisma/
RUN npm install --legacy-peer-deps
RUN npx prisma generate

# ---- STAGE 2: Builder ----
# Stage นี้ใช้ผลลัพธ์จาก 'base' เพื่อ build แอปพลิเคชัน
FROM base AS builder
COPY . .
RUN npm run build

# ---- STAGE 3: Production ----
# Stage สุดท้ายจะใช้ node-alpine ที่เล็ก และคัดลอกเฉพาะสิ่งที่จำเป็นมาเท่านั้น
FROM node:20-alpine AS production
WORKDIR /app
COPY package.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/generated ./generated
# (แก้ไข) คัดลอกโฟลเดอร์ prisma ทั้งหมด (ที่มี schema.prisma และ migrations) เข้าไปด้วย
COPY --from=base /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]
