import { CategoryDto } from './categories.dto';
import { Category } from './categories.interface';

export const mapCategoryFromDto = (dto: CategoryDto): Category => ({
  id: dto.id,
  slug: dto.slug,
  name: dto.name,
  description: dto.description,
  emoji: dto.emoji,
  group: dto.group,
  isActive: dto.is_active,
});
