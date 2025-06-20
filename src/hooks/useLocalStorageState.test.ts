import { renderHook, act } from '@testing-library/react';
import { useLocalStorageState } from './useLocalStorageState';

describe('useLocalStorageState', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial value if localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorageState('key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('reads value from localStorage if present', () => {
    localStorage.setItem('key', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorageState('key', 'default'));
    expect(result.current[0]).toBe('stored');
  });

  it('sets value and persists to localStorage', () => {
    const { result } = renderHook(() => useLocalStorageState('key', 'default'));
    act(() => {
      result.current[1]('newValue');
    });
    expect(result.current[0]).toBe('newValue');
    expect(localStorage.getItem('key')).toBe(JSON.stringify('newValue'));
  });
});
