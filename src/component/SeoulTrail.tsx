"use client";

import { useKakaoLoader } from "react-kakao-maps-sdk";

import MainMap from "@/component/MainMap";
import SideBar from "@/component/SideBar";
import Footer from "@/component/Footer";
import Header from "@/component/Header";
import StatusScreen from "@/component/StatusScreen";
import RefreshButton from "@/component/RefreshButton";
import Spinner from "@/component/Spinner";

export default function SeoulTrail() {
  // 지도 api KEY 검사
  const KAKAOMAP_API = process.env.NEXT_PUBLIC_KAKAOMAP_API_KEY;

  if (!KAKAOMAP_API)
    return (
      <StatusScreen
        message={"지도 환경변수가 지정되지 않았습니다. 다시 시도해 주세요."}
      >
        <RefreshButton />
      </StatusScreen>
    );

  // 지도 로딩 hook
  const [isMapLoading, mapLoadingError] = useKakaoLoader({
    appkey: KAKAOMAP_API,
  });

  // 지도 로딩중
  if (isMapLoading)
    return (
      <StatusScreen message={"지도 로딩 중..."}>
        <Spinner />
      </StatusScreen>
    );

  // 지도 로딩 실패
  if (mapLoadingError)
    return (
      <StatusScreen message={"지도 로드에 실패했습니다. 다시 시도해 주세요."}>
        <RefreshButton />
      </StatusScreen>
    );

  return (
    <>
      <Header />
      <SideBar />
      <MainMap />
      <Footer />
    </>
  );
}
