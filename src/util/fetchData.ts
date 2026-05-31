import type {
  InfoItem,
  InfoResponse,
  MergedItem,
  PlaceItem,
  PlaceResponse,
  ImageItem,
  ImageResponse,
} from "@/type/types";

// 서울 열린 데이터 페칭
async function fetchSOData<T>(url: string): Promise<T | null> {
  try {
    // 1개월 주기로 데이터 갱신
    const res = await fetch(url, { next: { revalidate: 2592000 } });
    if (!res.ok) {
      const errorText = res.text();
      throw new Error(`HTTP Error : ${res.status} ${errorText}`);
    }
    const data: T = await res.json();
    return data;
  } catch (err) {
    if (err instanceof Error) console.log(err);
    return null;
  }
}

// 카카오 데이터 페칭
async function fetchKakaoData<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
      },
      // 1개월 주기로 데이터 갱신
      next: { revalidate: 2592000 },
    });
    if (!res.ok) {
      const errorText = res.text();
      throw new Error(`HTTP Error : ${res.status} ${errorText}`);
    }
    const data: T = await res.json();
    return data;
  } catch (err) {
    if (err instanceof Error) console.log(err);
    return null;
  }
}

// 서울 열린 데이터 : 둘레길 상세 정보 아이템
export async function fetchInfoItems(): Promise<InfoItem[]> {
  const url = `${process.env.NEXT_PUBLIC_SODATA_BASE_URL}/${process.env.NEXT_PUBLIC_SODATA_API_KEY}/json/viewGil/1/100`;
  const infoRes: InfoResponse | null = await fetchSOData<InfoResponse>(url);
  if (!infoRes) throw new Error("둘레길 정보를 가져오지 못했습니다.");
  return infoRes.viewGil.row;
}

// 서울 열린 데이터 : 둘레길 선형 좌표
// export async function fetchPathItems(): Promise<PathItem[]> {
//   const url = `${process.env.NEXT_PUBLIC_SODATA_BASE_URL}/${process.env.NEXT_PUBLIC_SODATA_API_KEY}/json/SdeDoDreamWay01LW/1/100`;
//   const pathRes: PathResponse | null = await fetchSOData<PathResponse>(url);
//   if (!pathRes) throw new Error("둘레길 선형 좌표를 가져오지 못했습니다.");
//   return pathRes.SdeDoDreamWay01LW.row;
// }

// 서울 열린 데이터 : 둘레길 점형 좌표
// export async function fetchPointItems(): Promise<PointItem[]> {
//   const url = `${process.env.NEXT_PUBLIC_SODATA_BASE_URL}/${process.env.NEXT_PUBLIC_SODATA_API_KEY}/json/SdeDoDreamWay01PW/1/200`;
//   const pointRes: PointResponse | null = await fetchSOData<PointResponse>(url);
//   if (!pointRes) throw new Error("둘레길 점형 좌표를 가져오지 못했습니다.");
//   return pointRes.SdeDoDreamWay01PW.row;
// }

// 비동기 딜레이
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 둘레길 상세 정보에 위도, 경도 주입
export async function fetchMergedItems(): Promise<MergedItem[]> {
  // 둘레길 상세 정보 가져오기
  const infoItems: InfoItem[] = await fetchInfoItems();

  // 서버에서 공격으로 인식하지 않도록 청킹
  const mergedItems: MergedItem[] = [];
  const chunkSize: number = 4;

  for (let i = 0; i < infoItems.length; i += chunkSize) {
    const chunk = infoItems.slice(i, i + chunkSize);

    // 청크 크기만큼 프라미스 배열 생성
    const chunkPromises: Promise<PlaceItem>[] = chunk.map((item) =>
      fetchPosition(item.BGNG_PSTN),
    );

    // 청크 크기만큼 병렬 처리
    const chunkPlaces: PlaceItem[] = await Promise.all(chunkPromises);

    // 둘레길 상세 정보에 좌표 정보 병합
    chunkPlaces.map((item, index) => {
      mergedItems.push({
        ...infoItems[i + index],
        position: { lat: Number(item.y), lng: Number(item.x) },
      });
      console.log(`${infoItems[i + index].BGNG_PSTN} 좌표 검색 성공`);
    });

    // 마지막 루프가 아닐 경우에만 대기
    if (i + chunkSize < infoItems.length) {
      await delay(1000);
    }
  }

  // 하나도 가져오지 못했을 경우
  if (mergedItems.length === 0)
    throw new Error("좌표를 하나도 가져오지 못했습니다.");

  console.log(
    `좌표 검색이 끝났습니다. 전체 ${infoItems.length}개 중 ${mergedItems.length}개 성공`,
  );

  return mergedItems;
}

// 카카오 : 로컬 데이터
export async function fetchPosition(query: string): Promise<PlaceItem> {
  const url = `${process.env.NEXT_PUBLIC_KAKAO_LOCAL_SEARCH_URL}?query=${query}&page=1&size=1`;
  const placeRes: PlaceResponse | null = await fetchKakaoData(url);
  if (!placeRes) throw new Error(`${query}의 좌표 정보를 가져오지 못했습니다.`);
  return placeRes.documents[0];
}

// 카카오 : 이미지 데이터
export async function fetchImages(query: string): Promise<ImageItem[]> {
  const url = `${process.env.NEXT_PUBLIC_KAKAO_IMAGE_SEARCH_URL}?query=${query}&page=1&size=4`;
  const imageRes: ImageResponse | null = await fetchKakaoData(url);
  if (!imageRes)
    throw new Error(`${query}의 이미지 정보를 가져오지 못했습니다.`);
  return imageRes.documents;
}
