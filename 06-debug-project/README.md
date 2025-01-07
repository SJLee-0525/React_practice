# 6
## Strict Mode
```jsx
// main.jsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```
- react에서 import하는 내장 컴포넌트
- 다른 컴포넌트들을 감싸는 용도
- 대부분은 App 컴포넌트를 감싸지만, 어디서든 사용할 수 있음. 
- 내부의 모든 컴포넌트 함수들을 2번씩 실행함
- 단 개발 단계에서만 2번씩 실행하고, 배포 목적으로 서버에 업로드한다면 1번씩만 실행함 (성능 저하 문제)
- StrictMode를 사용하면 에러를 조금 더 쉽게 즉각적으로 찾을 수 있음
