import { DataSource } from 'typeorm';
import { PlatformStaff } from '../../entities/platformStaff.entity';
import { UserCredential } from '../../entities/userCredential.entity';
import { SubjectTypeEnum } from '../../entities/enums';
import { CredentialTypeEnum } from '../../entities/enums';
import * as bcrypt from 'bcrypt';

export interface SeedData {
  name: string;
  description: string;
  run: (dataSource: DataSource) => Promise<void>;
}

export const seeds: SeedData[] = [
  {
    name: 'default-platform-staff',
    description: '创建默认平台员工账号',
    run: async (dataSource: DataSource) => {
      const platformStaffRepository = dataSource.getRepository(PlatformStaff);
      const userCredentialRepository = dataSource.getRepository(UserCredential);

      const defaultPhone = '13800000000';
      const defaultPassword = 'admin123';

      // 检查是否已存在默认平台员工
      const existingStaff = await platformStaffRepository.findOne({
        where: { phone: defaultPhone }
      });
      
      if (!existingStaff) {
        console.log('正在创建默认平台员工账号...');
        
        // 创建平台员工
        const platformStaff = new PlatformStaff();
        platformStaff.phone = defaultPhone;
        platformStaff.isActive = true;
        
        const savedStaff = await platformStaffRepository.save(platformStaff);
        
        // 创建用户凭证
        const userCredential = new UserCredential();
        userCredential.platformStaff = savedStaff;
        userCredential.subjectType = SubjectTypeEnum.PlatformStaff;
        userCredential.credentialType = CredentialTypeEnum.Password;
        userCredential.credential = await bcrypt.hash(defaultPassword, 10);
        
        await userCredentialRepository.save(userCredential);
        
        console.log('✅ 默认平台员工账号创建成功！');
        console.log('📱 手机号:', defaultPhone);
        console.log('🔑 密码:', defaultPassword);
        console.log('⚠️  请及时修改默认密码以确保安全。');
      } else {
        console.log('ℹ️  默认平台员工账号已存在，跳过创建。');
      }
    }
  }
  // 后续可以在这里添加更多的种子数据
];

/**
 * 运行所有种子数据
 */
export async function runSeeds(dataSource: DataSource): Promise<void> {
  console.log('开始执行种子数据...');
  
  for (const seed of seeds) {
    console.log(`\n执行种子: ${seed.name}`);
    console.log(`描述: ${seed.description}`);
    
    try {
      await seed.run(dataSource);
      console.log(`✅ ${seed.name} 执行成功`);
    } catch (error) {
      console.error(`❌ ${seed.name} 执行失败:`, error);
    }
  }
  
  console.log('\n种子数据执行完成！');
}