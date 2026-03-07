import { Category } from "@/lib/store/categories/apislice";

export type FlattenedCategory = {
    id: string;
    name: string;
    displayName: string;
};

export function flattenCategories(categories: Category[], level = 0): FlattenedCategory[] {
    let flattened: FlattenedCategory[] = [];

    const sortedCategories = [...categories].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    for (const category of sortedCategories) {
        const prefix = "-".repeat(level);
        flattened.push({
            id: category.id,
            name: category.name,
            displayName: level > 0 ? `${prefix} ${category.name}` : category.name,
        });

        if (category.subCategories && category.subCategories.length > 0) {
            flattened = [...flattened, ...flattenCategories(category.subCategories, level + 1)];
        }
    }

    return flattened;
}
