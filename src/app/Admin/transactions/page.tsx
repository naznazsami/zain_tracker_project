import Link from "next/link";
import React from "react";
import { cookies } from "next/headers";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const GetTransaction = async () => {
  const accessToken = (await cookies()).get("accessToken")?.value;
  if (!accessToken) {
    return null;
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/transactions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  if (data?.success) {
    return data?.data;
  } else {
    return null;
  }
};

export default async function page() {
  const transaction = await GetTransaction();
  return (
    <div className="w-full min-w-full">
      <div className="flex flex-row justify-between items-center p-4">
        <p>transaction</p>
        <Link
          href="/Admin/transaction/create"
          className="p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          Create New
        </Link>
      </div>
      <Table className="w-full">
        <TableCaption>List of all transaction</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>budget</TableHead>
            <TableHead>expense</TableHead>
            <TableHead>income</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>created By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transaction?.map((transaction: any) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>{transaction.createdAt}</TableCell>
              <TableCell>{transaction.budget}</TableCell>
              <TableCell>{transaction.expense}</TableCell>
              <TableCell>{transaction.income}</TableCell>
              <TableCell>{transaction.createdBy}</TableCell>
              <TableCell>
                {new Date(transaction.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </TableCell>
              <TableCell>
                <div>
                  <Link
                    href={`/Admin/transaction/edit/${transaction.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}