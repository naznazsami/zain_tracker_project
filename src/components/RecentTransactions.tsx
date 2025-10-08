"use client";

import React, { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import moment from "moment";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import RevalidatePath from "@/actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownRight, ArrowUpRight, Tag } from "lucide-react";

interface Transaction {
  id: string | number;
  created_at: string;
  title: string;
  note: string;
  category: string;
  amount: number;
  type: "income" | "expense";
}

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<Transaction | null>(null);

  type FormValues = {
    title: string;
    amount: number;
    note?: string;
    type: "expense" | "income";
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<FormValues>({
    defaultValues: { title: "", amount: 0, note: "", type: "expense" },
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}transactions/today-recent`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",

              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
            cache: "no-store",
          }
        );

        const data = await response.json();
        if (data?.success) {
          setTransactions(data?.data || []);
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    if (selected) {
      setValue("title", selected.title ?? "");
      setValue("amount", Number(selected.amount) ?? 0);
      setValue("note", selected.note ?? "");
      setValue("type", selected.type);
    }
  }, [selected, setValue]);

  const onEdit = (tx: Transaction) => {
    setSelected(tx);
    setEditOpen(true);
  };

  const onDelete = async (tx: Transaction) => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      toast.error("Please log in");
      return;
    }
    const ok = window.confirm("Delete this transaction?");
    if (!ok) return;
    const previous = transactions;
    setTransactions((cur) => cur.filter((t) => t.id !== tx.id));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}transactions/delete/${tx.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (data?.success) {
        toast.success("Transaction deleted");
        RevalidatePath("/");
      } else {
        setTransactions(previous);
        toast.error(data?.message || "Failed to delete");
      }
    } catch (e) {
      setTransactions(previous);
      toast.error("Something went wrong");
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!selected) return;
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      toast.error("Please log in");
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}transactions/edit/${selected.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data?.success) {
        toast.success("Transaction updated");
        // Merge updated values into local state optimistically
        setTransactions((cur) =>
          cur.map((t) => (t.id === selected.id ? { ...t, ...values, amount: Number(values.amount) } : t))
        );
        setEditOpen(false);
        setSelected(null);
        reset();
        RevalidatePath("/");
      } else {
        toast.error(data?.message || "Failed to update");
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-6">

          {loading && <p className="text-gray-500">Loading transactions...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && transactions.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.map((t, index) => (
                  <TableRow key={index} className="hover:bg-muted/40">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${t.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {t.type === "income" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        </span>
                        <span className="truncate">{t.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${t.type === "income" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                        <Tag size={12} /> {t.type}
                      </span>
                    </TableCell>
                    <TableCell>{moment(t.created_at).format("DD/MM/YYYY hh:mm A")}</TableCell>
                    <TableCell className={t.type === "income" ? "text-green-600 text-right" : "text-red-600 text-right"}>{t.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => onEdit(t)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => onDelete(t)}>Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!loading && !error && transactions.length === 0 && (
            <p className="text-gray-500">No transactions found.</p>
          )}
      <Dialog open={editOpen} onOpenChange={(o) => { if (!o) { setEditOpen(false); setSelected(null); reset(); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>Update the fields and save your changes.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Title" {...register("title", { required: true })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <select id="type" className="border rounded px-3 py-2" {...register("type", { required: true })}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" step="0.01" min="0" {...register("amount", { required: true, valueAsNumber: true })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Input id="note" placeholder="Optional" {...register("note")} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => { setEditOpen(false); setSelected(null); reset(); }}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
