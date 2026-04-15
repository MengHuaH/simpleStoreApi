import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityStaff } from '../../../entities/communityStaff.entity';

@Injectable()
export class CommunityStaffRepository {
  constructor(
    @InjectRepository(CommunityStaff)
    private readonly repository: Repository<CommunityStaff>,
  ) {}

  async findById(id: string): Promise<CommunityStaff | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findOne(phone: string): Promise<CommunityStaff | null> {
    return this.repository.findOne({ where: { phone } });
  }

  async save(communityStaff: CommunityStaff): Promise<CommunityStaff> {
    return this.repository.save(communityStaff);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async isActive(id: string): Promise<boolean> {
    const result = await this.repository.findOne({
      where: { id, isActive: true },
      select: ['id'],
    });
    return !!result;
  }

  async findAll(): Promise<CommunityStaff[]> {
    return this.repository.find();
  }

  async findWithPagination(
    skip: number,
    take: number,
  ): Promise<[CommunityStaff[], number]> {
    return this.repository.findAndCount({
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  async searchByPhone(phone: string): Promise<CommunityStaff[]> {
    return this.repository
      .createQueryBuilder('communityStaff')
      .where('communityStaff.phone LIKE :phone', { phone: `%${phone}%` })
      .getMany();
  }
}