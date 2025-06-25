# Revenue Stream Module

## Overview

Revenue Stream Module เป็นระบบจัดการข้อมูลรายได้ของบริษัทในรูปแบบตาราง โดยสามารถแยกข้อมูลตามปี (Year), แหล่งรายได้ (Source), หมวดหมู่ (Category), ช่องทาง (Channel), และส่วนแบ่ง (Segment)

## Database Schema

### RevenueStream Model
```prisma
model RevenueStream {
  id   String @id @default(uuid()) @db.Uuid
  year Int

  industryTypeSlug String
  industry         Industry @relation(fields: [industryTypeSlug], references: [slug])

  categorySlug String
  category     Category @relation(fields: [categorySlug, industryTypeSlug], references: [slug, industrySlug])

  sourceSlug String
  source     Source @relation(fields: [sourceSlug, industryTypeSlug], references: [slug, industrySlug])

  channelSlug String
  channel     Channel @relation(fields: [channelSlug, industryTypeSlug], references: [slug, industrySlug])

  segmentSlug String
  segment     Segment @relation(fields: [segmentSlug, industryTypeSlug], references: [slug, industrySlug])

  percent    Float  // เปอร์เซ็นต์ของ cell นี้
  ctrPercent Float  // เปอร์เซ็นต์รวมของ row
  value      Float? // มูลค่าเงิน (optional)

  companyId         String  @db.Uuid
  companyJuristicId String
  company           Company @relation(fields: [companyId], references: [id], onDelete: Restrict)

  createdAt DateTime @default(now()) @db.Timestamptz()
  updatedAt DateTime @default(now()) @updatedAt @db.Timestamptz()

  @@unique([companyId, year, industryTypeSlug, categorySlug, sourceSlug, channelSlug, segmentSlug])
}
```

## ความสัมพันธ์ (Relations)

- **Industry**: อุตสาหกรรม (เช่น game, animation)
- **Category**: หมวดหมู่ (เช่น Console/Handheld, Browser PC Games)
- **Source**: แหล่งรายได้ (เช่น IP Owner, Distribution)
- **Channel**: ช่องทาง (เช่น Local, Abroad)
- **Segment**: ส่วนแบ่ง (เช่น Download and Retail, In-Game Purchase)
- **Company**: บริษัทเจ้าของข้อมูล

## API Endpoints

### 1. CRUD Operations
- `GET /revenue-stream` - ดึงข้อมูลตารางตามเงื่อนไข
- `GET /revenue-stream/:id` - ดึงข้อมูลรายการเดียว
- `POST /revenue-stream` - สร้างรายการใหม่
- `PATCH /revenue-stream/:id` - อัพเดทรายการเดียว
- `DELETE /revenue-stream/:id` - ลบรายการเดียว

### 2. Table Operations (ฟีเจอร์หลัก)
- `POST /revenue-stream/upsert-table` - อัพเดทตารางทั้งหมด
- `POST /revenue-stream/clear-table` - ลบข้อมูลตาราง

### 3. Utility Operations
- `GET /revenue-stream/sources/:companyId/:year` - ดึงรายการ Sources
- `GET /revenue-stream/stats/:companyId/:year` - ดึงสถิติรายได้

## Key Features

### 1. Upsert Table (ฟีเจอร์หลัก)
- อัพเดทตารางทั้งหมดในครั้งเดียว
- ใช้ Database Transaction เพื่อความปลอดภัย
- ลบข้อมูลเก่าและสร้างใหม่ทั้งหมด
- Validation ความถูกต้องของ Relations

### 2. Clear Table
- ลบข้อมูลตาม Source และ Year
- ป้องกันการลบข้อมูลที่ไม่มีอยู่

### 3. Data Validation
- ตรวจสอบความสัมพันธ์ของ Industry, Category, Source, Channel, Segment
- Validation ข้อมูล Input ด้วย class-validator
- Error Handling ที่ครอบคลุม

### 4. Statistics & Analytics
- สถิติรายได้ตามปี
- การแยกข้อมูลตาม Source
- การนับจำนวนรายการ

## DTOs

### CreateRevenueStreamDto
```typescript
{
  year: number;
  industryTypeSlug: string;
  categorySlug: string;
  sourceSlug: string;
  channelSlug: string;
  segmentSlug: string;
  percent: number;
  ctrPercent: number;
  value?: number;
  companyId: string;
  companyJuristicId: string;
}
```

### UpsertRevenueTableDto
```typescript
{
  year: number;
  industryTypeSlug: string;
  sourceSlug: string;
  companyId: string;
  companyJuristicId: string;
  tableData: RevenueStreamCellDto[];
}
```

### RevenueStreamCellDto
```typescript
{
  categorySlug: string;
  segmentSlug: string;
  channelSlug: string;
  percent: number;
  ctrPercent: number;
  value?: number;
}
```

## Usage Examples

### Frontend Integration
```typescript
// อัพเดทตารางทั้งหมด
const upsertData = {
  year: 2024,
  industryTypeSlug: 'game',
  sourceSlug: 'ip-owner',
  companyId: 'company-uuid',
  companyJuristicId: '1234567890123',
  tableData: [
    {
      categorySlug: 'console-handheld',
      segmentSlug: 'download-and-retail',
      channelSlug: 'local',
      percent: 25.5,
      ctrPercent: 100,
      value: 1000000
    }
    // ... more data
  ]
};

const response = await fetch('/revenue-stream/upsert-table', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  },
  body: JSON.stringify(upsertData)
});
```

## Error Handling

- **400 Bad Request**: ข้อมูล Input ไม่ถูกต้อง หรือ Relations ไม่มีอยู่
- **404 Not Found**: ไม่พบ Company หรือข้อมูลที่ต้องการ
- **401 Unauthorized**: ไม่มีสิทธิ์เข้าถึง
- **500 Internal Server Error**: ข้อผิดพลาดของระบบ

## Security

- ใช้ JWT Authentication
- Validation ข้อมูล Input
- Database Transaction สำหรับ Upsert operations
- Foreign Key Constraints

## Performance Considerations

- ใช้ Database Index สำหรับ Query ที่ใช้บ่อย
- Parallel operations สำหรับ Validation
- Efficient Query patterns
- Transaction สำหรับ Bulk operations

## Files Structure

```
src/revenue-stream/
├── dto/
│   ├── create-revenue-stream.dto.ts
│   ├── update-revenue-stream.dto.ts
│   ├── upsert-revenue-table.dto.ts
│   ├── clear-revenue-table.dto.ts
│   ├── get-revenue-table.dto.ts
│   ├── revenue-table-response.dto.ts
│   └── index.ts
├── examples/
│   └── api-usage-examples.md
├── revenue-stream.controller.ts
├── revenue-stream.service.ts
├── revenue-stream.module.ts
└── README.md
```

## Dependencies

- `@nestjs/common`
- `@nestjs/swagger`
- `class-validator`
- `class-transformer`
- `prisma`

## Testing

สำหรับการทดสอบ API สามารถใช้ Swagger UI ที่ `/api-docs` หรือใช้ Postman/Insomnia ตามตัวอย่างใน `examples/api-usage-examples.md` 