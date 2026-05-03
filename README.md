# real-pos-light

Next.js, Prisma, SQLite 기반의 간단한 POS 프로젝트입니다.

## Requirements

- Node.js 20 이상 권장
- Yarn 1.x

## Getting Started

처음 프로젝트를 받았거나 다른 환경에서 새로 실행할 때는 아래 순서대로 진행하세요.

### 1. 의존성 설치

```bash
yarn install
```

### 2. Prisma Client 생성

```bash
yarn prisma generate
```

### 3. SQLite 데이터베이스 스키마 반영

```bash
yarn prisma db push
```

이 명령을 실행하면 `prisma/schema.prisma` 기준으로 SQLite 데이터베이스가 준비됩니다.

### 4. 개발 서버 실행

```bash
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속하면 됩니다.

## Recommended First Run

처음 한 번은 아래처럼 순서대로 실행하면 가장 안전합니다.

```bash
yarn install
yarn prisma generate
yarn prisma db push
yarn dev
```

## Prisma Notes

- 현재 SQLite 데이터베이스 파일은 `prisma/dev.db`를 사용합니다.
- 스키마를 변경한 뒤에는 `yarn prisma generate`를 다시 실행하는 것을 권장합니다.
- 새 마이그레이션이 필요한 구조 변경은 `yarn prisma migrate dev`로 관리하세요.

## Production

- `yarn start` 실행 시 `prisma migrate deploy`가 먼저 수행된 뒤 앱이 시작됩니다.
- `yarn build`로 프로덕션 빌드를 만들 수 있습니다.
