"use client";

import React from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import RevalidatePath from "@/actions";

type FormValues = {
  title: string;
  amount: number;
  note?: string;
  type: "expense" | "income";
};

export default function AddExpenseButton() {
  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: { title: "", amount: 0, note: "", type: "expense" },
  });

  const onSubmit = async (values: FormValues) => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      toast.error("Please log in to add an expense");
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}transactions/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data?.success) {
        toast.success("Expense added");
        reset();
        setOpen(false);
        RevalidatePath("/");
      } else {
        toast.error(data?.message || "Failed to add expense");
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1.5" />
          Add expense
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Expense</DialogTitle>
          <DialogDescription>Fill in the details and submit.</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Groceries" {...register("title", { required: true })} />
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
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


