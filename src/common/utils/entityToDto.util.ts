/**
 * 将数据传输对象转换为属性数组
 * @param dto 数据传输对象
 */
export function DtoToSelect<T = any>(dto: T): (keyof T)[] {
  if (!dto) {
    return [];
  }
  return Object.keys(dto) as (keyof T)[];
}
