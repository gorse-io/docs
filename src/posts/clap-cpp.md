---
date: 2026-11-05
category:
  - technical
tag:
  - AI/ML
---
# clap.cpp: Audio Embedding Inference in GGML

Most inference engines support embedding models for text, images, and video, but almost none support audio embedding models. To generate audio embeddings, we typically need to use Python with PyTorch, or convert the model to ONNX and run it with ONNX runtime. There has been no out-of-the-box solution.

To fill this gap, we developed [clap.cpp](https://github.com/gorse-io/clap.cpp), an inference engine for audio embedding models implemented in C++20 and [GGML](https://github.com/ggml-org/ggml). It supports models such as CLAP, CLaMP3, MERT, MuQ, and MuQ-MuLan; provides a command-line interface, an HTTP service, and Python, Rust, and Node.js bindings; and supports hardware acceleration through Metal, Vulkan, CUDA, and ROCm.

## Supported Models

The project currently supports the following models:

| Model | Text | Audio | Dimensions | Sample Rate | License |
| --- | --- | --- | --- | --- | --- |
| [CLAP](https://huggingface.co/laion/larger_clap_music) | ✅ | ✅ | 512 | 48 kHz | [Apache-2.0](https://huggingface.co/laion/larger_clap_music) |
| [CLaMP3](https://github.com/sanderwood/clamp3) | ✅ | ✅ | 768 | 24 kHz | [MIT](https://huggingface.co/sander-wood/clamp3) |
| [MERT v1 95M](https://huggingface.co/m-a-p/MERT-v1-95M) | ❌ | ✅ | 768 | 24 kHz | [CC-BY-NC-4.0](https://huggingface.co/m-a-p/MERT-v1-95M) |
| [MERT v1 330M](https://huggingface.co/m-a-p/MERT-v1-330M) | ❌ | ✅ | 1,024 | 24 kHz | [CC-BY-NC-4.0](https://huggingface.co/m-a-p/MERT-v1-330M) |
| [MERT v2 FullSong](https://huggingface.co/m-a-p/MERT-v2-FullSong) / [30s](https://huggingface.co/m-a-p/MERT-v2-30s) | ❌ | ✅ | 1,024 | 24 kHz | [CC-BY-NC-4.0](https://huggingface.co/m-a-p/MERT-v2-FullSong) |
| [MuQ](https://huggingface.co/OpenMuQ/MuQ-large-msd-iter) | ❌ | ✅ | 1,024 | 24 kHz | [CC-BY-NC-4.0](https://huggingface.co/OpenMuQ/MuQ-large-msd-iter) |
| [MuQ-MuLan](https://huggingface.co/OpenMuQ/MuQ-MuLan-large) | ✅ | ✅ | 512 | 24 kHz | [CC-BY-NC-4.0](https://huggingface.co/OpenMuQ/MuQ-MuLan-large) |

CLAP and MuQ-MuLan map text and audio into the same embedding space, enabling cross-modal text-to-audio and audio-to-text retrieval. The remaining models support audio retrieval only. Each model also natively supports a different audio sample rate, and clap.cpp automatically resamples the input as needed.

clap.cpp uses GGUF as its model file format. GGUF versions of these models are available from the [Audio-Embedding-GGUF](https://huggingface.co/collections/gorse-io/audio-embedding-gguf) collection. Each model is provided in F16, Q8, and Q4_K_M quantized variants. When using them, you must comply with the license for the corresponding model weights.

## Embedding Audio and Text in Code

Audio embedding models typically have relatively few parameters, so local inference is sufficient for shorter audio clips. clap.cpp provides Python, Rust, and Node.js bindings.

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

The following examples load the model once, encode text and audio separately, and generate embeddings that can be compared using cosine similarity.

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

## Embedding Audio and Text over HTTP

clap.cpp also provides an HTTP service:

```bash
clap serve --model larger_clap_general-q4_k_m.gguf --host 127.0.0.1 --port 8080
```

The text embedding endpoint uses an OpenAI-compatible request format:

```bash
curl http://127.0.0.1:8080/v1/embeddings \
  -H 'Content-Type: application/json' \
  -d '{"model":"larger_clap_general-q4_k_m.gguf","input":["Sound of a dog","Sound of a vacuum cleaner"],"encoding_format":"float"}'
```

Audio requests use an `input_audio` content block. The `data` field contains the standard Base64 encoding of the complete audio file:

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

## Conclusion

The findings of [MAEB: Massive Audio Embedding Benchmark](https://huggingface.co/blog/AdnanElAssadi/maeb) show that audio embedding models face a trade-off between performance on language-related tasks and acoustic tasks. This means that choosing an audio embedding model requires more careful evaluation than choosing a text embedding model. In the future, we will publish comparisons of how these popular audio embedding models perform in recommender systems.
