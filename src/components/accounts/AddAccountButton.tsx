"use client";
import React from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

type FormValues = {
  name: string;
  type: string;
  balance: number;
};

export default function AddAccountButton({ onCreated }: { onCreated?: (acc: any) => void }) {
  const [open, setOpen] = React.useState(false);
  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm<FormValues>({ defaultValues: { name: "", type: "checking", balance: 0 } });

  const onSubmit = async (values: FormValues) => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      toast.error("Please log in to add an account");
      return;
    }
    try {
      const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
      const res = await fetch(`${base}/accounts/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data?.success) {
        toast.success("Account created");
        onCreated?.(data.data);
        reset();
        setOpen(false);
      } else {
        toast.error(data?.message || "Failed to add account");
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus className="mr-1.5" />
          Add account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Account</DialogTitle>
          <DialogDescription>Enter details to create an account.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="My Checking" {...register("name", { required: true })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <select id="type" className="border rounded px-3 py-2" {...register("type", { required: true })}>
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
              <option value="credit">Credit</option>
              <option value="cash">Cash</option>
              <option value="investment">Investment</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="balance">Starting Balance</Label>
            <Input id="balance" type="number" step="0.01" {...register("balance", { required: true, valueAsNumber: true })} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


