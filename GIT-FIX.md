# Git Push 오류 해결

## 문제
원격 저장소에 로컬에 없는 변경사항이 있습니다.
(GitHub에서 README나 다른 파일을 만들었을 수 있습니다)

## 해결 방법

### 방법 1: Pull 후 Push (안전한 방법)

```bash
# 원격 변경사항 가져오기
git pull origin main --allow-unrelated-histories

# 충돌이 있으면 해결 후
git add .
git commit -m "Merge remote changes"

# 다시 push
git push origin main
```

### 방법 2: Force Push (주의!)

로컬 코드가 최신이고 원격의 변경사항을 무시하고 싶다면:

```bash
git push origin main --force
```

⚠️ 주의: 이 방법은 원격 저장소의 변경사항을 덮어씁니다!
