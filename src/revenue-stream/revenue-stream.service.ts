import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryUtilsService } from 'src/utils/services/query-utils.service';
import { CreateRevenueStreamDto } from './dto/create-revenue-stream.dto';
import { UpdateRevenueStreamDto } from './dto/update-revenue-stream.dto';
import { UpsertRevenueTableDto } from './dto/upsert-revenue-table.dto';
import { ClearRevenueTableDto } from './dto/clear-revenue-table.dto';
import { GetRevenueTableDto } from './dto/get-revenue-table.dto';
import { RevenueTableResponseDto } from './dto/revenue-table-response.dto';

@Injectable()
export class RevenueStreamService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryUtilsService: QueryUtilsService,
  ) {}

  /**
   * สร้าง RevenueStream รายการเดียว
   */
  async create(createRevenueStreamDto: CreateRevenueStreamDto) {
    try {
      // ตรวจสอบว่า Company มีอยู่หรือไม่
      const company = await this.prismaService.company.findUnique({
        where: { id: createRevenueStreamDto.companyId }
      });

      if (!company) {
        throw new NotFoundException('Company not found');
      }

      // ตรวจสอบว่า relations มีอยู่หรือไม่
      await this.validateRelations(createRevenueStreamDto);

      const revenueStream = await this.prismaService.revenueStream.create({
        data: createRevenueStreamDto,
        include: {
          industry: true,
          category: true,
          source: true,
          channel: true,
          segment: true,
          company: {
            select: {
              id: true,
              nameTh: true,
              nameEn: true,
              juristicId: true
            }
          }
        }
      });

      return revenueStream;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Revenue stream with these parameters already exists');
      }
      throw error;
    }
  }

  /**
   * ค้นหา RevenueStream ทั้งหมดตามเงื่อนไข
   */
  async findAll(query: GetRevenueTableDto): Promise<RevenueTableResponseDto> {
    const where: any = {
      companyId: query.companyId,
      year: query.year,
    };

    if (query.industryTypeSlug) {
      where.industryTypeSlug = query.industryTypeSlug;
    }

    if (query.sourceSlug) {
      where.sourceSlug = query.sourceSlug;
    }

    const [revenueStreams, totalCount] = await Promise.all([
      this.prismaService.revenueStream.findMany({
        where,
        include: {
          industry: {
            select: { name: true, slug: true }
          },
          category: {
            select: { name: true, slug: true }
          },
          source: {
            select: { name: true, slug: true }
          },
          channel: {
            select: { name: true, slug: true }
          },
          segment: {
            select: { name: true, slug: true }
          }
        },
        orderBy: [
          { sourceSlug: 'asc' },
          { categorySlug: 'asc' },
          { segmentSlug: 'asc' },
          { channelSlug: 'asc' }
        ]
      }),
      this.prismaService.revenueStream.count({ where })
    ]);

    // สรุป Sources
    const sourcesMap = new Map();
    revenueStreams.forEach(item => {
      const sourceKey = item.sourceSlug;
      if (!sourcesMap.has(sourceKey)) {
        sourcesMap.set(sourceKey, {
          slug: item.sourceSlug,
          name: item.source?.name || item.sourceSlug,
          itemCount: 0
        });
      }
      sourcesMap.get(sourceKey).itemCount++;
    });

    return {
      year: query.year,
      companyId: query.companyId,
      revenueStreams,
      totalItems: totalCount,
      sourceCount: sourcesMap.size,
      sources: Array.from(sourcesMap.values())
    };
  }

  /**
   * ค้นหา RevenueStream รายการเดียว
   */
  async findOne(id: string) {
    const revenueStream = await this.prismaService.revenueStream.findUnique({
      where: { id },
      include: {
        industry: true,
        category: true,
        source: true,
        channel: true,
        segment: true,
        company: {
          select: {
            id: true,
            nameTh: true,
            nameEn: true,
            juristicId: true
          }
        }
      }
    });

    if (!revenueStream) {
      throw new NotFoundException('Revenue stream not found');
    }

    return revenueStream;
  }

  /**
   * อัพเดต RevenueStream รายการเดียว
   */
  async update(id: string, updateRevenueStreamDto: UpdateRevenueStreamDto) {
    try {
      // ตรวจสอบว่า record มีอยู่หรือไม่
      await this.findOne(id);

      // ตรวจสอบ relations ถ้ามีการเปลี่ยนแปลง
      if (Object.keys(updateRevenueStreamDto).some(key => 
        ['industryTypeSlug', 'categorySlug', 'sourceSlug', 'channelSlug', 'segmentSlug'].includes(key)
      )) {
        await this.validateRelations(updateRevenueStreamDto as any);
      }

      const revenueStream = await this.prismaService.revenueStream.update({
        where: { id },
        data: updateRevenueStreamDto,
        include: {
          industry: true,
          category: true,
          source: true,
          channel: true,
          segment: true,
          company: {
            select: {
              id: true,
              nameTh: true,
              nameEn: true,
              juristicId: true
            }
          }
        }
      });

      return revenueStream;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Revenue stream with these parameters already exists');
      }
      throw error;
    }
  }

  /**
   * ลบ RevenueStream รายการเดียว
   */
  async remove(id: string) {
    await this.findOne(id); // ตรวจสอบว่ามีอยู่หรือไม่

    await this.prismaService.revenueStream.delete({
      where: { id }
    });

    return { message: 'Revenue stream deleted successfully' };
  }

  /**
   * Upsert ตารางทั้งหมด - ฟีเจอร์หลักสำหรับอัพเดทตาราง
   */
  async upsertRevenueTable(upsertDto: UpsertRevenueTableDto) {
    const { year, industryTypeSlug, sourceSlug, companyId, companyJuristicId, tableData } = upsertDto;

    try {
      // ตรวจสอบ Company
      const company = await this.prismaService.company.findUnique({
        where: { id: companyId }
      });

      if (!company) {
        throw new NotFoundException('Company not found');
      }

      // ใช้ transaction เพื่อความปลอดภัย
      const result = await this.prismaService.$transaction(async (tx) => {
        // ลบข้อมูลเก่าที่ตรงกับเงื่อนไข
        await tx.revenueStream.deleteMany({
          where: {
            companyId,
            year,
            industryTypeSlug,
            sourceSlug
          }
        });

        // สร้างข้อมูลใหม่
        const createPromises = tableData.map(cellData => 
          tx.revenueStream.create({
            data: {
              year,
              industryTypeSlug,
              sourceSlug,
              companyId,
              companyJuristicId,
              categorySlug: cellData.categorySlug,
              segmentSlug: cellData.segmentSlug,
              channelSlug: cellData.channelSlug,
              percent: cellData.percent,
              ctrPercent: cellData.ctrPercent,
              value: cellData.value
            }
          })
        );

        const createdRecords = await Promise.all(createPromises);
        return createdRecords;
      });

      // ดึงข้อมูลที่สร้างใหม่พร้อม relations
      const updatedData = await this.findAll({
        year,
        companyId,
        industryTypeSlug,
        sourceSlug
      });

      return {
        message: 'Revenue table updated successfully',
        data: updatedData,
        recordsProcessed: result.length
      };

    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException('Invalid foreign key reference. Please check your data.');
      }
      throw error;
    }
  }

  /**
   * ลบข้อมูลตารางตาม Source และ Year
   */
  async clearRevenueTable(clearDto: ClearRevenueTableDto) {
    const { year, sourceSlug, companyId } = clearDto;

    // ตรวจสอบว่ามีข้อมูลหรือไม่
    const existingCount = await this.prismaService.revenueStream.count({
      where: {
        companyId,
        year,
        sourceSlug
      }
    });

    if (existingCount === 0) {
      throw new NotFoundException('No revenue stream data found for the specified criteria');
    }

    // ลบข้อมูล
    const deleteResult = await this.prismaService.revenueStream.deleteMany({
      where: {
        companyId,
        year,
        sourceSlug
      }
    });

    return {
      message: 'Revenue table cleared successfully',
      deletedCount: deleteResult.count
    };
  }

  /**
   * ดึงรายการ Sources ที่มีข้อมูลในปีและบริษัทที่กำหนด
   */
  async getAvailableSources(companyId: string, year: number, industryTypeSlug?: string) {
    const where: any = {
      companyId,
      year
    };

    if (industryTypeSlug) {
      where.industryTypeSlug = industryTypeSlug;
    }

    const sources = await this.prismaService.revenueStream.groupBy({
      by: ['sourceSlug'],
      where,
      _count: {
        id: true
      }
    });

    // ดึงข้อมูล Source names
    const sourceDetails = await Promise.all(
      sources.map(async (item) => {
        const source = await this.prismaService.source.findFirst({
          where: { 
            slug: item.sourceSlug,
            industrySlug: industryTypeSlug || undefined
          },
          select: { name: true, slug: true }
        });

        return {
          slug: item.sourceSlug,
          name: source?.name || item.sourceSlug,
          recordCount: item._count.id
        };
      })
    );

    return sourceDetails;
  }

  /**
   * ดึงสถิติรายได้ตามปี
   */
  async getYearlyStats(companyId: string, year: number) {
    const stats = await this.prismaService.revenueStream.aggregate({
      where: {
        companyId,
        year
      },
      _sum: {
        percent: true,
        value: true
      },
      _avg: {
        percent: true,
        value: true
      },
      _count: {
        id: true
      }
    });

    const sourceBreakdown = await this.prismaService.revenueStream.groupBy({
      by: ['sourceSlug'],
      where: {
        companyId,
        year
      },
      _sum: {
        percent: true,
        value: true
      },
      _count: {
        id: true
      }
    });

    return {
      year,
      companyId,
      totalRecords: stats._count.id,
      totalPercent: stats._sum.percent || 0,
      totalValue: stats._sum.value || 0,
      averagePercent: stats._avg.percent || 0,
      averageValue: stats._avg.value || 0,
      sourceBreakdown
    };
  }

  /**
   * ตรวจสอบ Relations ว่ามีอยู่จริงหรือไม่
   */
  private async validateRelations(data: Partial<CreateRevenueStreamDto>) {
    const validationPromises = [];

    if (data.industryTypeSlug) {
      validationPromises.push(
        this.prismaService.industry.findUnique({
          where: { slug: data.industryTypeSlug }
        }).then(result => {
          if (!result) throw new BadRequestException(`Industry '${data.industryTypeSlug}' not found`);
        })
      );
    }

    if (data.categorySlug && data.industryTypeSlug) {
      validationPromises.push(
        this.prismaService.category.findFirst({
          where: { 
            slug: data.categorySlug,
            industrySlug: data.industryTypeSlug
          }
        }).then(result => {
          if (!result) throw new BadRequestException(`Category '${data.categorySlug}' not found for industry '${data.industryTypeSlug}'`);
        })
      );
    }

    if (data.sourceSlug && data.industryTypeSlug) {
      validationPromises.push(
        this.prismaService.source.findFirst({
          where: { 
            slug: data.sourceSlug,
            industrySlug: data.industryTypeSlug
          }
        }).then(result => {
          if (!result) throw new BadRequestException(`Source '${data.sourceSlug}' not found for industry '${data.industryTypeSlug}'`);
        })
      );
    }

    if (data.channelSlug && data.industryTypeSlug) {
      validationPromises.push(
        this.prismaService.channel.findFirst({
          where: { 
            slug: data.channelSlug,
            industrySlug: data.industryTypeSlug
          }
        }).then(result => {
          if (!result) throw new BadRequestException(`Channel '${data.channelSlug}' not found for industry '${data.industryTypeSlug}'`);
        })
      );
    }

    if (data.segmentSlug && data.industryTypeSlug) {
      validationPromises.push(
        this.prismaService.segment.findFirst({
          where: { 
            slug: data.segmentSlug,
            industrySlug: data.industryTypeSlug
          }
        }).then(result => {
          if (!result) throw new BadRequestException(`Segment '${data.segmentSlug}' not found for industry '${data.industryTypeSlug}'`);
        })
      );
    }

    await Promise.all(validationPromises);
  }
}
