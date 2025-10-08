/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useMemo, useState } from "react";

type Menu = {
  id: number;
  name: string;
  price: number;
  category?: string;
  description?: string;
  isActive: boolean;
};

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });
  const [editing, setEditing] = useState<Record<number, Partial<Menu>>>({});

  const activeMenus = useMemo(() => menus.filter((m) => m.isActive), [menus]);
  const inactiveMenus = useMemo(
    () => menus.filter((m) => !m.isActive),
    [menus]
  );

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/menu", { cache: "no-store" });
      if (!r.ok) throw new Error("목록 불러오기 실패");
      const data: Menu[] = await r.json();
      setMenus(data);
    } catch (e: any) {
      setError(e?.message ?? "에러");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createMenu = async () => {
    if (!form.name || !form.price) {
      alert("이름과 가격은 필수입니다.");
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const r = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          category: form.category || undefined,
          description: form.description || undefined,
        }),
      });
      if (!r.ok) throw new Error("등록 실패");
      setForm({ name: "", price: "", category: "", description: "" });
      await load();
    } catch (e: any) {
      setError(e?.message ?? "에러");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (m: Menu) => {
    setEditing((prev) => ({
      ...prev,
      [m.id]: {
        name: m.name,
        price: m.price,
        category: m.category ?? "",
        description: m.description ?? "",
      },
    }));
  };

  const cancelEdit = (id: number) => {
    setEditing((prev) => {
      const n = { ...prev };
      delete n[id];
      return n;
    });
  };

  const patchMenu = async (id: number, patch: Partial<Menu>) => {
    setError(null);
    const r = await fetch(`/api/menu/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!r.ok) {
      const msg = (await r.json().catch(() => ({})))?.error ?? "수정 실패";
      throw new Error(msg);
    }
  };

  const saveEdit = async (id: number) => {
    const draft = editing[id];
    if (!draft) return;
    try {
      await patchMenu(id, {
        name: draft.name,
        price: Number(draft.price),
        category: draft.category ?? undefined,
        description: draft.description ?? undefined,
      });
      cancelEdit(id);
      await load();
    } catch (e: any) {
      setError(e?.message ?? "에러");
    }
  };

  const toggleActive = async (m: Menu) => {
    try {
      await patchMenu(m.id, { isActive: !m.isActive });
      await load();
    } catch (e: any) {
      setError(e?.message ?? "에러");
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">메뉴 관리</h1>
        <button
          onClick={load}
          className="rounded bg-gray-800 px-3 py-2 text-white"
        >
          새로고침
        </button>
      </header>

      {/* 등록 폼 */}
      <section className="rounded-2xl border p-4">
        <h2 className="mb-3 font-semibold">신규 메뉴 등록</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className="rounded border p-2"
            placeholder="이름*"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="rounded border p-2"
            placeholder="가격* (숫자)"
            inputMode="numeric"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            className="rounded border p-2"
            placeholder="카테고리"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            className="rounded border p-2 sm:col-span-2"
            placeholder="설명"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="mt-3">
          <button
            disabled={creating}
            onClick={createMenu}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {creating ? "등록 중..." : "등록"}
          </button>
        </div>
      </section>

      {/* 에러 */}
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* 활성 메뉴 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">활성 메뉴</h2>
        {loading ? (
          <p>불러오는 중...</p>
        ) : activeMenus.length === 0 ? (
          <p className="text-gray-500">활성 메뉴가 없습니다.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {activeMenus.map((m) => {
              const draft = editing[m.id];
              const isEditing = !!draft;
              return (
                <li key={m.id} className="rounded-2xl border p-4">
                  {!isEditing ? (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{m.name}</div>
                        <span className="text-sm text-gray-500">#{m.id}</span>
                      </div>
                      <div className="mt-1 text-sm">
                        {m.category && (
                          <span className="mr-2">[{m.category}]</span>
                        )}
                        <span className="font-medium">
                          {m.price.toLocaleString()}원
                        </span>
                      </div>
                      {m.description && (
                        <p className="mt-1 text-gray-600">{m.description}</p>
                      )}
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => startEdit(m)}
                          className="rounded bg-gray-200 px-3 py-1"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => toggleActive(m)}
                          className="rounded bg-amber-500 px-3 py-1 text-white"
                        >
                          숨김 처리
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid gap-2">
                        <input
                          className="rounded border p-2"
                          value={String(draft.name ?? "")}
                          onChange={(e) =>
                            setEditing((prev) => ({
                              ...prev,
                              [m.id]: { ...prev[m.id], name: e.target.value },
                            }))
                          }
                          placeholder="이름"
                        />
                        <input
                          className="rounded border p-2"
                          inputMode="numeric"
                          value={String(draft.price ?? "")}
                          onChange={(e) =>
                            setEditing((prev) => ({
                              ...prev,
                              [m.id]: {
                                ...prev[m.id],
                                price: Number(e.target.value || 0),
                              },
                            }))
                          }
                          placeholder="가격"
                        />
                        <input
                          className="rounded border p-2"
                          value={String(draft.category ?? "")}
                          onChange={(e) =>
                            setEditing((prev) => ({
                              ...prev,
                              [m.id]: {
                                ...prev[m.id],
                                category: e.target.value,
                              },
                            }))
                          }
                          placeholder="카테고리"
                        />
                        <input
                          className="rounded border p-2"
                          value={String(draft.description ?? "")}
                          onChange={(e) =>
                            setEditing((prev) => ({
                              ...prev,
                              [m.id]: {
                                ...prev[m.id],
                                description: e.target.value,
                              },
                            }))
                          }
                          placeholder="설명"
                        />
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => saveEdit(m.id)}
                          className="rounded bg-blue-600 px-3 py-1 text-white"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => cancelEdit(m.id)}
                          className="rounded bg-gray-200 px-3 py-1"
                        >
                          취소
                        </button>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* 비활성 메뉴 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">숨김(비활성) 메뉴</h2>
        {inactiveMenus.length === 0 ? (
          <p className="text-gray-500">비활성 메뉴가 없습니다.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {inactiveMenus.map((m) => (
              <li key={m.id} className="rounded-2xl border p-4 opacity-70">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{m.name}</div>
                  <span className="text-sm text-gray-500">#{m.id}</span>
                </div>
                <div className="mt-1 text-sm">
                  {m.category && <span className="mr-2">[{m.category}]</span>}
                  <span className="font-medium">
                    {m.price.toLocaleString()}원
                  </span>
                </div>
                {m.description && (
                  <p className="mt-1 text-gray-600">{m.description}</p>
                )}
                <div className="mt-3">
                  <button
                    onClick={() => toggleActive(m)}
                    className="rounded bg-emerald-600 px-3 py-1 text-white"
                  >
                    다시 표시
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
