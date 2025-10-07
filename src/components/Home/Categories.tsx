import React from "react";
const GetCategories = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    const data = await response.json();
    if (data?.success) {
      return data?.data;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

export default async function Categories() {
  const categories = await GetCategories();
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categories?.map((category: any) => (
        <div
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          key={category.id}
        >
          {category.name}
        </div>
      ))}
    </div>
  );
}