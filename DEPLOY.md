# 🚀 배포 가이드

## 가장 빠른 배포 방법 (5분 완성!)

### 1️⃣ Vercel로 프론트엔드 배포 (무료, 추천!)

1. **Vercel 계정 만들기**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인

2. **프로젝트 Import**
   - "Add New..." → "Project" 클릭
   - GitHub 저장소 `parkh37t/project_manage` 선택
   - "Import" 클릭

3. **설정**
   - Framework Preset: `Vite` 자동 감지됨
   - Root Directory: `./` (기본값)
   - Build Command: `npm run build` (자동)
   - Output Directory: `dist` (자동)
   - **환경 변수 추가**:
     - Name: `VITE_API_URL`
     - Value: `https://your-backend-url.com/api` (백엔드 배포 후 입력)

4. **Deploy 클릭!**

5. **배포 완료!** 🎉
   - URL: `https://project-manage-xxx.vercel.app`
   - 이 URL을 바로 사용할 수 있습니다!

---

### 2️⃣ Render.com으로 백엔드 배포 (무료)

1. **Render 계정 만들기**
   - https://render.com 접속
   - GitHub 계정으로 로그인

2. **새 Web Service 생성**
   - "New +" → "Web Service" 클릭
   - GitHub 저장소 `parkh37t/project_manage` 연결
   - "Connect" 클릭

3. **설정**
   - Name: `project-manage-api`
   - Region: `Singapore` (가장 가까움)
   - Branch: `claude/enhance-dashboard-metrics-01WWCsGZVYYboCY2d5rmixGi`
   - Root Directory: `server`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: `Free`

4. **환경 변수 추가**
   - `PORT`: `3001`
   - `JWT_SECRET`: `your-secret-key-here-change-this`
   - `NODE_ENV`: `production`

5. **Deploy!**

6. **배포된 백엔드 URL 복사**
   - 예: `https://project-manage-api.onrender.com`

7. **Vercel로 돌아가서**
   - Settings → Environment Variables
   - `VITE_API_URL` 값을 `https://project-manage-api.onrender.com/api`로 변경
   - Redeploy 클릭

---

## 🎯 원클릭 배포 (더 빠른 방법!)

### Vercel 배포 버튼

아래 배포 버튼을 클릭하면 자동으로 배포됩니다:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/parkh37t/project_manage&project-name=project-manage&repository-name=project-manage)

### Netlify 배포 버튼

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/parkh37t/project_manage)

---

## 🔧 배포 후 확인사항

### 프론트엔드 배포 완료
✅ URL: `https://your-project.vercel.app`
✅ 로그인 페이지가 표시됨
✅ 디자인이 정상적으로 보임

### 백엔드 배포 완료
✅ URL: `https://your-api.onrender.com`
✅ `/api/health` 접속 시 `{"status":"OK"}` 응답

### 통합 확인
✅ 프론트엔드에서 로그인 가능
✅ 대시보드 데이터가 로드됨

---

## 📱 배포된 URL 예시

- **프론트엔드**: https://project-manage-parkh37t.vercel.app
- **백엔드 API**: https://project-manage-api.onrender.com
- **로그인**: admin / password

---

## 🆓 무료 플랜 제한사항

### Vercel (프론트엔드)
- ✅ 무제한 대역폭
- ✅ 자동 HTTPS
- ✅ 빠른 CDN
- ⚠️ 100GB/월 대역폭 (충분함)

### Render (백엔드)
- ✅ 무료 750시간/월
- ✅ 자동 HTTPS
- ⚠️ 15분 비활성 시 슬립 모드 (첫 접속 시 30초 대기)
- ⚠️ 512MB RAM (충분함)

---

## 🚨 문제 해결

### "Failed to fetch" 오류
→ 백엔드 URL이 제대로 설정되었는지 확인
→ Vercel 환경 변수에 `VITE_API_URL` 추가 확인

### 백엔드가 느림
→ Render 무료 플랜은 15분 후 슬립 모드 진입
→ 첫 접속 시 30초 정도 기다리면 활성화됨

### CORS 오류
→ 백엔드 `server.js`에서 CORS 설정 확인
→ 이미 설정되어 있음

---

## 💡 더 나은 배포 옵션

### 프론트엔드
- Vercel ⭐⭐⭐⭐⭐ (추천)
- Netlify ⭐⭐⭐⭐
- Cloudflare Pages ⭐⭐⭐⭐

### 백엔드
- Render.com ⭐⭐⭐⭐⭐ (추천, 무료)
- Railway.app ⭐⭐⭐⭐ ($5/월)
- Fly.io ⭐⭐⭐⭐ (무료 플랜 있음)

---

**지금 바로 배포해보세요!** 5분이면 전 세계에서 접속 가능한 URL을 얻을 수 있습니다! 🌍
