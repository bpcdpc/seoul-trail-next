"use client";

import StatusScreen from "@/component/StatusScreen";
import RefreshButton from "@/component/RefreshButton";

export default function Page() {
  return (
    <StatusScreen
      message={"시스템을 초기화하는데 실패했습니다. 다시 시도해 주세요."}
    >
      <RefreshButton />
    </StatusScreen>
  );
}
