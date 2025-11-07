# EventLive - 축제/행사 관리 웹사이트

ChannelTalk과 연동된 실시간 축제/행사 관리 플랫폼입니다.

## 주요 기능

- **메인 페이지**: 행사 소개, 현재 진행 중 공연, 빠른 메뉴, 시설 안내
- **공지사항**: 주요 공지 고정, 전체 공지 목록 및 상세
- **부스 안내**: 카테고리별 필터링, 부스 상세 정보, 지도 기반 위치
- **공연 정보**: 현재 진행 중 공연, 타임테이블, 무대 위치
- **관리자 페이지**: Command 관리, 공지 등록, 문의 로그, 위치 관리
- **ChannelTalk 연동**: 실시간 문의 기능

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### ChannelTalk 설정

1. `.env.local` 파일을 생성하고 ChannelTalk 플러그인 키를 추가하세요:

```bash
NEXT_PUBLIC_CHANNEL_TALK_KEY=your_channel_talk_plugin_key_here
```

2. ChannelTalk 플러그인 키는 [ChannelTalk 대시보드](https://dashboard.channel.io)에서 발급받을 수 있습니다.

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

