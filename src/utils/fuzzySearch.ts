import { getFuzzyScore } from "./getFuzzyScore";

const querySearch = (query, items, transform) => {
  const result = new Map();

  const filteredItems = items.filter((item) => {
    let bestMatch = "";
    let bestScore = 0;
    let index = -1;

    const transformedItem = transform(item);

    for (const token of transformedItem) {
      index++;
      const score = getFuzzyScore(token, query, 0.8);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = token;
      }
    }


    if (bestScore > 0.5) {
      result.set(item, {
        searchable: bestMatch,
        score: bestScore,
        index: index,
      });
      return true;
    }

    return false;
  });

  filteredItems.sort((item1, item2) => {
    const info1 = result.get(item1);
    const info2 = result.get(item2);

    if (info1.score !== info2.score) {
      return info2.score - info1.score;
    } else if (info1.index !== info2.index) {
      return info1.index - info2.index;
    } else if (info1.searchable < info2.searchable) {
      return -1
    } else if (info1.searchable > info2.searchable) {
      return 1
    } else {
      return 0
    }
  });

  return filteredItems;
};

export function fuzzySearch(
  items,
  transformFunc = i => i
) {
  const transform = (text) => {
    if (!transformFunc) {
      return [text.toLowerCase()];
    }

    const transformed = transformFunc(text);

    return Array.isArray(transformed)
      ? transformed.map((item) => (item ? item.toLowerCase() : ""))
      : [transformed.toLowerCase()];
  };

  return (query) => {
    if (query === "") return items;

    const lowercasedQuery = query.toLowerCase();
    return querySearch(lowercasedQuery, items, transform);
  };
}
