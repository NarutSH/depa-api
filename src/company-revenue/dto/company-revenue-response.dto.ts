import { CompanyRevenue } from 'generated/prisma';

export interface CompanyRevenueWithCompany extends CompanyRevenue {
  company: {
    juristicId: string;
    nameTh: string;
    nameEn: string;
  };
}

export interface GetAllCompanyRevenuesResponse {
  data: CompanyRevenueWithCompany[];
  total: number;
  page: number;
  limit: number;
  message: string;
}

export interface GetCompanyRevenuesByCompanyIdResponse {
  data: CompanyRevenueWithCompany[];
  total: number;
  page: number;
  limit: number;
  message: string;
}
