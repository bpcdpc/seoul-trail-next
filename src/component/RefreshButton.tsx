"use client";

import { useRouter } from "next/navigation";

export default function RefreshButton() {
  const router = useRouter();
  return (
    <button
      className="px-2 py-1 text-white bg-gray-500 rounded-md text-sm"
      onClick={() => {
        router.refresh();
      }}
    >
      새로고침
    </button>
  );
}
