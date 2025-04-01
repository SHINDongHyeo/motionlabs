## 소개

모션랩스 백엔드 채용 과제용 레포지토리

## 테스트 방법

### 1. 레포지토리 클론하기

해당 레포지토리를 clone 합니다.

```
git clone https://github.com/SHINDongHyeo/motionlabs.git
```

### 2. 환경변수 파일 추가하기

프로젝트 루트 경로에 환경변수 파일을 추가해야합니다.(환경변수 파일은 .gitignore에 추가했기 때문에 위 레포지토리에 포함되지 않았습니다) 원래는 안전하게 환경변수 파일을 전달하는 것이 좋지만 이 경우는 단순 테스트를 위한 목적이므로 편의를 위해 아래에 환경변수값을 기재합니다. `.env.development` 이름의 파일을 아래와 같이 생성해주세요.

```
# .env.development 파일

PORT=3000
DB_SYNCHRONIZE=true
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_USERNAME=test
MYSQL_PASSWORD=motionlabs1234!
MYSQL_DATABASE=motionlabs
```

### 3. docker compose 실행하기

프로젝트 루트 경로에서 아래 명령어를 이용해 docker-compose.yml 파일을 실행해주세요.

```
docker-compose up -d
```

### 4. API 테스트

스웨거를 이용해 API 테스트를 진행합니다. 주소는 `localhost:3000/api`입니다.
