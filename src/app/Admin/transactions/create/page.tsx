"use client";
import React from "react";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type FormValues = {
type?: string;
budget: number;
expense: number;
income: number;
createdAt?: string;
createdBy?: string;

};

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    const accessToken = Cookies.get("accessToken");
    const formdata = new FormData();
    formdata.append("budget", data.budget.toString());
    formdata.append("expense", data.expense.toString());
    formdata.append("income", data.income.toString());
    
    if (data.budget) formdata.append("price", data.budget.toString());
    if (data.expense) formdata.append("price", data.expense.toString());
    if (data.income) formdata.append("price", data.income.toString());
  

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/transactions/create`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formdata,
      }
    );

    const result = await res.json();
    if (result?.success) {
      toast.success("created successfully!");
      reset();
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Create New</h1>

      <form className="space-y-4 max-w-lg" onSubmit={handleSubmit(onSubmit)}>
        {/* budget */}
        <div>
          <Input
            type="text"
            placeholder="budget"
            {...register("budget", { required: "is required" })}
          />
          {errors.budget && (
            <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
          )}
        </div>

        {/* expenses */}
        <div>
          <Textarea
            placeholder="expenses"
            {...register("expense", {
              required: "is required",
            })}
          />
          {errors.expense && (
            <p className="text-red-500 text-sm mt-1">
              {errors.expense.message}
            </p>
          )}
        </div>

        {/* income */}
        <Input
          type="number"
          placeholder="income"
          {...register("income", { valueAsNumber: true })}
        />


        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create transaction"}
        </Button>
      </form>
    </div>
  );
}