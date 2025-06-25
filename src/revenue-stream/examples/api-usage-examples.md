# Revenue Stream API Usage Examples

## 1. ดึงข้อมูลตารางรายได้ (GET)

```typescript
// ดึงข้อมูลทั้งหมดของบริษัทในปี 2024
const response = await fetch('/revenue-stream?year=2024&companyId=company-uuid');
const data = await response.json();

// ดึงข้อมูลเฉพาะ Source
const response = await fetch('/revenue-stream?year=2024&companyId=company-uuid&sourceSlug=ip-owner');
const data = await response.json();
```

## 2. อัพเดทตารางทั้งหมด (Upsert)

```typescript
const tableData = [
  {
    categorySlug: 'console-handheld',
    segmentSlug: 'download-and-retail',
    channelSlug: 'local',
    percent: 25.5,
    ctrPercent: 100,
    value: 1000000
  },
  {
    categorySlug: 'console-handheld',
    segmentSlug: 'download-and-retail',
    channelSlug: 'abroad',
    percent: 74.5,
    ctrPercent: 100,
    value: 3000000
  },
  {
    categorySlug: 'browser-pc-games',
    segmentSlug: 'in-game-purchase',
    channelSlug: 'local',
    percent: 30,
    ctrPercent: 100,
    value: 500000
  }
];

const upsertData = {
  year: 2024,
  industryTypeSlug: 'game',
  sourceSlug: 'ip-owner',
  companyId: 'company-uuid',
  companyJuristicId: '1234567890123',
  tableData: tableData
};

const response = await fetch('/revenue-stream/upsert-table', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  },
  body: JSON.stringify(upsertData)
});

const result = await response.json();
console.log(result.message); // "Revenue table updated successfully"
```

## 3. ลบข้อมูลตาราง (Clear)

```typescript
const clearData = {
  year: 2024,
  sourceSlug: 'ip-owner',
  companyId: 'company-uuid'
};

const response = await fetch('/revenue-stream/clear-table', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  },
  body: JSON.stringify(clearData)
});

const result = await response.json();
console.log(`ลบข้อมูล ${result.deletedCount} รายการ`);
```

## 4. ดึงรายการ Sources ที่มีข้อมูล

```typescript
const response = await fetch('/revenue-stream/sources/company-uuid/2024?industryTypeSlug=game');
const sources = await response.json();

// Result:
// [
//   { slug: 'ip-owner', name: 'IP Owner', recordCount: 15 },
//   { slug: 'distribution', name: 'Distribution', recordCount: 8 }
// ]
```

## 5. ดึงสถิติรายได้

```typescript
const response = await fetch('/revenue-stream/stats/company-uuid/2024');
const stats = await response.json();

// Result:
// {
//   year: 2024,
//   companyId: 'company-uuid',
//   totalRecords: 23,
//   totalPercent: 2300,
//   totalValue: 15000000,
//   averagePercent: 43.5,
//   averageValue: 652173.9,
//   sourceBreakdown: [...]
// }
```

## 6. React Frontend Integration Example

```jsx
import React, { useState, useEffect } from 'react';

const RevenueTable = ({ companyId, year, sourceSlug }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ดึงข้อมูลตาราง
  const fetchTableData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/revenue-stream?year=${year}&companyId=${companyId}&sourceSlug=${sourceSlug}`
      );
      const data = await response.json();
      setTableData(data.revenueStreams);
    } catch (error) {
      console.error('Error fetching table data:', error);
    } finally {
      setLoading(false);
    }
  };

  // อัพเดทตาราง
  const updateTable = async (newTableData) => {
    setLoading(true);
    try {
      const upsertData = {
        year,
        industryTypeSlug: 'game',
        sourceSlug,
        companyId,
        companyJuristicId: '1234567890123',
        tableData: newTableData
      };

      const response = await fetch('/revenue-stream/upsert-table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(upsertData)
      });

      if (response.ok) {
        await fetchTableData(); // รีเฟรชข้อมูล
        alert('อัพเดทตารางสำเร็จ');
      }
    } catch (error) {
      console.error('Error updating table:', error);
      alert('เกิดข้อผิดพลาดในการอัพเดท');
    } finally {
      setLoading(false);
    }
  };

  // ลบข้อมูลตาราง
  const clearTable = async () => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลทั้งหมด?')) {
      setLoading(true);
      try {
        const response = await fetch('/revenue-stream/clear-table', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            year,
            sourceSlug,
            companyId
          })
        });

        if (response.ok) {
          setTableData([]);
          alert('ลบข้อมูลสำเร็จ');
        }
      } catch (error) {
        console.error('Error clearing table:', error);
        alert('เกิดข้อผิดพลาดในการลบข้อมูล');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [companyId, year, sourceSlug]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Revenue Table - {sourceSlug}</h2>
      <button onClick={clearTable}>Clear Table</button>
      
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Segment</th>
            <th>Channel</th>
            <th>Percent</th>
            <th>CTR Percent</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item) => (
            <tr key={item.id}>
              <td>{item.category?.name}</td>
              <td>{item.segment?.name}</td>
              <td>{item.channel?.name}</td>
              <td>{item.percent}%</td>
              <td>{item.ctrPercent}%</td>
              <td>{item.value?.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RevenueTable;
```

## 7. Error Handling

```typescript
try {
  const response = await fetch('/revenue-stream/upsert-table', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer your-jwt-token'
    },
    body: JSON.stringify(upsertData)
  });

  if (!response.ok) {
    const error = await response.json();
    
    switch (response.status) {
      case 400:
        console.error('Bad Request:', error.message);
        // Handle validation errors
        break;
      case 404:
        console.error('Not Found:', error.message);
        // Handle missing company/relations
        break;
      case 401:
        console.error('Unauthorized');
        // Redirect to login
        break;
      default:
        console.error('Server Error:', error.message);
    }
    return;
  }

  const result = await response.json();
  console.log('Success:', result);
} catch (error) {
  console.error('Network Error:', error);
}
```

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/revenue-stream` | ดึงข้อมูลตารางตามเงื่อนไข |
| GET | `/revenue-stream/:id` | ดึงข้อมูลรายการเดียว |
| GET | `/revenue-stream/sources/:companyId/:year` | ดึงรายการ Sources |
| GET | `/revenue-stream/stats/:companyId/:year` | ดึงสถิติรายได้ |
| POST | `/revenue-stream` | สร้างรายการใหม่ |
| POST | `/revenue-stream/upsert-table` | อัพเดทตารางทั้งหมด |
| POST | `/revenue-stream/clear-table` | ลบข้อมูลตาราง |
| PATCH | `/revenue-stream/:id` | อัพเดทรายการเดียว |
| DELETE | `/revenue-stream/:id` | ลบรายการเดียว | 