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

## 主流大语言模型的表现

> Please write a minimal test case with least code in tests/ that produces the crashes reported in this issue: https://github.com/gorse-io/goat/pull/56

### Gemini

::: tabs

@tab:active Gemini 4 Neon (XHigh)

```go
func TestStackUnwind(t *testing.T) {
	fr := trace.NewFlightRecorder(trace.FlightRecorderConfig{})
	assert.NoError(t, fr.Start())
	defer fr.Stop()
	assert.Equal(t, int64(3), add(1, 2))
	runtime.GC()
}
```

@tab Gemini 4 Argon (High)

```go
func TestAdd(t *testing.T) {
	a := int64(1)
	b := int64(2)
	c := add(a, b)
	assert.Equal(t, a+b, c)
	_ = trace.Start(io.Discard)
	trace.Stop()
}
```

@tab Gemini 4 Hydrogen (XHigh)

```go

```

@tab Gemini 3.8 (Flash)

```go

```

:::

### Claude

### GPT

### 其他模型

## 总结

| 模型 | CLI | 是否复现 |
|-|-|-|
| Gemini 4 Neon (XHigh) | Antigravity | ✅ |
| Gemini 4 Argon (High) | Antigravity | |
| Gemini 4 Hydrogen (XHigh) | Antigravity | |
| Gemini 3.8 (Flash) | Antigravity | |
| GPT-6.2-Astra xhigh | Codex | |
| GPT-6.2-Sol xhigh | Codex | |
| GPT-6.1-Astra xhigh | Codex | |
| GPT-6.1-Sol xhigh | Codex | |
