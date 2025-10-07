"use server";
import { revalidatePath } from "next/cache";

const RevalidatePath = (path: string) => {
  revalidatePath(path);
};
export default RevalidatePath;