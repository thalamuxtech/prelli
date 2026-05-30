"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ArrowDownToLine, ArrowUpFromLine, MapPin, History, ArrowDown, ArrowUp } from "lucide-react";
import { increment, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCollection, createDoc, updateDocById, deleteDocById, byCreatedDesc } from "@/lib/db";
import { PageHeader, Modal, ConfirmButton, SubmitButton, EmptyState, LoadingRow } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/MediaPicker";
import { Label, Input, Textarea } from "@/components/ui/FormField";
import {
  inventoryCategoryLabels,
  type InventoryCategory,
  type InventoryItem,
  type AdminEvent,
} from "@/lib/types";

const cats = Object.keys(inventoryCategoryLabels) as InventoryCategory[];

export default function InventoryAdmin() {
  const { data, loading } = useCollection<InventoryItem>("inventory", byCreatedDesc());
  const events = useCollection<AdminEvent>("events");
  const [editing, setEditing] = useState<Partial<InventoryItem> | null>(null);
  const [moving, setMoving] = useState<{ item: InventoryItem; dir: "in" | "out" } | null>(null);
  const [history, setHistory] = useState<InventoryItem | null>(null);
  const [busy, setBusy] = useState(false);

  async function saveItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name")),
      category: String(fd.get("category")) as InventoryCategory,
      unit: String(fd.get("unit")) || "pcs",
      quantity: Number(fd.get("quantity")) || 0,
      packages: Number(fd.get("packages")) || 0,
      itemsPerPackage: Number(fd.get("itemsPerPackage")) || 0,
      location: String(fd.get("location")),
      notes: String(fd.get("notes")),
      photo: editing?.photo || "",
    };
    setBusy(true);
    try {
      if (editing?.id) await updateDocById("inventory", editing.id, payload);
      else await createDoc("inventory", payload);
      setEditing(null);
    } finally {
      setBusy(false);
    }
  }

  async function saveMovement(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!moving) return;
    const fd = new FormData(e.currentTarget);
    const qty = Number(fd.get("quantity")) || 0;
    if (qty <= 0) return;
    setBusy(true);
    try {
      await createDoc("stockMovements", {
        itemId: moving.item.id,
        itemName: moving.item.name,
        type: moving.dir,
        quantity: qty,
        destination: String(fd.get("destination") || ""),
        note: String(fd.get("note") || ""),
      });
      await updateDocById("inventory", moving.item.id, {
        quantity: increment(moving.dir === "in" ? qty : -qty),
      });
      setMoving(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Inventory & Resources"
        subtitle="Track items and products the foundation holds, and log distributions."
        action={
          <button
            onClick={() => setEditing({ quantity: 0, category: "food", unit: "bags" })}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-pill bg-prelli-green px-5 font-semibold text-white hover:bg-prelli-green-600"
          >
            <Plus className="h-5 w-5" /> Add item
          </button>
        }
      />

      {loading ? (
        <LoadingRow />
      ) : data.length === 0 ? (
        <EmptyState>No inventory yet. Add the items the foundation has on hand.</EmptyState>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-white shadow-e1">
          {/* Desktop table */}
          <table className="hidden w-full text-sm sm:table">
            <thead className="border-b border-line bg-cloud text-left text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">On hand</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{item.name}</td>
                  <td className="px-4 py-3 text-slate">{inventoryCategoryLabels[item.category]}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${item.quantity <= 0 ? "text-prelli-pink" : "text-ink"}`}>
                      {item.quantity} {item.unit}
                    </span>
                    {!!item.packages && (
                      <span className="block text-xs text-slate">
                        {item.packages} package{item.packages > 1 ? "s" : ""}
                        {item.itemsPerPackage ? ` × ${item.itemsPerPackage}` : ""}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate">{item.location || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => setMoving({ item, dir: "in" })} title="Stock in" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-prelli-green-600 hover:bg-prelli-green-50">
                        <ArrowDownToLine className="h-4 w-4" />
                      </button>
                      <button onClick={() => setMoving({ item, dir: "out" })} title="Distribute" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-prelli-orange hover:bg-prelli-orange-50">
                        <ArrowUpFromLine className="h-4 w-4" />
                      </button>
                      <button onClick={() => setHistory(item)} title="History" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-slate hover:bg-cloud hover:text-ink">
                        <History className="h-4 w-4" />
                      </button>
                      <button onClick={() => setEditing(item)} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink hover:bg-cloud">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <ConfirmButton onConfirm={() => deleteDocById("inventory", item.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-prelli-pink hover:bg-prelli-pink/5">
                        <Trash2 className="h-4 w-4" />
                      </ConfirmButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="divide-y divide-line sm:hidden">
            {data.map((item) => (
              <div key={item.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-ink">{item.name}</h3>
                    <p className="text-xs text-slate">{inventoryCategoryLabels[item.category]}</p>
                  </div>
                  <span className={`text-right font-semibold ${item.quantity <= 0 ? "text-prelli-pink" : "text-ink"}`}>
                    {item.quantity} {item.unit}
                    {!!item.packages && (
                      <span className="block text-xs font-normal text-slate">
                        {item.packages} pkg{item.packages > 1 ? "s" : ""}
                        {item.itemsPerPackage ? ` × ${item.itemsPerPackage}` : ""}
                      </span>
                    )}
                  </span>
                </div>
                {item.location && (
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate">
                    <MapPin className="h-3.5 w-3.5" /> {item.location}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => setMoving({ item, dir: "in" })} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-3 text-sm text-prelli-green-600">
                    <ArrowDownToLine className="h-4 w-4" /> In
                  </button>
                  <button onClick={() => setMoving({ item, dir: "out" })} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-3 text-sm text-prelli-orange">
                    <ArrowUpFromLine className="h-4 w-4" /> Out
                  </button>
                  <button onClick={() => setHistory(item)} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-3 text-sm text-slate">
                    <History className="h-4 w-4" /> History
                  </button>
                  <button onClick={() => setEditing(item)} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-3 text-sm text-ink">
                    <Pencil className="h-4 w-4" /> Edit
                  </button>
                  <ConfirmButton onConfirm={() => deleteDocById("inventory", item.id)} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-3 text-sm text-prelli-pink">
                    <Trash2 className="h-4 w-4" />
                  </ConfirmButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Item editor */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit item" : "Add item"} wide>
        {editing && (
          <form onSubmit={saveItem} className="space-y-4">
            <div>
              <Label htmlFor="name">Item name</Label>
              <Input id="name" name="name" required defaultValue={editing.name} />
            </div>
            <ImageUpload value={editing.photo} onChange={(url) => setEditing((p) => ({ ...p, photo: url }))} folder="inventory" label="Photo" />
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="category">Category</Label>
                <select id="category" name="category" defaultValue={editing.category || "food"} className="w-full rounded-md border border-line bg-white px-4 py-3 text-ink">
                  {cats.map((c) => (<option key={c} value={c}>{inventoryCategoryLabels[c]}</option>))}
                </select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" min={0} inputMode="numeric" defaultValue={editing.quantity ?? 0} />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Input id="unit" name="unit" placeholder="bags, cartons, kg" defaultValue={editing.unit} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="packages">Number of packages</Label>
                <Input id="packages" name="packages" type="number" min={0} inputMode="numeric" placeholder="e.g. 20 cartons" defaultValue={editing.packages ?? 0} />
              </div>
              <div>
                <Label htmlFor="itemsPerPackage">Items per package</Label>
                <Input id="itemsPerPackage" name="itemsPerPackage" type="number" min={0} inputMode="numeric" placeholder="e.g. 40 per carton" defaultValue={editing.itemsPerPackage ?? 0} />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Storage location</Label>
              <Input id="location" name="location" defaultValue={editing.location} placeholder="Abuja, Nigeria" />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" defaultValue={editing.notes} className="min-h-[80px]" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-pill px-5 py-2.5 font-medium text-slate hover:bg-cloud">Cancel</button>
              <SubmitButton busy={busy}>{editing.id ? "Save changes" : "Add item"}</SubmitButton>
            </div>
          </form>
        )}
      </Modal>

      {/* Stock movement */}
      <Modal open={!!moving} onClose={() => setMoving(null)} title={moving?.dir === "in" ? "Stock in" : "Distribute / stock out"}>
        {moving && (
          <form onSubmit={saveMovement} className="space-y-4">
            <p className="text-sm text-slate">
              {moving.item.name}: currently <b>{moving.item.quantity} {moving.item.unit}</b> on hand.
            </p>
            <div>
              <Label htmlFor="quantity">Quantity to {moving.dir === "in" ? "add" : "remove"}</Label>
              <Input id="quantity" name="quantity" type="number" min={1} inputMode="numeric" required />
            </div>
            {moving.dir === "out" && (
              <div>
                <Label htmlFor="destination">Distributed to (event / outreach)</Label>
                <select id="destination" name="destination" className="w-full rounded-md border border-line bg-white px-4 py-3 text-ink">
                  <option value="">Select or leave blank</option>
                  {events.data.map((ev) => (<option key={ev.id} value={ev.title}>{ev.title}</option>))}
                </select>
              </div>
            )}
            <div>
              <Label htmlFor="note">Note</Label>
              <Input id="note" name="note" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setMoving(null)} className="rounded-pill px-5 py-2.5 font-medium text-slate hover:bg-cloud">Cancel</button>
              <SubmitButton busy={busy}>Confirm</SubmitButton>
            </div>
          </form>
        )}
      </Modal>

      {/* Per-item stock movement history */}
      <Modal open={!!history} onClose={() => setHistory(null)} title={history ? `History: ${history.name}` : "History"} wide>
        {history && <ItemHistory item={history} />}
      </Modal>
    </div>
  );
}

interface Movement {
  id: string;
  type: "in" | "out";
  quantity: number;
  destination?: string;
  note?: string;
  createdAt?: { toDate?: () => Date };
}

function ItemHistory({ item }: { item: InventoryItem }) {
  const [rows, setRows] = useState<Movement[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, "stockMovements"), where("itemId", "==", item.id)));
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Movement);
        list.sort((a, b) => {
          const ta = a.createdAt?.toDate?.()?.getTime() ?? 0;
          const tb = b.createdAt?.toDate?.()?.getTime() ?? 0;
          return tb - ta;
        });
        setRows(list);
      } catch {
        setRows([]);
      }
    })();
  }, [item.id]);

  if (rows === null) return <LoadingRow />;

  return (
    <div>
      <p className="mb-4 text-sm text-slate">
        Currently <b className="text-ink">{item.quantity} {item.unit}</b> on hand
        {item.packages ? ` · ${item.packages} package${item.packages > 1 ? "s" : ""}` : ""}.
      </p>
      {rows.length === 0 ? (
        <EmptyState>No stock movements recorded yet.</EmptyState>
      ) : (
        <ul className="space-y-2">
          {rows.map((m) => {
            const when = m.createdAt?.toDate?.()?.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) ?? "";
            return (
              <li key={m.id} className="flex items-center gap-3 rounded-md border border-line bg-white p-3">
                <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${m.type === "in" ? "bg-prelli-green-50 text-prelli-green-600" : "bg-prelli-orange-50 text-prelli-orange"}`}>
                  {m.type === "in" ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">
                    {m.type === "in" ? "Added" : "Distributed"} {m.quantity} {item.unit}
                    {m.destination ? ` to ${m.destination}` : ""}
                  </p>
                  {m.note && <p className="text-xs text-slate">{m.note}</p>}
                </div>
                <span className="shrink-0 text-xs text-slate">{when}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
