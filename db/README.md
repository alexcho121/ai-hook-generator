# DB 설명

## 개요

이 프로젝트는 H2 인메모리 DB를 사용합니다.
앱을 실행하면 DB가 자동으로 생성되고, 앱을 끄면 데이터는 사라집니다.
로컬 개발 전용이며 추후 MySQL 등 실제 DB로 교체 예정입니다.

---

## 테이블 구조

### `history` 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | BIGINT (자동 증가) | 고유 식별자 |
| topic | VARCHAR(255) | 사용자가 입력한 주제 |
| platform | VARCHAR(50) | 선택한 플랫폼 (youtube, tiktok 등) |
| hooks | TEXT | AI가 생성한 훅 목록 (JSON 문자열) |
| created_at | DATETIME | 저장된 시각 (자동 기록) |

DDL은 `schema.sql` 파일 참고.

---

## 데이터 흐름

`
사용자가 주제 입력 + 플랫폼 선택
        ↓
AI가 훅 5개 생성 (OpenAI 호출)
        ↓
프론트에서 저장 요청
        ↓
POST /api/history → DB에 저장
        ↓
GET  /api/history → 저장된 기록 전체 조회
`

---

## API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | /api/history | 훅 생성 기록 저장 |
| GET  | /api/history | 전체 기록 조회 |

### POST 요청 예시

`json
{
  "topic": "다이어트 식단",
  "platform": "youtube",
  "hooks": "[\"훅1\",\"훅2\",\"훅3\",\"훅4\",\"훅5\"]"
}
`

### GET 응답 예시

`json
[
  {
    "id": 1,
    "topic": "다이어트 식단",
    "platform": "youtube",
    "hooks": "[\"훅1\",\"훅2\",\"훅3\",\"훅4\",\"훅5\"]",
    "createdAt": "2026-06-10T12:30:00"
  }
]
`

---

## 로컬에서 저장된 데이터 직접 확인하는 법

1. 백엔드 서버 실행
`ash
cd back
./gradlew bootRun
`

2. 브라우저에서 H2 콘솔 접속
`
http://localhost:8080/h2-console
`

3. 아래 정보로 로그인
`
JDBC URL : jdbc:h2:mem:hookdb
Username : sa
Password : (비워두기)
`

4. SQL 직접 실행
`sql
SELECT * FROM HISTORY;
`

---

## 로컬 환경 설정

`back/src/main/resources/application.properties` 파일이 없다면
`application.properties.example`을 복사해서 만드세요.

`ash
cp back/src/main/resources/application.properties.example back/src/main/resources/application.properties
`

`application.properties`는 `.gitignore`에 등록되어 있어 커밋되지 않습니다.