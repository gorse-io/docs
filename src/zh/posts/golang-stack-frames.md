---
icon: golang
date: 2026-11-20
category:
  - 技术分享
tag:
  - 人工智能
---
# 大模型评测：复现 Go 汇编栈空间分配 BUG

Go 语言是一款热门的编程语言，但是在 Go 语言中直接使用 Go 汇编是比较冷门的操作。本文将评测主流大语言模型在调查 Go 汇编 BUG 任务中的表现，哪些模型的表现令人意外，哪些模型的表现又在情理之中。

## Go 汇编栈空间分配 BUG

```
Please write a minimal test in tests/universal_test.go that produces the crashes reported in this issue: https://github.com/gorse-io/goat/pull/56
```

## 主流大语言模型的表现

::: tabs

@tab:active Gemini 4 Neon (XHigh)

```go
func TestStackUnwinding(t *testing.T) {
	fr := trace.NewFlightRecorder(trace.FlightRecorderConfig{})
	if err := fr.Start(); err != nil {
		t.Fatal(err)
	}
	defer fr.Stop()

	res := add(1, 2)
	trace.Log(t.Context(), "", "")
	assert.Equal(t, int64(3), res)
}
```

```go
TEXT ·add(SB), $0-24
	MOVD a+0(FP), R0
	MOVD b+8(FP), R1
	WORD $0xd10043ff       // sub	sp, sp, #16
	WORD $0xf90007e0       // str	x0, [sp, #8]
	WORD $0xf90003e1       // str	x1, [sp]
	WORD $0xf94007e8       // ldr	x8, [sp, #8]
	WORD $0xf94003e9       // ldr	x9, [sp]
	WORD $0x8b090100       // add	x0, x8, x9
	WORD $0x910043ff       // add	sp, sp, #16
	MOVD R0, result+16(FP)
	RET
```

:::
