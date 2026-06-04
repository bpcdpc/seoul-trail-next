"use client";

import { TrailDispatchContext } from "@/context/TrailDispatchContext";
import { TrailStateContext } from "@/context/TrailStateContext";
import { initialTrailState, trailReducer } from "@/reducer/trailReducer";
import { MergedItem } from "@/type/types";
import { useMemo, useReducer } from "react";
import SeoulTrail from "./SeoulTrail";

type TrailProviderProps = {
  infos: MergedItem[];
};

export default function TrailProvider({ infos }: TrailProviderProps) {
  // 상태관리 : 초기 데이터를 상태에 주입
  const [state, dispatch] = useReducer(trailReducer, {
    ...initialTrailState,
    infos,
  });

  // Context Provider 에 전달할 함수들을 객체로 묶어 메모이제이션
  const dispatchValue = useMemo(
    () => ({
      // 지도에서 특정 둘레길 마커를 선택할 때
      onRoadSelect: (targetRoadNumber: number) =>
        dispatch({ type: "SELECT_ROAD", payload: targetRoadNumber }),
      // 사이드바가 닫힐 때
      onSideBarClose: () => dispatch({ type: "CLOSE_SIDEBAR" }),
      // 사이드바가 닫힌 후에
      afterSideBarClosed: () => dispatch({ type: "AFTER_SIDEBAR_CLOSED" }),
      // 앱을 초기화
      onAppInit: () => dispatch({ type: "APP_INIT" }),
      // 난이도를 선택할 때
      onLevelChange: (levelName: string) =>
        dispatch({ type: "SET_LEVEL", payload: levelName }),
    }),
    [],
  );

  console.log("TrailProvider: ", infos);

  return (
    <TrailDispatchContext.Provider value={dispatchValue}>
      <TrailStateContext.Provider value={state}>
        <div className="relative w-screen h-dvh overflow-hidden fade-in">
          <SeoulTrail />
        </div>
      </TrailStateContext.Provider>
    </TrailDispatchContext.Provider>
  );
}
