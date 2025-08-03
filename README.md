# 창원 동양한의원 홈페이지

> 몸의 리듬을 돌보는 한의학으로 건강한 일상을 함께 만들어갑니다.

## 프로젝트 개요

창원 동양한의원의 한약 철학과 진료 방향을 감성적으로 소개하고, 병원 브랜딩을 강화하는 홈페이지입니다. 진료 정보 전달과 동시에 '삼촌의 한약 고찰 칼럼'처럼 깊이 있는 콘텐츠를 정기적으로 소개하는 것이 핵심입니다.

## 🎯 주요 특징

- **Apple 감성 디자인**: 여백 중심의 세련되고 정돈된 UI/UX
- **잡지 스타일 레이아웃**: 칼럼과 블로그 콘텐츠의 시각적 배치
- **완전 반응형**: 모든 디바이스에서 최적화된 사용자 경험
- **SEO 최적화**: 검색엔진과 AI 검색에 최적화된 구조
- **부드러운 애니메이션**: 자연스러운 스크롤 모션과 인터랙션

## 🛠 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS + Custom CSS
- **Font**: Pretendard (한글 최적화)
- **Icons**: Heroicons (SVG)
- **Images**: Picsum (임시 이미지)

## 📁 프로젝트 구조

```
창원동양한의원/
├── index.html              # 메인 페이지
├── column.html              # 삼촌의 한약 고찰
├── blog.html                # 블로그
├── treatment.html           # 진료안내
├── consultation.html        # 상담신청
├── location.html            # 오시는길
├── sitemap.xml             # SEO 사이트맵
├── robots.txt              # 검색엔진 가이드
├── .gitignore              # Git 무시 파일
├── README.md               # 프로젝트 문서
└── assets/
    ├── css/
    │   └── style.css       # 커스텀 스타일시트
    └── js/
        └── main.js         # 메인 JavaScript
```

## 🚀 주요 기능

### 🔍 검색 기능
- 메인 페이지 상단에 통합 검색창
- 칼럼, 블로그, 진료 정보 실시간 검색
- 자동완성 및 검색 결과 미리보기

### 📚 콘텐츠 관리
- **삼촌의 한약 고찰**: 한의학 철학이 담긴 깊이 있는 칼럼
- **블로그**: 실용적인 건강 팁과 진료 후기
- **카테고리 필터**: 주제별 콘텐츠 분류 및 필터링

### 🏥 진료 안내
- **부정맥·심계**: 두근거림, 기외수축 치료
- **부인과 질환**: 생리불순, 난소기능부전증
- **소화기·체질개선**: 개인별 맞춤 치료

### 📋 상담 신청
- 체계적인 온라인 상담 신청 폼
- 실시간 유효성 검사
- 개인정보 보호 정책 준수

### 🗺 위치 정보
- 상세한 오시는길 안내
- 대중교통 및 주차 정보
- 지도 API 연동 준비 완료

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: Warm Gray 계열 (#292524, #78716c)
- **Background**: Warm Gray 50 (#fafaf9)
- **Accent**: Blue, Green, Purple 등 상황별 색상

### 타이포그래피
- **Main Font**: Pretendard (한글 최적화)
- **Fallback**: -apple-system, BlinkMacSystemFont, system-ui

### 레이아웃 원칙
- 여백 중심의 미니멀 디자인
- 카드 기반 콘텐츠 배치
- 일관된 스케일링과 간격

## 📱 반응형 디자인

### 브레이크포인트
- **Mobile**: ~768px
- **Tablet**: 768px~1024px
- **Desktop**: 1024px+

### 모바일 최적화
- 터치 친화적 네비게이션
- 읽기 쉬운 폰트 크기 조정
- 최적화된 이미지 로딩

## 🔧 개발 환경 설정

### 로컬 개발 서버 실행
```bash
# 간단한 HTTP 서버 실행 (Python 3)
python -m http.server 8000

# 또는 Node.js live-server 사용
npx live-server
```

### 코드 스타일
- 들여쓰기: 4 spaces
- 따옴표: 작은따옴표 우선
- 세미콜론: 필수
- 네이밍: camelCase (JavaScript), kebab-case (CSS)

## 🚀 배포 가이드

### GitHub Pages 배포
1. GitHub 저장소 생성
2. 코드 푸시
3. Settings > Pages에서 배포 설정

### Netlify 배포
1. 저장소 연결
2. Build command: (없음)
3. Publish directory: `/`

### Vercel 배포
1. 저장소 import
2. 자동 배포 설정

## 📊 SEO 최적화

### 메타 태그
- Title, Description, Keywords 최적화
- Open Graph, Twitter Cards 지원
- 구조화된 데이터 준비

### 사이트맵
- sitemap.xml 자동 생성
- robots.txt 검색엔진 가이드
- 페이지별 우선순위 설정

## 🔮 향후 개발 계획

### Phase 2
- [ ] 네이버 지도 API 연동
- [ ] 카카오맵 API 연동
- [ ] 네이버 폼 실제 연결

### Phase 3
- [ ] CMS 연동 (콘텐츠 관리)
- [ ] 블로그 댓글 시스템
- [ ] 다국어 지원 (영어)

### Phase 4
- [ ] PWA (Progressive Web App) 구현
- [ ] 오프라인 지원
- [ ] 푸시 알림

## 🐛 알려진 이슈

- 지도 API 연동 대기 중 (placeholder 상태)
- 상담 신청 폼 백엔드 연결 필요
- 실제 이미지 교체 필요

## 📞 연락처

**창원 동양한의원**
- 주소: 경상남도 창원시 의창구 용호동 123-45 동양빌딩 2층
- 전화: 055-123-4567
- 진료시간: 평일 09:00-18:00, 토요일 09:00-15:00

## 📄 라이선스

이 프로젝트는 창원 동양한의원의 소유이며, 모든 권리가 보호됩니다.

---

**Built with ❤️ by Claude Code**  
*Generated with AI assistance - Human-guided development*