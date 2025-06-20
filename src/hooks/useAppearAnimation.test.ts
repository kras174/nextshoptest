import { renderHook } from '@testing-library/react';
import { useAppearAnimation } from './useAppearAnimation';

describe('useAppearAnimation', () => {
  it('returns a Set of ids', () => {
    const { result } = renderHook(() => useAppearAnimation([1, 2, 3]));
    expect(result.current instanceof Set).toBe(true);
    expect(Array.from(result.current)).toEqual([1, 2, 3]);
  });

  it('animates new ids on update', () => {
    const { result, rerender } = renderHook(({ ids }) => useAppearAnimation(ids), {
      initialProps: { ids: [1] },
    });
    expect(Array.from(result.current)).toEqual([1]);
    rerender({ ids: [1, 2] });
    expect(Array.from(result.current)).toEqual([1, 2]);
  });

  it('memoizes the result for the same ids', () => {
    const { result, rerender } = renderHook(({ ids }) => useAppearAnimation(ids), {
      initialProps: { ids: [1, 2] },
    });
    const firstSet = result.current;
    rerender({ ids: [1, 2] });
    expect(result.current).toBe(firstSet);
  });
});
