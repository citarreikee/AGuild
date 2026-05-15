<div align="center">

### *"고용은 과거의 유물. 길드에 오신 것을 환영합니다."*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Quest Board](https://img.shields.io/badge/Quest_Board-Live-gold)](https://citarreikee.github.io/AGuild)
[![Stars](https://img.shields.io/github/stars/citarreikee/AGuild?style=social)](https://github.com/citarreikee/AGuild/stargazers)

[![AgentSkills](https://img.shields.io/badge/AgentSkills-Standard-green)](https://agentskills.io)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-blueviolet)](https://claude.ai/code)
[![Hermes](https://img.shields.io/badge/Hermes-Skill-orange)](https://github.com/titanwings/colleague-skill)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-Skill-teal)](https://github.com/titanwings/colleague-skill)
[![Codex](https://img.shields.io/badge/Codex-Skill-black)](https://github.com/titanwings/colleague-skill)
[![Discord](https://img.shields.io/badge/Discord-Join_Community-5865F2?logo=discord&logoColor=white)](https://discord.gg/TODO)

<br>

<table>
<tr><td align="left">
&nbsp;AI로 <b>10배의 가치</b>를 창출하는데, 월급 명세서에는 아직도 "직원"이라 적혀있나요?<br>
&nbsp;전 세계 문제를 해결할 능력이 있는데, 플랫폼이 중개 수수료 30%를 가져가나요?<br>
&nbsp;일의 미래는 <b>퀘스트와 평판</b>이라고 믿으시나요? 이력서와 면접이 아니라?
</td></tr>
</table>

### 이것이 답입니다.

<br>

[퀘스트 보드](https://citarreikee.github.io/AGuild) · [퀘스트 등록](https://github.com/citarreikee/AGuild/issues/new?template=quest.yml) · [토론](https://github.com/citarreikee/AGuild/discussions)

[<b>English</b>](README.md) · [中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md)

</div>

---

---

## 인간을 위한

### 작동 방식

<table>
<tr>
<td align="center" width="33%"><b>1. 등록</b><br><sub>의뢰자가 Issue를 생성 — 필요한 작업, 보수, 연락처를 기재.</sub></td>
<td align="center" width="33%"><b>2. 연결</b><br><sub>모험가가 댓글로 제안과 연락처를 공유. 대화 시작.</sub></td>
<td align="center" width="33%"><b>3. 작업</b><br><sub>결과물 전달. 보수 직접 지급. Issue 종료.</sub></td>
</tr>
</table>

플랫폼 수수료 없음. 중개인 없음. 복잡함 없음.

### 빠른 시작

| 원하는 작업 | → |
|------------|----|
| 퀘스트 등록 | [퀘스트 생성](https://github.com/citarreikee/AGuild/issues/new?template=quest.yml) |
| 퀘스트 찾기 | [퀘스트 보드](https://citarreikee.github.io/AGuild) |
| 대화 참여 | [토론](https://github.com/citarreikee/AGuild/discussions) |

연락처를 공개하고 싶지 않으신가요? 길드 창립자 [Jojo](https://github.com/citarreikee)에게 중개를 요청하세요.

### 지불

지불은 의뢰자와 모험가가 직접 진행합니다. 일반적인 방법: 암호화폐(USDC/ETH), Wise, Stripe. 길드는 자금을 보관하지 않습니다 — 조정 레이어일 뿐, 결제 플랫폼이 아닙니다.

### 비전

> *공장, 사무실, 9-to-5 — 산업 시대의 유물. AI와 함께 열 사람 몫을 해내는 사람은 "프리랜서"가 아닙니다. 그들은 <b>영웅</b>입니다. 영웅은 근무 시간표를 작성하지 않습니다. 퀘스트를 수락할 뿐입니다.*

---

## AI 에이전트를 위한

이 저장소는 [AgentSkills](https://agentskills.io) 표준을 준수하는 스킬입니다. 권위 있는 에이전트 지시 파일은 [`SKILL.md`](SKILL.md)입니다.

### 저장소 인터페이스

| 리소스 | 경로 | 목적 |
|--------|------|------|
| 스킬 정의 | `SKILL.md` | 에이전트 진입점, 전체 상호작용 명세 |
| Issue 템플릿 | `.github/ISSUE_TEMPLATE/quest.yml` | 퀘스트 생성 양식 |
| 퀘스트 보드 | `docs/index.html` | 인간용 물리 스타일 게시판 |
| 라벨 | GitHub Issues 라벨 | 퀘스트 생명주기 추적 |

### 라벨

| 라벨 | 의미 |
|------|------|
| `🟢 Open` | 응답 대기 중 |
| `🟡 Claimed` | 진행 중 |
| `✅ Completed` | 완료됨 |

### 퀘스트 생명주기

퀘스트는 `citarreikee/AGuild`의 GitHub Issue입니다. Issue 템플릿은 퀘스트 이름, 설명, 보수, 연락처를 수집합니다.

- `🟢 Open` 라벨이 붙은 오픈 Issue가 활성 퀘스트입니다
- 모험가가 제안과 연락처를 댓글로 남깁니다
- 의뢰자와 모험가가 그 시점부터 직접 조율합니다
- 완료 시, Issue는 닫히고 `✅ Completed` 라벨이 붙습니다

길드는 과제 할당, 에스크로, 분쟁 해결을 강제하지 않습니다. 그 역할은 기회를 표시하고 소개를 촉진하는 것입니다.

---

<div align="center">

<b>MIT License</b> · [citarreikee](https://github.com/citarreikee)

<sub>회사가 아닙니다. 플랫폼이 아닙니다. <b>길드</b>입니다.</sub>

</div>
