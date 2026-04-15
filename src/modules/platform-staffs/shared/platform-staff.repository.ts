import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlatformStaff } from '../../../entities/platformStaff.entity';

@Injectable()
export class PlatformStaffRepository {
  constructor(
    @InjectRepository(PlatformStaff)
    private readonly repository: Repository<PlatformStaff>,
  ) {}

  async findById(id: string): Promise<PlatformStaff | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findOne(phone: string): Promise<PlatformStaff | null> {
    return this.repository.findOne({ where: { phone } });
  }

  async save(platformStaff: PlatformStaff): Promise<PlatformStaff> {
    return this.repository.save(platformStaff);
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

  async findAll(
    select: (keyof PlatformStaff)[],
    skip: number,
    take: number,
  ): Promise<[PlatformStaff[], number]> {
    return this.repository.findAndCount({
      select,
      skip,
      take,
    });
  }

  async findWithPagination(
    skip: number,
    take: number,
  ): Promise<[PlatformStaff[], number]> {
    return this.repository.findAndCount({
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  async searchByPhone(phone: string): Promise<PlatformStaff[]> {
    return this.repository
      .createQueryBuilder('platformStaff')
      .where('platformStaff.phone LIKE :phone', { phone: `%${phone}%` })
      .getMany();
  }
}
