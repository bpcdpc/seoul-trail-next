import TrailProvider from "@/component/TrailProvider";
import { fetchMergedItems } from "@/util/fetchData";

export default async function Page() {
  const infoResults = await fetchMergedItems();
  return <TrailProvider infos={infoResults}></TrailProvider>;
}
