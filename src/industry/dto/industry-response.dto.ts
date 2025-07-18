import { ApiProperty } from '@nestjs/swagger';
import { Industry, Skill, Tag, Channel } from 'generated/prisma';

export class IndustryResponseDto {
  @ApiProperty({
    description: 'Industry unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Industry name',
    example: 'Game Development',
  })
  name: string;

  @ApiProperty({
    description: 'Industry slug (URL friendly identifier)',
    example: 'game-development',
  })
  slug: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-05-11T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-05-11T10:30:00Z',
  })
  updatedAt: Date;
}

// Additional response interfaces for return types

/**
 * Industry with basic select fields
 */
export interface IndustryBasicResponse {
  name: string;
  slug: string;
  color: string;
  description: string;
  image: string;
}

/**
 * Industry with skills relation
 */
export interface IndustryWithSkills extends Industry {
  Skill: Array<{
    title: string;
    slug: string;
    industrySlug: string;
  }>;
}

/**
 * Industry with all relations
 */
export interface IndustryWithAllRelations extends Industry {
  Category: any[];
  Channel: any[];
  Source: any[];
  Segment: any[];
  Skill: any[];
  Tag: any[];
  LookingFor: any[];
}

/**
 * Skill with industry relation
 */
export interface SkillWithIndustry extends Skill {
  industry: {
    name: string;
    slug: string;
    color?: string;
  };
}

/**
 * Tag with industry relation
 */
export interface TagWithIndustry extends Tag {
  industry: {
    name: string;
    slug: string;
    color?: string;
  };
}

/**
 * Channel with industry relation
 */
export interface ChannelWithIndustry extends Channel {
  industry: {
    name: string;
    slug: string;
    color?: string;
  };
}

/**
 * Response types for find methods
 */
export type SkillResponse = {
  title: string;
  slug: string;
  industry: {
    name: string;
    slug: string;
    color: string;
  };
};

export type TagResponse = {
  name: string;
  slug: string;
  industry: {
    name: string;
    slug: string;
    color: string;
  };
};

export type ChannelResponse = {
  name: string;
  slug: string;
  industry: {
    name: string;
    slug: string;
    color: string;
  };
};

// Enhanced DTOs for better Swagger documentation

export class IndustryBasicResponseDto {
  @ApiProperty({
    description: 'Industry name',
    example: 'Information Technology',
  })
  name: string;

  @ApiProperty({
    description: 'URL-friendly slug of the industry',
    example: 'information-technology',
  })
  slug: string;

  @ApiProperty({
    description: 'Color code associated with the industry',
    example: '#3498db',
  })
  color: string;

  @ApiProperty({
    description: 'Description of the industry',
    example:
      'Technology sector including software development, IT services, and digital solutions',
  })
  description: string;

  @ApiProperty({
    description: 'Image URL for the industry',
    example: 'https://example.com/industry-image.jpg',
  })
  image: string;
}

export class IndustryWithAllRelationsDto {
  @ApiProperty({
    description: 'Unique identifier of the industry',
    example: 'industry-123-uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the industry',
    example: 'Information Technology',
  })
  name: string;

  @ApiProperty({
    description: 'URL-friendly slug of the industry',
    example: 'information-technology',
  })
  slug: string;

  @ApiProperty({
    description: 'Color code associated with the industry',
    example: '#3498db',
  })
  color: string;

  @ApiProperty({
    description: 'Description of the industry',
    example:
      'Technology sector including software development, IT services, and digital solutions',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Image URL for the industry',
    example: 'https://example.com/industry-image.jpg',
    required: false,
  })
  image?: string;

  @ApiProperty({
    description: 'Date when the industry was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the industry was last updated',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Industry categories',
    type: 'array',
    items: { type: 'object' },
    example: [
      { id: '1', name: 'Software Development', slug: 'software-development' },
      { id: '2', name: 'Data Science', slug: 'data-science' },
    ],
  })
  Category: any[];

  @ApiProperty({
    description: 'Industry channels',
    type: 'array',
    items: { type: 'object' },
    example: [
      { id: '1', name: 'Web Development', slug: 'web-development' },
      { id: '2', name: 'Mobile Development', slug: 'mobile-development' },
    ],
  })
  Channel: any[];

  @ApiProperty({
    description: 'Industry sources',
    type: 'array',
    items: { type: 'object' },
    example: [
      { id: '1', name: 'Online Learning', slug: 'online-learning' },
      { id: '2', name: 'Bootcamp', slug: 'bootcamp' },
    ],
  })
  Source: any[];

  @ApiProperty({
    description: 'Industry segments',
    type: 'array',
    items: { type: 'object' },
    example: [
      { id: '1', name: 'Enterprise', slug: 'enterprise' },
      { id: '2', name: 'Startup', slug: 'startup' },
    ],
  })
  Segment: any[];

  @ApiProperty({
    description: 'Industry skills',
    type: 'array',
    items: { type: 'object' },
    example: [
      { id: '1', title: 'JavaScript', slug: 'javascript' },
      { id: '2', title: 'Python', slug: 'python' },
    ],
  })
  Skill: any[];

  @ApiProperty({
    description: 'Industry tags',
    type: 'array',
    items: { type: 'object' },
    example: [
      { id: '1', name: 'Programming', slug: 'programming' },
      { id: '2', name: 'Development', slug: 'development' },
    ],
  })
  Tag: any[];

  @ApiProperty({
    description: 'Looking for options',
    type: 'array',
    items: { type: 'object' },
    example: [
      { id: '1', name: 'Full-time Job', slug: 'full-time-job' },
      { id: '2', name: 'Freelance', slug: 'freelance' },
    ],
  })
  LookingFor: any[];
}

export class SkillResponseDto {
  @ApiProperty({
    description: 'Skill title',
    example: 'JavaScript Programming',
  })
  title: string;

  @ApiProperty({
    description: 'Skill slug',
    example: 'javascript-programming',
  })
  slug: string;

  @ApiProperty({
    description: 'Associated industry information',
    type: 'object',
    properties: {
      name: { type: 'string', example: 'Information Technology' },
      slug: { type: 'string', example: 'information-technology' },
      color: { type: 'string', example: '#3498db' },
    },
  })
  industry: {
    name: string;
    slug: string;
    color: string;
  };
}

export class SkillWithIndustryDto {
  @ApiProperty({
    description: 'Unique identifier of the skill',
    example: 'skill-123-uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Skill title',
    example: 'JavaScript Programming',
  })
  title: string;

  @ApiProperty({
    description: 'URL-friendly slug of the skill',
    example: 'javascript-programming',
  })
  slug: string;

  @ApiProperty({
    description: 'Industry ID this skill belongs to',
    example: 'industry-123-uuid',
  })
  industryId: string;

  @ApiProperty({
    description: 'Date when the skill was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the skill was last updated',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Associated industry information',
    type: 'object',
    properties: {
      name: { type: 'string', example: 'Information Technology' },
      slug: { type: 'string', example: 'information-technology' },
      color: { type: 'string', example: '#3498db' },
    },
  })
  industry: {
    name: string;
    slug: string;
    color?: string;
  };
}

export class TagResponseDto {
  @ApiProperty({
    description: 'Tag name',
    example: 'Programming',
  })
  name: string;

  @ApiProperty({
    description: 'Tag slug',
    example: 'programming',
  })
  slug: string;

  @ApiProperty({
    description: 'Associated industry information',
    type: 'object',
    properties: {
      name: { type: 'string', example: 'Information Technology' },
      slug: { type: 'string', example: 'information-technology' },
      color: { type: 'string', example: '#3498db' },
    },
  })
  industry: {
    name: string;
    slug: string;
    color: string;
  };
}

export class TagWithIndustryDto {
  @ApiProperty({
    description: 'Unique identifier of the tag',
    example: 'tag-123-uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Tag name',
    example: 'Programming',
  })
  name: string;

  @ApiProperty({
    description: 'URL-friendly slug of the tag',
    example: 'programming',
  })
  slug: string;

  @ApiProperty({
    description: 'Industry ID this tag belongs to',
    example: 'industry-123-uuid',
  })
  industryId: string;

  @ApiProperty({
    description: 'Date when the tag was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the tag was last updated',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Associated industry information',
    type: 'object',
    properties: {
      name: { type: 'string', example: 'Information Technology' },
      slug: { type: 'string', example: 'information-technology' },
      color: { type: 'string', example: '#3498db' },
    },
  })
  industry: {
    name: string;
    slug: string;
    color?: string;
  };
}

export class ChannelResponseDto {
  @ApiProperty({
    description: 'Channel name',
    example: 'Web Development',
  })
  name: string;

  @ApiProperty({
    description: 'Channel slug',
    example: 'web-development',
  })
  slug: string;

  @ApiProperty({
    description: 'Associated industry information',
    type: 'object',
    properties: {
      name: { type: 'string', example: 'Information Technology' },
      slug: { type: 'string', example: 'information-technology' },
      color: { type: 'string', example: '#3498db' },
    },
  })
  industry: {
    name: string;
    slug: string;
    color: string;
  };
}

export class ChannelWithIndustryDto {
  @ApiProperty({
    description: 'Unique identifier of the channel',
    example: 'channel-123-uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Channel name',
    example: 'Web Development',
  })
  name: string;

  @ApiProperty({
    description: 'URL-friendly slug of the channel',
    example: 'web-development',
  })
  slug: string;

  @ApiProperty({
    description: 'Industry ID this channel belongs to',
    example: 'industry-123-uuid',
  })
  industryId: string;

  @ApiProperty({
    description: 'Date when the channel was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the channel was last updated',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Associated industry information',
    type: 'object',
    properties: {
      name: { type: 'string', example: 'Information Technology' },
      slug: { type: 'string', example: 'information-technology' },
      color: { type: 'string', example: '#3498db' },
    },
  })
  industry: {
    name: string;
    slug: string;
    color?: string;
  };
}
