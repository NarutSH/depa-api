import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { RevenueStreamService } from './revenue-stream.service';
import { CreateRevenueStreamDto } from './dto/create-revenue-stream.dto';
import { UpdateRevenueStreamDto } from './dto/update-revenue-stream.dto';
import { UpsertRevenueTableDto } from './dto/upsert-revenue-table.dto';
import { ClearRevenueTableDto } from './dto/clear-revenue-table.dto';
import { GetRevenueTableDto } from './dto/get-revenue-table.dto';
import { RevenueTableResponseDto } from './dto/revenue-table-response.dto';

import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Revenue Stream')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('revenue-stream')
export class RevenueStreamController {
  constructor(private readonly revenueStreamService: RevenueStreamService) {}

  @Post()
  @ApiOperation({ summary: 'สร้าง Revenue Stream รายการเดียว' })
  @ApiResponse({ status: 201, description: 'สร้างสำเร็จ' })
  @ApiResponse({ status: 400, description: 'ข้อมูลไม่ถูกต้อง' })
  @ApiResponse({ status: 404, description: 'ไม่พบ Company หรือ Relations' })
  create(@Body() createRevenueStreamDto: CreateRevenueStreamDto) {
    return this.revenueStreamService.create(createRevenueStreamDto);
  }

  @Get()
  @ApiOperation({ summary: 'ค้นหา Revenue Stream ตามเงื่อนไข' })
  @ApiResponse({ 
    status: 200, 
    description: 'ค้นหาสำเร็จ',
    type: RevenueTableResponseDto
  })
  findAll(@Query() query: GetRevenueTableDto): Promise<RevenueTableResponseDto> {
    return this.revenueStreamService.findAll(query);
  }

  @Get('sources/:companyId/:year')
  @ApiOperation({ summary: 'ดึงรายการ Sources ที่มีข้อมูล' })
  @ApiParam({ name: 'companyId', description: 'Company ID' })
  @ApiParam({ name: 'year', description: 'ปี' })
  @ApiQuery({ name: 'industryTypeSlug', required: false, description: 'Industry Type Slug' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลสำเร็จ' })
  getAvailableSources(
    @Param('companyId') companyId: string,
    @Param('year') year: string,
    @Query('industryTypeSlug') industryTypeSlug?: string
  ) {
    return this.revenueStreamService.getAvailableSources(
      companyId, 
      parseInt(year), 
      industryTypeSlug
    );
  }

  @Get('stats/:companyId/:year')
  @ApiOperation({ summary: 'ดึงสถิติรายได้ตามปี' })
  @ApiParam({ name: 'companyId', description: 'Company ID' })
  @ApiParam({ name: 'year', description: 'ปี' })
  @ApiResponse({ status: 200, description: 'ดึงสถิติสำเร็จ' })
  getYearlyStats(
    @Param('companyId') companyId: string,
    @Param('year') year: string
  ) {
    return this.revenueStreamService.getYearlyStats(companyId, parseInt(year));
  }

  @Get(':id')
  @ApiOperation({ summary: 'ค้นหา Revenue Stream รายการเดียว' })
  @ApiParam({ name: 'id', description: 'Revenue Stream ID' })
  @ApiResponse({ status: 200, description: 'ค้นหาสำเร็จ' })
  @ApiResponse({ status: 404, description: 'ไม่พบข้อมูล' })
  findOne(@Param('id') id: string) {
    return this.revenueStreamService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'อัพเดต Revenue Stream รายการเดียว' })
  @ApiParam({ name: 'id', description: 'Revenue Stream ID' })
  @ApiResponse({ status: 200, description: 'อัพเดตสำเร็จ' })
  @ApiResponse({ status: 400, description: 'ข้อมูลไม่ถูกต้อง' })
  @ApiResponse({ status: 404, description: 'ไม่พบข้อมูล' })
  update(@Param('id') id: string, @Body() updateRevenueStreamDto: UpdateRevenueStreamDto) {
    return this.revenueStreamService.update(id, updateRevenueStreamDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบ Revenue Stream รายการเดียว' })
  @ApiParam({ name: 'id', description: 'Revenue Stream ID' })
  @ApiResponse({ status: 200, description: 'ลบสำเร็จ' })
  @ApiResponse({ status: 404, description: 'ไม่พบข้อมูล' })
  remove(@Param('id') id: string) {
    return this.revenueStreamService.remove(id);
  }

  @Post('upsert-table')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Upsert ตารางรายได้ทั้งหมด',
    description: 'อัพเดทตารางรายได้ทั้งหมดสำหรับ Source และ Year ที่กำหนด จะลบข้อมูลเก่าและสร้างใหม่ทั้งหมด'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'อัพเดตตารางสำเร็จ',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: { $ref: '#/components/schemas/RevenueTableResponseDto' },
        recordsProcessed: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'ข้อมูลไม่ถูกต้อง' })
  @ApiResponse({ status: 404, description: 'ไม่พบ Company' })
  upsertRevenueTable(@Body() upsertDto: UpsertRevenueTableDto) {
    return this.revenueStreamService.upsertRevenueTable(upsertDto);
  }

  @Post('clear-table')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'ลบข้อมูลตารางตาม Source และ Year',
    description: 'ลบข้อมูลรายได้ทั้งหมดที่ตรงกับ Company, Year และ Source ที่กำหนด'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'ลบข้อมูลสำเร็จ',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        deletedCount: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'ไม่พบข้อมูลที่ตรงกับเงื่อนไข' })
  clearRevenueTable(@Body() clearDto: ClearRevenueTableDto) {
    return this.revenueStreamService.clearRevenueTable(clearDto);
  }
}
