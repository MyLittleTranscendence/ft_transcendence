## Introduction

온라인 pong 게임 및 채팅 기능을 제공하는 싱글페이지 웹 어플리케이션입니다.

## Roles
| Contributor | Role |
| --- | --- |
| <a href="https://github.com/Clearsu"><img src="https://github.com/Clearsu.png" width="50" height="50">Clearsu</a> | Front-end |
| <a href="https://github.com/ddang-jung"><img src="https://github.com/ddang-jung.png" width="50" height="50">ddang-jung</a> | Front-end |
| <a href="https://github.com/middlefitting"><img src="https://github.com/middlefitting.png" width="50" height="50">middlefitting</a> | Back-end |


## Skills
### Front-end
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/-Bootstrap-7952B3?style=flat-square&logo=bootstrap&logoColor=white)
### Back-end
![Python](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/-Django-092E20?style=flat-square&logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/-Redis-DC382D?style=flat-square&logo=redis&logoColor=white)
### Common
![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/-Nginx-009639?style=flat-square&logo=nginx&logoColor=white)

[Major Functions](#major-functions)

## Pages
### Landing page
<img width="500" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/c086f31f-eeed-494d-b04c-5b27b61654b1">

### Login page
<img width="500" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/119e8dae-b552-4637-8f59-ae8462a2b19f">

### Sign-up page
<img width="500" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/393d85f3-a962-4601-bf09-44fd05c6ff4f">

### 2FA page
<img width="500" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/f34f4020-0513-4ef2-9d15-9d277fc44110">

### Pong game page
<img width="500" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/93558fdc-f64c-4ccd-a9c1-e4c8b50fdf21">

### Game result modal
<img width="500" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/fcce64a8-fbc3-43c4-8927-d7de2e59a6c1">

### User profile page
<img width="500" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/354c55a4-7df5-4237-9e99-2547796f8f09">


## Major functions

### Authentication
- 회원가입을 통한 일반 로그인 및 42 OAuth 로그인
<img width="300" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/b94ed52b-49ee-41cf-a5ad-984da7ec8c7a">
<img width="300" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/622195b4-2e63-4ea8-9e60-166287710d22">

- 이메일을 통한 2차 인증
<img width="409" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/773189ea-f398-4673-a1ca-522b11755e13">

- 2차 인증은 마이페이지에서 활성화 및 비활성화할 수 있습니다.
<img width="407" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/9baebfdc-22d4-4971-b6ee-e615641af312">
<img width="259" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/b0ac5b4d-7588-4fb2-8c48-b86096388a56">


### Match making

- 1대1, 4인 토너먼트, 싱글 플레이 중 하나를 선택할 수 있습니다.
<img width="287" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/4fd4518e-fd86-4a8f-b405-da674607e344">

- 대기열에 등록하면 대기열에 현재 인원이 얼마나 있는지 실시간으로 업데이트 됩니다.
<img alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/7bf251a1-7cff-4d62-9e6f-340098a8ed18">

- 매치를 찾았을 시 플레이어는 일정 시간 내에 매치를 수락하여야 합니다.
<img alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/65e27ea5-1c21-424c-bfa0-f9ecca0aacd5">

- 매치를 찾은 후 취소하거나 일정 시간 내에 수락하지 않을 경우 경우 플레이어는 페널티를 받아 일정 시간 동안 대기열에 들어갈 수 없습니다.
<img alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/b41554b1-12a4-4720-abfe-858f47ba35fb">

- 친구에게 1대1 신청을 할 수 있습니다.


### Pong game

- 1대1 Pong 게임
<img width="600" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/51be3b33-ac08-475f-a2d1-575318cd8933">

- 4인 토너먼트
<img width="600" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/1a44e7da-4eda-4c57-ade0-882a720864d1">

- CLI를 통한 조작
<img width="600" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/b8a63977-496f-424d-af65-0509f356fbdd">

- 유저 프로필 페이지에서 전적 조회를 할 수 있습니다.
<img width="400" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/b8633ab0-8710-4107-9822-b6de707503de">



### Chatting
- 전체 채팅
<img width="617" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/9770d12a-6408-4c35-93b8-2704ec6344b8">

- DM
<img width="378" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/bdd6da6c-d46c-4847-824d-6223de8eae81">

### Friends
- 온라인 상태 확인
<img width="566" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/65639400-7972-4e16-815c-fca68b0e05d9">

- 친구 추가 및 삭제
<img src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/54c31e9c-2bd7-42f2-8d4b-3dee74196313">

- 친구 차단 및 차단 해제: 차단한 사용자의 메시지는 수신되지 않습니다.
<img width="512" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/4965fa86-72c3-4da9-9fc2-e3f1b4584f4c">
<img width="511" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/d9913582-8d6c-4e57-be30-8fcd4ec288f6">

- 친구에게 1대1 신청을 할 수 있습니다.
<img width="507" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/018b807e-0dc1-4f82-835d-c3d2860a0781">
<img width="361" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/a5d361ed-0254-449d-b5ed-e010b2a0d49d">


### User management
- 내 프로필 페이지에서 프로필 이미지, 닉네임, 이메일 주소를 수정할 수 있습니다.
<img width="280" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/a19f29b5-a660-45b4-add2-7e637ce811bd">
<img width="277" alt="image" src="https://github.com/MyLittleTranscendence/ft_transcendence/assets/67998022/594aaff5-5356-447b-aabc-dd1d22d72114">


