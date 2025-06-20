import { useEffect, useState } from 'react';

/**
 * useAppearAnimation — хук для анимации появления элементов по id
 * @param ids Список id элементов
 * @returns Set с id, для которых анимация уже запущена
 */
export function useAppearAnimation(ids: (string | number)[]) {
  const [animatedIds, setAnimatedIds] = useState<Set<string | number>>(new Set());
  useEffect(() => {
    ids.forEach((id) => {
      if (!animatedIds.has(id)) {
        setTimeout(() => {
          setAnimatedIds((prev) => new Set(prev).add(id));
        }, 50);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids]);
  return animatedIds;
}
