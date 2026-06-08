# SPEC — KR Stock Dashboard (한국 주식 대시보드)

> No spec file was provided (`[SPEC파일명]` was an unfilled placeholder). This spec is
> **inferred from the project name `kr-stock-dashboard`** and recorded here so the
> autonomous build has a fixed target. If the real spec arrives, reconcile against this.

## 목적 (Purpose)
한국 주식 시장(KOSPI / KOSDAQ)을 한눈에 보는 **프리미엄 대시보드** 웹앱.
지수, 주요 종목, 등락률 상위, 섹터 히트맵, 개별 종목 상세 차트, 관심종목(워치리스트)을
빠르고 깔끔하게 보여준다.

## 대상 사용자 (Target users)
- 국내 주식에 관심 있는 개인 투자자
- 시장 현황을 빠르게 스캔하고 싶은 사용자
- 한글 가독성과 모바일 사용성이 중요한 한국 사용자

## 핵심 기능 (Core features)
1. **시장 개요 바** — KOSPI, KOSDAQ, KOSPI200, USD/KRW 실시간형 카드 (등락 색상)
2. **마켓 무버스** — 상승률/하락률/거래대금 상위 종목
3. **종목 리스트 테이블** — 종목명/코드/현재가/등락/거래량 + 스파크라인, 정렬·검색
4. **개별 종목 상세** — 가격 차트(기간 토글: 1D/1W/1M/3M/1Y), 핵심 지표, 기업 정보
5. **섹터 히트맵** — 업종별 등락 시각화
6. **관심종목(워치리스트)** — localStorage 저장, 추가/삭제
7. **다크/라이트** — 기본 라이트 (스킬 규칙). 데이터 색상은 한국 관습(상승=빨강, 하락=파랑)

## 데이터 (Data)
- 실데이터 API(한국투자증권/네이버/KRX)는 **API 키·인증 필요 → 자율 실행 중 사용 불가**.
- 따라서 **현실적인 시드/목 데이터 레이어**를 `lib/` 에 서비스 인터페이스로 추상화.
  - 실제 종목명/코드 사용 (삼성전자 005930, SK하이닉스 000660 등)
  - 결정론적 시계열 생성기로 차트/스파크라인용 OHLC·종가 시리즈 생성
  - 추후 실 API를 동일 인터페이스로 교체 가능하도록 설계
- 데이터는 Next.js Route Handler(`/api/...`)로 서빙 → 실 API 전환 시 핸들러만 교체.

## 디자인 방향 (Design direction)
- 에이전시급, 절제된 프리미엄 핀테크 룩. 90% 뉴트럴 + 단일 액센트.
- Noto Sans KR(가변), Phosphor 아이콘(이모지 0), 8px 그리드.
- 숫자 가독성: tabular-nums, 등락 색상 일관성.
- 라이트 모드 기본. 부드러운 스크롤 등장 애니메이션, reduced-motion 존중.

## 비완성 → 완성 (합격 기준은 PLAN.md 참조)
