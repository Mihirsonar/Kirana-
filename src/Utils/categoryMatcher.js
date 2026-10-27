/**
 * Utility to match product categories accurately and flexibly.
 * Handles cases like:
 * - "Dairy" matching products categorized as "Dairy" or "Dairy & Bakery"
 * - "Dairy & Bakery" matching products categorized as "Dairy"
 * - "Snacks" matching "Snacks & Munchies"
 * - "Grocery" matching "Staples & Grains" or "Grocery"
 * - "Beverages" matching "Beverages" or "Drinks"
 * - "All" matching everything
 */
export const isCategoryMatch = (productCategory, selectedCategory) => {
  if (!selectedCategory || selectedCategory === "All") return true;
  if (!productCategory) return false;

  const p = productCategory.toLowerCase().trim();
  const s = selectedCategory.toLowerCase().trim();

  if (p === s) return true;

  // Direct substring inclusion (e.g. "dairy" inside "dairy & bakery" or vice versa)
  if (p.includes(s) || s.includes(p)) return true;

  // Semantic category aliases mapping
  const categoryGroups = [
    { name: "dairy", aliases: ["dairy", "bakery"] },
    { name: "grocery", aliases: ["grocery", "groceries", "staple", "staples", "grain", "grains"] },
    { name: "snacks", aliases: ["snack", "snacks", "munchies"] },
    { name: "beverages", aliases: ["beverage", "beverages", "drink", "drinks"] },
    { name: "personal care", aliases: ["personal care", "personalcare"] },
    { name: "vegetables", aliases: ["vegetable", "vegetables", "veggie", "veggies"] },
    { name: "fruits", aliases: ["fruit", "fruits"] },
  ];

  for (const group of categoryGroups) {
    const sMatchesGroup = group.aliases.some((alias) => s.includes(alias) || alias.includes(s));
    const pMatchesGroup = group.aliases.some((alias) => p.includes(alias) || alias.includes(p));
    if (sMatchesGroup && pMatchesGroup) {
      return true;
    }
  }

  // Word-by-word token overlap
  const pTokens = p.split(/[\s&,/]+/).filter((t) => t.length > 2);
  const sTokens = s.split(/[\s&,/]+/).filter((t) => t.length > 2);
  return sTokens.some((token) => pTokens.includes(token));
};
