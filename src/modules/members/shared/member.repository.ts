import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../../../entities/member.entity';

@Injectable()
export class MemberRepository {
  constructor(
    @InjectRepository(Member)
    private readonly repository: Repository<Member>,
  ) {}

  async findById(id: string): Promise<Member | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['userCredential'],
    });
  }

  async findOne(phone: string): Promise<Member | null> {
    return this.repository.findOne({
      where: { phone },
      relations: ['userCredential'],
    });
  }

  async save(member: Member): Promise<Member> {
    return this.repository.save(member);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async isActive(id: string): Promise<boolean> {
    return this.repository
      .findOne({
        where: { id },
        select: ['isActive'],
      })
      .then((member) => member?.isActive || false);
  }

  async updateActive(id: string, isActive: boolean): Promise<void> {
    await this.repository.update(id, { isActive });
  }

  async findAll(
    select: (keyof Member)[],
    skip: number,
    take: number,
  ): Promise<[Member[], number]> {
    return this.repository.findAndCount({
      select,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }
}
