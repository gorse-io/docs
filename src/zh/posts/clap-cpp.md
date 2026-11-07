---
icon: clap
date: 2026-11-05
category:
  - 技术分享
tag:
  - 音频嵌入
---
# clap.cpp: 一个音频向量模型推理引擎

主流的推理引擎基本都支持文本、图像和视频的嵌入向量生成，然而它们几乎都不支持音频嵌入向量模型推理。如果我们需要为音频生成嵌入向量的话，就需要使用 Python 并安装 PyTorch 来进行模型推理，或者将模型转换为 ONNX 后使用 ONNX 运行时推理，缺少一个开箱即用方案。

于是我们开发了[clap.cpp](https://github.com/gorse-io/clap.cpp) ——一个使用 C++20 和 [GGML](https://github.com/ggml-org/ggml) 实现的音频向量模型推理引擎。它支持 CLAP、CLaMP3、MERT、MuQ 和 MuQ-MuLan 等模型，提供命令行、HTTP 服务以及 Python、Rust、Node.js 接口，并支持 Metal、Vulkan、CUDA 和 ROCM 硬件加速。

## 支持模型列表

项目目前支持的模型如下：

| 模型 | 文本 | 音频 | 维度 | 采样率 | 模型权重许可证 |
| --- | --- | --- | --- | --- | --- |
| [CLAP](https://huggingface.co/laion/larger_clap_music) | ✅ | ✅ | 512 | 48 kHz | [Apache-2.0](https://huggingface.co/laion/larger_clap_music) |
| [CLaMP3](https://github.com/sanderwood/clamp3) | ✅ | ✅ | 768 | 24 kHz | [MIT](https://huggingface.co/sander-wood/clamp3) |
| [MERT v1 95M](https://huggingface.co/m-a-p/MERT-v1-95M) | ❌ | ✅ | 768 | 24 kHz | [CC-BY-NC-4.0](https://huggingface.co/m-a-p/MERT-v1-95M) |
| [MERT v1 330M](https://huggingface.co/m-a-p/MERT-v1-330M) | ❌ | ✅ | 1,024 | 24 kHz | [CC-BY-NC-4.0](https://huggingface.co/m-a-p/MERT-v1-330M) |
| [MERT v2 FullSong](https://huggingface.co/m-a-p/MERT-v2-FullSong) / [30s](https://huggingface.co/m-a-p/MERT-v2-30s) | ❌ | ✅ | 1,024 | 24 kHz | [CC-BY-NC-4.0](https://huggingface.co/m-a-p/MERT-v2-FullSong) |
| [MuQ](https://huggingface.co/OpenMuQ/MuQ-large-msd-iter) | ❌ | ✅ | 1,024 | 24 kHz | [CC-BY-NC-4.0](https://huggingface.co/OpenMuQ/MuQ-large-msd-iter) |
| [MuQ-MuLan](https://huggingface.co/OpenMuQ/MuQ-MuLan-large) | ✅ | ✅ | 512 | 24 kHz | [CC-BY-NC-4.0](https://huggingface.co/OpenMuQ/MuQ-MuLan-large) |

CLAP 和 MuQ-MuLan 将文本和音频映射到同一个向量空间，可以用于跨文本和音频检索，而剩余模型只能用于音频检索。每个模型原生支持的音频采样率也不同，clap.cpp会自动重采样。

clap.cpp 的模型文件格式为 GGUF，这些模型的 GGUF 版本可以从 [Audio-Embedding-GGUF](https://huggingface.co/collections/gorse-io/audio-embedding-gguf)获取，每个模型提供 F16、Q8、Q4_K_M 三种量化版本，使用过程中需要遵循模型权重许可证。

## 在代码中向量化音频和文本

音频向量模型的参数量通常较少，对于较短的音频，本地推理就已足够。clap.cpp 提供 Python、Rust 和 Node.js 绑定。


::: code-tabs

@tab:active Python


```bash
pip install clap-cpp
```

@tab Rust


```bash
cargo add clap-cpp
```

@tab Node.js

```bash
npm install clap-cpp
```

:::


下面的示例加载一次模型，分别编码文本和音频，生成可用于余弦相似度比较的向量。

::: code-tabs

@tab:active Python

```python
from clap_cpp import CLAP

with CLAP("larger_clap_general-q4_k_m.gguf") as model:
    text_embedding = model.encode_text("Sound of a dog")
    audio_embedding = model.encode_audio("dog.wav")
```

@tab Rust

```rust
use clap_cpp::CLAP;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut model = CLAP::new("larger_clap_general-q4_k_m.gguf", 4)?;
    let text_embedding = model.encode_text("Sound of a dog")?;
    let audio_embedding = model.encode_audio("dog.wav", 0)?;
    Ok(())
}
```

@tab Node.js

```javascript
const { CLAP } = require("clap-cpp");

const model = new CLAP("larger_clap_general-q4_k_m.gguf");
try {
  const textEmbedding = model.encodeText("Sound of a dog");
  const audioEmbedding = model.encodeAudio("dog.wav");
} finally {
  model.close();
}
```

:::

## 通过 HTTP 向量化音频和文本

clap.cpp 也提供了 HTTP 服务：

```bash
clap serve --model larger_clap_general-q4_k_m.gguf --host 127.0.0.1 --port 8080
```

文本嵌入接口采用 OpenAI 兼容的请求形式：

```bash
curl http://127.0.0.1:8080/v1/embeddings \
  -H 'Content-Type: application/json' \
  -d '{"model":"larger_clap_general-q4_k_m.gguf","input":["Sound of a dog","Sound of vaccum cleaner"],"encoding_format":"float"}'
```

音频请求使用 `input_audio` 内容块，数据是完整音频文件的标准 Base64 编码：

```bash
audio_data="$(base64 < music.flac | tr -d '\r\n')"

curl http://127.0.0.1:8080/v1/embeddings \
  -H 'Content-Type: application/json' \
  --data-binary @- <<JSON
{
  "model": "larger_clap_general-q4_k_m.gguf",
  "input": [
    {
      "content": [
        {
          "type": "input_audio",
          "input_audio": {"data": "${audio_data}"}
        }
      ]
    }
  ]
}
JSON
```

## 结语

[MAEB: Massive Audio Embedding Benchmark](https://huggingface.co/blog/AdnanElAssadi/maeb) 的研究结果表明，音频向量模型在语言任务上的表现和声学任务上的表现不可兼得，这意味着音频向量模型的选择相比文本向量模型需要更谨慎的评估。在未来，我们还会更新这些主流的音频向量模型在推荐系统中的表现对比。
