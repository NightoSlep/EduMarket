export const getCategoryMap = (courses) => {
  const categoryMap = {};

  courses.forEach((course) => {
    const category = course.category;

    if (!categoryMap[category]) {
      categoryMap[category] = new Set();
    }

    categoryMap[category].add(course.subcategory);
  });

  return Object.entries(categoryMap).map(([category, subSet]) => ({
    category,
    subcategories: Array.from(subSet),
  }));
};
