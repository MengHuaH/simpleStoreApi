import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCredential } from '@/entities/userCredential.entity';
import { CredentialTypeEnum, SubjectTypeEnum } from '@/entities/enums';
import { Member } from '@/entities/member.entity';
import { PlatformStaff } from '@/entities/platformStaff.entity';
import { CommunityStaff } from '@/entities/communityStaff.entity';

@Injectable()
export class PasskeyService {
  constructor(
    @InjectRepository(UserCredential)
    private readonly userCredentialRepository: Repository<UserCredential>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(PlatformStaff)
    private readonly platformStaffRepository: Repository<PlatformStaff>,
    @InjectRepository(CommunityStaff)
    private readonly communityStaffRepository: Repository<CommunityStaff>,
  ) {}

  /**
   * 验证Passkey登录
   */
  async verifyPasskeyLogin(
    phone: string,
    passkeyData: any,
    subjectType: SubjectTypeEnum,
  ): Promise<{ user: any; token: string }> {
    // 1. 根据手机号查找用户
    const user = await this.findUserByPhone(phone, subjectType);
    if (!user) {
      throw new Error('用户不存在');
    }

    // 2. 查找用户的Passkey凭证
    const passkeyCredential = await this.userCredentialRepository.findOne({
      where: {
        [this.getUserField(subjectType)]: { id: user.id },
        subjectType,
        credentialType: CredentialTypeEnum.PassKey,
      },
    });

    if (!passkeyCredential) {
      throw new Error('用户未绑定Passkey');
    }

    // 3. 验证Passkey数据（简化验证，实际项目需要完整验证）
    const isValid = await this.verifyPasskeyAssertion(passkeyData, passkeyCredential.credential);
    if (!isValid) {
      throw new Error('Passkey验证失败');
    }

    // 4. 生成JWT token
    const token = await this.generateToken(user, subjectType);

    return { user, token };
  }

  /**
   * 验证Passkey断言（简化版）
   */
  private async verifyPasskeyAssertion(assertion: any, storedCredential: string): Promise<boolean> {
    try {
      // 在实际项目中，这里需要完整的WebAuthn验证逻辑
      // 包括验证签名、挑战、来源等
      
      // 简化验证：检查credentialId是否匹配
      const storedData = JSON.parse(storedCredential);
      return assertion.credentialId === storedData.credentialId;
    } catch (error) {
      return false;
    }
  }

  /**
   * 根据手机号查找用户
   */
  private async findUserByPhone(phone: string, subjectType: SubjectTypeEnum): Promise<any> {
    switch (subjectType) {
      case SubjectTypeEnum.Member:
        return await this.memberRepository.findOne({ where: { phone } });
      case SubjectTypeEnum.PlatformStaff:
        return await this.platformStaffRepository.findOne({ where: { phone } });
      case SubjectTypeEnum.CommunityStaff:
        return await this.communityStaffRepository.findOne({ where: { phone } });
      default:
        return null;
    }
  }

  /**
   * 生成JWT token
   */
  private async generateToken(user: any, subjectType: SubjectTypeEnum): Promise<string> {
    // 这里应该使用JWT服务生成token
    // 简化实现，返回模拟token
    return `jwt-token-for-${user.id}-${subjectType}`;
  }

  /**
   * 获取用户字段名
   */
  private getUserField(subjectType: SubjectTypeEnum): string {
    switch (subjectType) {
      case SubjectTypeEnum.Member:
        return 'member';
      case SubjectTypeEnum.PlatformStaff:
        return 'platformStaff';
      case SubjectTypeEnum.CommunityStaff:
        return 'communityStaff';
      default:
        return 'member';
    }
  }

  /**
   * 获取用户绑定的Passkey列表
   */
  async getUserPasskeys(userId: string, subjectType: SubjectTypeEnum) {
    return await this.userCredentialRepository.find({
      where: {
        [this.getUserField(subjectType)]: { id: userId },
        subjectType,
        credentialType: CredentialTypeEnum.PassKey,
      },
      select: ['id', 'credential', 'createdAt'],
    });
  }
}