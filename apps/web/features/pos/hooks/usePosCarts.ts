'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  useAddCartItemMutation,
  useCloseCartMutation,
  useCreateCartMutation,
  useDeleteCartMutation,
  useGetActiveCartsQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
  useUpdateCartMutation,
} from '../api';
import type {
  AddCartItemRequest,
  Cart,
  CartItem,
  UpdateCartItemRequest,
  UpdateCartRequest,
} from '../types';

const CART_DEBOUNCE_MS = 1000;
const ITEM_DEBOUNCE_MS = 800;

function toNum(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

// Merge server CartItem with local pending edits for optimistic display
function applyItemEdit(
  item: CartItem,
  edit: Partial<UpdateCartItemRequest> | undefined,
): CartItem {
  if (!edit) return item;
  const qty = toNum(edit.quantity ?? item.quantity, 1);
  const price = toNum(edit.unitPrice ?? item.unitPrice, 0);
  const discount = toNum(edit.discountAmount ?? item.discountAmount, 0);
  return {
    ...item,
    ...(edit.quantity !== undefined && { quantity: String(edit.quantity) }),
    ...(edit.unitPrice !== undefined && { unitPrice: String(edit.unitPrice) }),
    ...(edit.discountAmount !== undefined && { discountAmount: String(edit.discountAmount) }),
    ...(edit.description !== undefined && { description: edit.description }),
    totalPrice: String(Math.max(0, qty * price - discount)),
  };
}

export function usePosCarts() {
  const { data, isLoading } = useGetActiveCartsQuery();
  const [createCartMutation] = useCreateCartMutation();
  const [updateCartMutation] = useUpdateCartMutation();
  const [closeCartMutation] = useCloseCartMutation();
  const [deleteCartMutation] = useDeleteCartMutation();
  const [addCartItemMutation] = useAddCartItemMutation();
  const [updateCartItemMutation] = useUpdateCartItemMutation();
  const [removeCartItemMutation] = useRemoveCartItemMutation();

  const serverCarts = data?.data ?? [];

  const [activeCartId, setActiveCartId] = useState<string | null>(null);

  // Pending local edits: applied optimistically on top of server state
  const [localCartPatch, setLocalCartPatch] = useState<Partial<UpdateCartRequest>>({});
  const [localItemEdits, setLocalItemEdits] = useState<Record<string, Partial<UpdateCartItemRequest>>>({});

  const cartDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemDebounceRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Auto-select first cart when carts load and nothing is selected
  useEffect(() => {
    if (!activeCartId && serverCarts.length > 0) {
      setActiveCartId(serverCarts[0].id);
    }
  }, [serverCarts, activeCartId]);

  // Clear local patches when switching carts
  useEffect(() => {
    setLocalCartPatch({});
    setLocalItemEdits({});
  }, [activeCartId]);

  // Compute the active cart with all local optimistic edits applied
  const serverCart = serverCarts.find((c) => c.id === activeCartId) ?? null;
  const localCart: Cart | null = serverCart
    ? {
        ...serverCart,
        ...localCartPatch,
        discountAmount:
          localCartPatch.discountAmount !== undefined
            ? String(localCartPatch.discountAmount)
            : serverCart.discountAmount,
        paidAmount:
          localCartPatch.paidAmount !== undefined
            ? String(localCartPatch.paidAmount)
            : serverCart.paidAmount,
        items: serverCart.items.map((item) =>
          applyItemEdit(item, localItemEdits[item.id]),
        ),
      }
    : null;

  // ─── Cart header mutations ──────────────────────────────────────────────────

  const patchCart = useCallback(
    (patch: Partial<UpdateCartRequest>) => {
      if (!activeCartId) return;
      setLocalCartPatch((prev) => ({ ...prev, ...patch }));
      setSaveStatus('saving');
      if (cartDebounceRef.current) clearTimeout(cartDebounceRef.current);
      cartDebounceRef.current = setTimeout(async () => {
        try {
          await updateCartMutation({ id: activeCartId, data: patch }).unwrap();
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 1500);
        } catch {
          setSaveStatus('idle');
        }
        setLocalCartPatch({});
      }, CART_DEBOUNCE_MS);
    },
    [activeCartId, updateCartMutation],
  );

  const changeMachineModel = useCallback(
    async (machineModelId: string | null) => {
      if (!activeCartId) return;
      if (cartDebounceRef.current) clearTimeout(cartDebounceRef.current);
      setLocalCartPatch({ machineModelId, modelNameSnapshot: null });
      setLocalItemEdits({});
      setSaveStatus('saving');
      try {
        await updateCartMutation({ id: activeCartId, data: { machineModelId } }).unwrap();
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 1500);
      } catch {
        setSaveStatus('idle');
      } finally {
        setLocalCartPatch({});
      }
    },
    [activeCartId, updateCartMutation],
  );

  // ─── CartItem mutations ─────────────────────────────────────────────────────

  const addItem = useCallback(
    async (data: AddCartItemRequest) => {
      if (!activeCartId) return;
      await addCartItemMutation({ cartId: activeCartId, data }).unwrap();
    },
    [activeCartId, addCartItemMutation],
  );

  const updateItem = useCallback(
    (itemId: string, patch: Partial<UpdateCartItemRequest>) => {
      if (!activeCartId) return;
      // Optimistic: apply edit immediately
      setLocalItemEdits((prev) => ({
        ...prev,
        [itemId]: { ...(prev[itemId] ?? {}), ...patch },
      }));
      setSaveStatus('saving');
      // Debounce the PATCH call
      if (itemDebounceRefs.current[itemId]) clearTimeout(itemDebounceRefs.current[itemId]);
      itemDebounceRefs.current[itemId] = setTimeout(async () => {
        try {
          await updateCartItemMutation({ cartId: activeCartId, itemId, data: patch }).unwrap();
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 1500);
        } catch {
          setSaveStatus('idle');
        }
        // Clear local edit once server confirms
        setLocalItemEdits((prev) => {
          const next = { ...prev };
          delete next[itemId];
          return next;
        });
        delete itemDebounceRefs.current[itemId];
      }, ITEM_DEBOUNCE_MS);
    },
    [activeCartId, updateCartItemMutation],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!activeCartId) return;
      await removeCartItemMutation({ cartId: activeCartId, itemId }).unwrap();
    },
    [activeCartId, removeCartItemMutation],
  );

  // ─── Cart lifecycle ─────────────────────────────────────────────────────────

  const handleCreateCart = useCallback(async () => {
    const result = await createCartMutation({ cartName: `Cart ${serverCarts.length + 1}` }).unwrap();
    setActiveCartId(result.data.id);
    return result.data;
  }, [createCartMutation, serverCarts.length]);

  const handleCloseCart = useCallback(
    async (cartId: string) => {
      await closeCartMutation(cartId).unwrap();
      if (activeCartId === cartId) {
        const remaining = serverCarts.filter((c) => c.id !== cartId);
        setActiveCartId(remaining[0]?.id ?? null);
      }
    },
    [closeCartMutation, activeCartId, serverCarts],
  );

  const handleDeleteCart = useCallback(
    async (cartId: string) => {
      await deleteCartMutation(cartId).unwrap();
      if (activeCartId === cartId) {
        const remaining = serverCarts.filter((c) => c.id !== cartId);
        setActiveCartId(remaining[0]?.id ?? null);
      }
    },
    [deleteCartMutation, activeCartId, serverCarts],
  );

  return {
    carts: serverCarts,
    isLoading,
    activeCartId,
    setActiveCartId,
    localCart,
    saveStatus,
    patchCart,
    changeMachineModel,
    addItem,
    updateItem,
    removeItem,
    createCart: handleCreateCart,
    closeCart: handleCloseCart,
    deleteCart: handleDeleteCart,
  };
}
