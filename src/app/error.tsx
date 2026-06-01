"use client";

import StatusScreen from "@/component/StatusScreen";
import RefreshButton from "@/component/RefreshButton";

export default function Page() {
  return (
    <StatusScreen
      message={"데이터를 가져오는데 실패했습니다. 다시 시도해 주세요."}
    >
      <RefreshButton />
    </StatusScreen>
  );
}
