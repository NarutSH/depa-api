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
