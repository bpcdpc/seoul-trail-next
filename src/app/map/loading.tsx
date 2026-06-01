import StatusScreen from "@/component/StatusScreen";
import Spinner from "@/component/Spinner";

export default function Page() {
  return (
    <StatusScreen message={"데이터 로딩중..."}>
      <Spinner />
    </StatusScreen>
  );
}
