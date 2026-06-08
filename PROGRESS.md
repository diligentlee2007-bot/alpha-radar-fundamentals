# PROGRESS — KR Stock Dashboard

자율 빌드 진행 로그. 마일스톤마다 한 줄 요약 + git commit.

## 결정/스킵 기록
- 스펙 파일(`[SPEC파일명]`)이 비어 있어 프로젝트명 기반으로 SPEC.md를 추론·작성.
- 실 주식 API(한국투자증권/네이버/KRX)는 인증·키 필요 → 자율 실행 중 사용 불가.
  → 결정론적 목 데이터 레이어로 대체, 실 API 교체 가능하도록 인터페이스 추상화. (위험작업 회피)
- 라이트 모드 기본(premium-website 규칙). 등락색은 한국 관습(상승=빨강/하락=파랑).
- "superpowers" 스킬은 환경에 없어 동등한 브레인스토밍/플래닝을 직접 수행해 PLAN.md 작성.

## 로그
- M0 (진행중): Next 16.2 + Bun + TS strict + Tailwind v4 스캐폴드, framer-motion /
  @phosphor-icons/react / zod / recharts / biome 설치. SPEC/PLAN/PROGRESS 작성.
