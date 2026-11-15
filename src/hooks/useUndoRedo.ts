import { useCallback, useRef, useState } from 'react';

interface HistoryStore<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useUndoRedo<T>(initialState: T, maxHistory = 50) {
  const [store, setStore] = useState<HistoryStore<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const lastCoalesceRef = useRef<{ key: string; timestamp: number } | null>(null);

  const setState = useCallback(
    (updater: T | ((prev: T) => T), coalesceKey?: string) => {
      const now = Date.now();
      setStore((curr) => {
        const nextPresent =
          typeof updater === 'function' ? (updater as (prev: T) => T)(curr.present) : updater;

        if (Object.is(nextPresent, curr.present)) {
          return curr;
        }

        const canCoalesce =
          Boolean(coalesceKey) &&
          lastCoalesceRef.current !== null &&
          lastCoalesceRef.current.key === coalesceKey &&
          now - lastCoalesceRef.current.timestamp < 900;

        if (coalesceKey) {
          lastCoalesceRef.current = { key: coalesceKey, timestamp: now };
        } else {
          lastCoalesceRef.current = null;
        }

        if (canCoalesce && curr.past.length > 0) {
          return {
            past: curr.past,
            present: nextPresent,
            future: [],
          };
        }

        const nextPast = [...curr.past, curr.present];
        if (nextPast.length > maxHistory) {
          nextPast.shift();
        }

        return {
          past: nextPast,
          present: nextPresent,
          future: [],
        };
      });
    },
    [maxHistory]
  );

  const undo = useCallback(() => {
    lastCoalesceRef.current = null;
    setStore((curr) => {
      if (curr.past.length === 0) return curr;
      const previous = curr.past[curr.past.length - 1];
      const nextPast = curr.past.slice(0, -1);
      return {
        past: nextPast,
        present: previous,
        future: [curr.present, ...curr.future].slice(0, maxHistory),
      };
    });
  }, [maxHistory]);

  const redo = useCallback(() => {
    lastCoalesceRef.current = null;
    setStore((curr) => {
      if (curr.future.length === 0) return curr;
      const next = curr.future[0];
      const nextFuture = curr.future.slice(1);
      return {
        past: [...curr.past, curr.present].slice(-maxHistory),
        present: next,
        future: nextFuture,
      };
    });
  }, [maxHistory]);

  const jumpToPast = useCallback(
    (pastIndex: number) => {
      lastCoalesceRef.current = null;
      setStore((curr) => {
        if (pastIndex < 0 || pastIndex >= curr.past.length) return curr;
        const target = curr.past[pastIndex];
        const nextPast = curr.past.slice(0, pastIndex);
        const movedToFuture = [...curr.past.slice(pastIndex + 1), curr.present];
        return {
          past: nextPast,
          present: target,
          future: [...movedToFuture, ...curr.future].slice(0, maxHistory),
        };
      });
    },
    [maxHistory]
  );

  const jumpToFuture = useCallback(
    (futureIndex: number) => {
      lastCoalesceRef.current = null;
      setStore((curr) => {
        if (futureIndex < 0 || futureIndex >= curr.future.length) return curr;
        const target = curr.future[futureIndex];
        const movedToPast = [curr.present, ...curr.future.slice(0, futureIndex)];
        const nextFuture = curr.future.slice(futureIndex + 1);
        return {
          past: [...curr.past, ...movedToPast].slice(-maxHistory),
          present: target,
          future: nextFuture,
        };
      });
    },
    [maxHistory]
  );

  const resetHistory = useCallback((nextPresent: T) => {
    lastCoalesceRef.current = null;
    setStore({
      past: [],
      present: nextPresent,
      future: [],
    });
  }, []);

  return {
    state: store.present,
    setState,
    undo,
    redo,
    jumpToPast,
    jumpToFuture,
    resetHistory,
    canUndo: store.past.length > 0,
    canRedo: store.future.length > 0,
    undoCount: store.past.length,
    redoCount: store.future.length,
    pastStates: store.past,
    futureStates: store.future,
  };
}
