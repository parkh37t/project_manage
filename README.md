# 프로젝트 수행본부 인력관리 시스템

66명 규모의 조직을 위한 엔터프라이즈급 인력관리 시스템입니다.

## 🚀 주요 기능

### 1️⃣ 대시보드
- ✅ 전체 팀원의 가동률 및 투입 현황
- ✅ 그룹별(본부장, 사업관리팀, 기획팀, 디자인팀, 개발팀) 현황 시각화
- ✅ 지난달 vs 이번달 비교 분석
- ✅ 유휴 인력 및 비용 실시간 모니터링

### 2️⃣ 연간 가동률 관리 (목표 90%)
- ✅ 월별 목표 대비 실적 추적
- ✅ 팀별 상세 분석
- ✅ AI 기반 개선 인사이트 제공
- ✅ Excel 다운로드 지원

### 3️⃣ 구성원 관리 (CRUD)
- ✅ 팀원 추가/수정/삭제
- ✅ 검색 및 필터링
- ✅ 팀별 통계 대시보드
- ✅ Excel 데이터 내보내기

### 4️⃣ 프로젝트 관리
- ✅ 3단계 프로젝트 생성 마법사
- ✅ 팀 구성 및 투입 관리
- ✅ 승인/반려 워크플로우
- ✅ 팀원 투입/철수 일정 관리

### 5️⃣ 분석 및 리포팅
- ✅ 월별/분기별 Manmonth 추이
- ✅ 유휴 인력 및 비용 분석
- ✅ 인터랙티브 차트 (Recharts)
- ✅ Excel 리포트 다운로드

### 6️⃣ 인증 시스템
- ✅ JWT 기반 인증
- ✅ 역할 기반 권한 관리 (Admin/Manager/User)
- ✅ 보안 API 통신

## 🛠 기술 스택

### Frontend
- **프레임워크**: React 18 + TypeScript
- **빌드 도구**: Vite
- **스타일링**: Tailwind CSS
- **차트**: Recharts
- **아이콘**: Lucide React
- **데이터 내보내기**: xlsx

### Backend
- **런타임**: Node.js
- **프레임워크**: Express
- **인증**: JWT + bcryptjs
- **CORS**: cors middleware

## 📦 설치 및 실행

### 프론트엔드

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

### 백엔드

```bash
# 백엔드 디렉토리로 이동
cd server

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env

# 서버 실행
npm start

# 개발 모드 (nodemon)
npm run dev
```

## 🔐 테스트 계정

| 역할 | 아이디 | 비밀번호 |
|------|--------|----------|
| 관리자 | admin | password |
| 매니저 | manager | password |
| 일반 사용자 | user | password |

## 📊 조직 구성 (총 66명)

- **본부장**: 1명 (95% 가동률)
- **사업관리팀**: 2명 (평균 82.5%)
- **기획팀**: 28명 (평균 71.2%)
- **디자인팀**: 18명 (평균 76.8%)
- **개발팀**: 17명 (평균 74.3%)

## 🎨 UI/UX 특징

- ✅ 큰 폰트 사이즈 (기본 16px, 제목 36px)
- ✅ 그라데이션 및 글래스모피즘 디자인
- ✅ 색상 기반 그룹 구분
- ✅ 반응형 레이아웃
- ✅ 다크 모드 지원

## 🚀 API 엔드포인트

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입 (Admin only)

### 구성원
- `GET /api/members` - 전체 구성원 조회
- `GET /api/members/:id` - 구성원 상세
- `POST /api/members` - 구성원 추가
- `PUT /api/members/:id` - 구성원 수정
- `DELETE /api/members/:id` - 구성원 삭제

### 프로젝트
- `GET /api/projects` - 전체 프로젝트 조회
- `GET /api/projects/:id` - 프로젝트 상세
- `POST /api/projects` - 프로젝트 생성
- `PUT /api/projects/:id` - 프로젝트 수정
- `POST /api/projects/:id/review` - 프로젝트 검토
- `DELETE /api/projects/:id` - 프로젝트 삭제

### 분석
- `GET /api/analytics/monthly` - 월별 메트릭스
- `GET /api/analytics/groups` - 그룹별 메트릭스
- `GET /api/analytics/yearly-goal` - 연간 목표

## 📄 라이선스

MIT

---

© 2024 프로젝트 수행본부 인력관리 시스템. All rights reserved.
