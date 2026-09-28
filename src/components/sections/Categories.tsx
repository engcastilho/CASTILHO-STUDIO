import { HorizontalGallery } from "@/components/sections/HorizontalGallery";
import { categoriesSection } from "@/config/content";
import { getCategories } from "@/lib/portfolio";

export function Categories() {
  const categories = getCategories();
  return (
    <HorizontalGallery
      eyebrow={categoriesSection.eyebrow}
      title={categoriesSection.title}
      hint={categoriesSection.hint}
      items={categories.map((category) => ({
        slug: category.slug,
        label: category.label,
        line: category.line,
        image: category.image,
        count: category.count,
      }))}
    />
  );
}
