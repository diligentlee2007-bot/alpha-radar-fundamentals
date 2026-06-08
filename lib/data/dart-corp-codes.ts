/**
 * Map of KRX stock code → OpenDART corp_code (the 8-digit DART identifier the
 * financial-statement API requires). OpenDART keys financials by corp_code, not
 * by the 6-digit ticker, so we need this lookup.
 *
 * Generated from OpenDART's official corpCode master (corpCode.xml) — every entry
 * is the authoritative DART code for that ticker, not a guess. Tickers not in this
 * map fall back to clearly-labeled sample fundamentals.
 */
export const DART_CORP_CODES: Record<string, string> = {
  "005930": "00126380", // 삼성전자
  "000660": "00164779", // SK하이닉스
  "373220": "01515323", // LG에너지솔루션
  "207940": "00877059", // 삼성바이오로직스
  "005380": "00164742", // 현대차
  "000270": "00106641", // 기아
  "068270": "00413046", // 셀트리온
  "035420": "00266961", // NAVER
  "035720": "00258801", // 카카오
  "005490": "00155319", // POSCO홀딩스
  "051910": "00356361", // LG화학
  "006400": "00126362", // 삼성SDI
  "105560": "00688996", // KB금융
  "055550": "00382199", // 신한지주
  "086790": "00547583", // 하나금융지주
  "012330": "00164788", // 현대모비스
  "003670": "00155276", // 포스코퓨처엠
  "096770": "00631518", // SK이노베이션
  "015760": "00159193", // 한국전력
  "017670": "00159023", // SK텔레콤
  "030200": "00190321", // KT
  "032640": "00231363", // LG유플러스
  "010130": "00102858", // 고려아연
  "011200": "00164645", // HMM
  "009150": "00126371", // 삼성전기
  "066570": "00401731", // LG전자
  "034730": "00181712", // SK
  "003550": "00120021", // LG
  "010950": "00138279", // S-Oil
  "018260": "00126186", // 삼성에스디에스
  "090430": "00583424", // 아모레퍼시픽
  "259960": "00760971", // 크래프톤
  "036570": "00261443", // 엔씨소프트
  "011070": "00105961", // LG이노텍
  "024110": "00149646", // 기업은행
  "316140": "01350869", // 우리금융지주
  "247540": "01160363", // 에코프로비엠
  "086520": "00536541", // 에코프로
  "196170": "00989619", // 알테오젠
  "028300": "00199252", // HLB
  "067310": "00445054", // 하나마이크론
  "357780": "01489648", // 솔브레인
};

export function corpCodeFor(stockCode: string): string | null {
  return DART_CORP_CODES[stockCode] ?? null;
}
