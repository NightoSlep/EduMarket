export const getSuggestions = (userId, userHistory, products) => {
  const likedCategories = new Set(
    userHistory
      .filter(item => item.liked)
      .map(item => {
        const product = products.find(p => p.id === item.productId);
        return product?.category;
      })
      .filter(Boolean)
  );

  const viewedIds = new Set(userHistory.map(item => item.productId));

  const suggestions = products.filter(p =>
    likedCategories.has(p.category) && !viewedIds.has(p.id)
  );

  return Promise.resolve(suggestions.slice(0, 5));
};
