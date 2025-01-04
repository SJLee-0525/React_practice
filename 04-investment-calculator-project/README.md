# 4

## 숫자 값 올바르게 다루기

- `event.target.value`와 같은 방식으로 받은 값은 기본적으로 문자열로 취급
- 받은 값을 숫자로 연산하고자 하면 앞에 `+` 추가하기

```javascript
function handleInputValueChange(inputTarget, inputValue) {
  setInvestmentData((prevInvestmentData) => {
    // 앞에 + 기호를 넣어주면 int()와 같은 효과
    return { ...prevInvestmentData, [inputTarget]: +inputValue }
  })
}
```

### 보완 설명

- `+` 기호는 숫자로 변환할 수 없는 문자열(예: "abc")에 대해서는 `NaN`을 반환.
  - 이는 parseInt나 parseFloat과는 다름.
- 따라서, 입력 값이 반드시 숫자로 변환 가능하다는 전제가 없다면 `Number(inputValue)`를 사용하는 것이 더 명확하고 안전.
- 입력 값이 빈 문자열("")인 경우에도 `+""`는 0이 됨.

```javascript
function handleInputValueChange(inputTarget, inputValue) {
  // 입력 값을 숫자로 변환
  const numericValue = Number(inputValue)

  setInvestmentData((prevInvestmentData) => ({
    ...prevInvestmentData,
    [inputTarget]: numericValue,
  }))
}
```
