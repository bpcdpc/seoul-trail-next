import StatusScreen from "@/component/StatusScreen";
import Link from "next/link";

export default function Home() {
  return (
    <StatusScreen backgroundColor={"bg-blue-500"}>
      <Link href="/map">
        <button className="px-4 py-2 text-blue-600 bg-white rounded-md text-xl font-extrabold transition-all ease-in-out hover:scale-103">
          SEOUL TRAIL
        </button>
      </Link>
    </StatusScreen>
  );
}
