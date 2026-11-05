---
icon: music
date: 2026-11-05
category:
  - 技术分享
tag:
  - 音频嵌入
  - 推荐系统
  - C++
---
# clap.cpp：让音频嵌入模型在本地运行

一首歌的标题、歌手和流派可以描述音乐，却很难完整表达它听起来是什么样的。对于音乐搜索和推荐系统，如果能直接把音频转换为向量，就可以围绕声音本身寻找相似内容；如果文本和音频还能映射到同一个向量空间，就可以用“轻快的爵士乐，适合清晨听”这样的描述搜索音乐。

[clap.cpp](https://github.com/gorse-io/clap.cpp) 是一个使用 C++20 和 [ggml](https://github.com/ggml-org/ggml) 实现的音频嵌入推理项目。它支持 CLAP、CLaMP3、MERT、MuQ 和 MuQ-MuLan 等模型，使用 GGUF 保存模型，并提供命令行、HTTP 服务以及 Python、Rust、Node.js 接口。它关注的不是语音转写或音乐生成，而是把音频和模型支持的文本输入转换为可用于检索的数值表示。

## 为什么需要原生音频推理

音频嵌入模型的研究实现通常围绕 Python 和深度学习框架展开。研究时，这些工具方便调试和训练；部署时，我们更关心如何把模型接到现有服务中，以及如何控制运行环境和依赖。

clap.cpp 将模型推理放在原生运行时中：模型准备好之后，推理不需要安装 PyTorch。对于已有应用，可以在进程内调用语言绑定；对于需要复用模型的多个服务，可以单独启动 HTTP 服务；对于离线任务，则可以直接使用命令行生成向量。

音频输入也做了统一处理：支持 WAV、MP3 和 FLAC，自动把立体声及多声道混合为单声道，再重采样到模型要求的采样率。应用不必为了切换模型重新编写一套音频解码和重采样流程。不过，统一输入接口并不意味着所有模型具有相同的截断、分段和池化策略，处理长音频时仍需结合具体模型评估。

## 先选模型，再选检索方式

不同模型输出的向量不能因为维度相同就混在一起使用。首先要区分两类需求：

- **音频与音频检索**：输入一段音乐，寻找声音或音乐特征相近的内容，可以使用音频编码器。
- **文本与音频检索**：输入一句描述，寻找对应的音频，需要使用具有对齐文本、音频表示的模型。

项目目前支持的模型如下，维度和采样率以对应模型为准：

| 模型 | 文本输入 | 音频输入 | 向量维度 | 音频采样率 |
| --- | --- | --- | --- | --- |
| CLAP | 支持 | 支持 | 512 | 48 kHz |
| CLaMP3 | 支持 | 支持 | 768 | 24 kHz |
| MERT v1 95M | 不支持 | 支持 | 768 | 24 kHz |
| MERT v1 330M | 不支持 | 支持 | 1,024 | 24 kHz |
| MERT v2 FullSong / 30s | 不支持 | 支持 | 1,024 | 24 kHz |
| MuQ | 不支持 | 支持 | 1,024 | 24 kHz |
| MuQ-MuLan | 支持 | 支持 | 512 | 24 kHz |

例如，需要“用文字找音乐”时，可以从 CLAP、CLaMP3 或 MuQ-MuLan 入手；只做音乐相似检索时，也可以评估 MERT 或 MuQ。模型支持文本输入不代表它对任意语言、流派和描述都同样有效，仍应使用业务数据验证检索质量。

已经转换好的模型可以从 [Gorse 的音频嵌入 GGUF 集合](https://huggingface.co/collections/gorse-io/audio-embedding-gguf)获取。请使用项目适配的模型文件，而不是把任意模型改成 `.gguf` 扩展名；代码许可证与模型权重许可证也应分别检查。

## 从命令行开始

下面以源码编译的 CPU 版本为例。需要 Git、支持 C++20 的编译器和 CMake 3.20 或更高版本。克隆时必须初始化子模块：

```bash
git clone --recursive https://github.com/gorse-io/clap.cpp.git
cd clap.cpp
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release -DBUILD_TESTING=OFF
cmake --build build --config Release --parallel 4
```

下面的命令按 Linux 下的构建目录编写。下载一个支持文本和音频的 CLAP GGUF，将其保存为当前目录下的 `model.gguf`，并准备一段 `music.flac`：

```bash
./build/clap embedding --model model.gguf --text 'A jazz quartet.'
./build/clap embedding --model model.gguf --audio music.flac
```

这两条命令分别输出一个 JSON 向量。文本和音频使用同一个模型，才能在它对齐的空间中比较。MERT 和 MuQ 等仅支持音频的模型不能用于第一条命令。

也可以指定 CPU 和线程数，便于控制批处理任务的资源占用：

```bash
./build/clap embedding --model model.gguf --audio music.flac --device cpu --threads 4
```

命令行适合快速验证模型和处理少量文件。大量文件逐个启动进程会反复加载模型，此时更适合使用语言绑定或长驻服务。

## 使用 Python 比较文本和音频

Python 包的名称是 `clap-cpp`，导入路径是 `clap_cpp`：

```bash
python3 -m pip install clap-cpp
```

下面的示例加载一次模型，分别编码文本和音频，再计算余弦相似度。`model.gguf` 同样需要是支持两种输入的模型，模型权重不会在安装 Python 包时自动下载。

```python
import math

from clap_cpp import CLAP


def cosine(left, right):
    if len(left) != len(right):
        raise ValueError("Embedding dimensions do not match")
    dot = sum(a * b for a, b in zip(left, right))
    norm = math.sqrt(sum(a * a for a in left)) * math.sqrt(
        sum(b * b for b in right)
    )
    return dot / norm if norm else 0.0


with CLAP("model.gguf", threads=4) as model:
    text_embedding = model.encode_text("A jazz quartet.")
    audio_embedding = model.encode_audio("music.flac")
    print("dimension:", model.projection_dimension)
    print("cosine similarity:", cosine(text_embedding, audio_embedding))
```

`encode_text` 和 `encode_audio` 返回 `list[float]`，因此这个例子不需要 NumPy。示例显式计算向量范数，不假设所有模型的输出都已经归一化。余弦相似度是排序信号，不是“这首歌属于爵士乐的概率”，也不宜直接套用跨模型通用的判断阈值。

Python 绑定通过标准库 `ctypes` 调用原生 C API，基础包不依赖 PyTorch，也不需要额外运行 `clap` 进程。其他语言可以参阅项目的 [Rust](https://github.com/gorse-io/clap.cpp/tree/main/rust) 和 [Node.js](https://github.com/gorse-io/clap.cpp/tree/main/node) 绑定。

## 启动嵌入服务

如果应用不方便直接链接原生库，可以启动 HTTP 服务。模型在启动时加载，而不是每次请求都重新加载：

```bash
./build/clap serve --model model.gguf --host 127.0.0.1 --port 8080
```

文本嵌入接口采用 OpenAI 兼容的请求形式：

```bash
curl http://127.0.0.1:8080/v1/embeddings \
  -H 'Content-Type: application/json' \
  -d '{"model":"model.gguf","input":["A jazz quartet.","A solo piano."],"encoding_format":"float"}'
```

这里的 `model` 是已加载 GGUF 的**文件名**，不是完整路径，也不是 Hugging Face 仓库名称。返回的向量位于 `data` 数组中。

音频请求使用 `input_audio` 内容块，数据是完整音频文件的标准 Base64 编码。这是项目的音频输入扩展，不应假设所有兼容文本嵌入接口的客户端都能直接发送这种请求：

```python
import base64
import json
import urllib.request

with open("music.flac", "rb") as audio:
    data = base64.b64encode(audio.read()).decode("ascii")

payload = {
    "model": "model.gguf",
    "input": [
        {"content": [{"type": "input_audio", "input_audio": {"data": data}}]}
    ],
}
request = urllib.request.Request(
    "http://127.0.0.1:8080/v1/embeddings",
    data=json.dumps(payload).encode("utf-8"),
    headers={"Content-Type": "application/json"},
    method="POST",
)
with urllib.request.urlopen(request) as response:
    result = json.load(response)
    print(result["data"][0]["embedding"])
```

本地服务默认监听回环地址。需要对外提供服务时，应在部署层配置访问控制、TLS 和请求限制，而不是直接把推理端口暴露到公网。

## 量化与硬件加速的边界

clap.cpp 提供 `Q8_0` 和混合精度的 `Q4_K_M` 量化预设，可以从 F32/F16 模型生成量化文件：

```bash
./build/clap quantize --type Q8_0 model.gguf model-q8.gguf
./build/clap quantize --type Q4_K_M model.gguf model-q4.gguf
```

输出文件必须不存在，且不能把已经量化的模型再次作为输入。量化并不是把所有权重统一改成同一种低精度类型：不满足条件的张量会保留原类型，`Q4_K_M` 还会对部分敏感权重使用更高精度。量化后的文件大小、运行内存、推理速度和检索质量需要分别测量，不能仅凭名称推断加速比例。

硬件支持同样需要区分“编译了某个后端”和“模型的全部计算都在 GPU 上执行”。项目提供设备枚举和设备选择，各架构共用支持 GPU 调度的计算路径，但实际卸载范围取决于后端、算子、精度要求和编译选项，部分计算仍可能在 CPU 上完成。具体安装方式和系统运行库要求请参阅 [Python 绑定文档](https://github.com/gorse-io/clap.cpp/tree/main/python)，不要把安装 GPU 包等同于端到端 GPU 加速或确定的性能收益。

## 如何接到推荐系统中

音频向量可以作为推荐系统的一路内容信号，而不是替代全部推荐逻辑。一条可行的接入流程是：

1. **离线编码**：使用固定模型和预处理策略，为音乐库生成音频向量，同时记录模型版本和音频片段策略。
2. **建立索引**：将向量连同歌曲 ID 存入向量数据库，按余弦相似度等适合该表示的度量建立检索索引。
3. **生成候选**：用用户正在听的歌曲进行相似歌曲召回；使用支持跨模态的模型时，也可以用文本描述召回音乐。
4. **融合排序**：结合用户行为、协同过滤、流行度以及业务约束，对候选集合做进一步排序。

对于尚未积累交互数据的新歌曲，内容向量可以提供一条候选召回路径；但“声音相似”不等于“用户喜欢”，仍需通过离线评估和线上实验验证效果。更换模型、量化方案或音频处理策略时，应重新评估是否需要重建整个向量索引，不能只替换查询侧模型。

这是一种推荐系统集成思路，并不意味着 Gorse 已经内置上述完整音频处理流程。clap.cpp 负责生成向量，向量存储、候选融合和个性化排序仍由应用选择和组织。

## 小结

clap.cpp 把多种音频嵌入模型放进同一个原生推理项目，让命令行验证、进程内调用和 HTTP 服务能够共用模型与输入处理能力。对于音乐搜索和推荐应用，可以先选择合适的模型，用少量真实音频验证检索效果，再决定量化、硬件加速和服务部署方式。

项目地址：[gorse-io/clap.cpp](https://github.com/gorse-io/clap.cpp)。
