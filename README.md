# MAWAM: Joint Imagination for Collaborative Robot Manipulation with a Multi-Agent World Action Model

<p align="center">
  <a href="https://embodiedcity.github.io/MAWAM/"><b>🌐 Project Page</b></a> &nbsp;|&nbsp;
  <a href="https://arxiv.org/abs/2611.29501"><b>📚 arXiv</b></a> &nbsp;|&nbsp;
  <a href="https://arxiv.org/pdf/2611.29501"><b>📄 Paper (PDF)</b></a> &nbsp;|&nbsp;
  <a href="https://huggingface.co/EmbodiedCity/MAWAM"><b>🤗 Models</b></a> &nbsp;|&nbsp;
  <a href="https://huggingface.co/datasets/EmbodiedCity/MA-Bench"><b>📦 MA-Bench</b></a>
</p>

**Rongze Tang**<sup>1,3</sup>, **Chenyu Zhou**<sup>2,3</sup>, **Jianjie Fang**<sup>4</sup>, **Ziming Liu**<sup>4</sup>, **Zhaolu Wang**<sup>3</sup>, **Ziyou Wang**<sup>4</sup>, **Xvyuan Liu**<sup>4</sup>, **Wei Wu**<sup>5</sup>, **Chen Gao**<sup>3,4,&dagger;</sup>, **Yong Li**<sup>4</sup>, **Zhibo Chen**<sup>1,3,&dagger;</sup>

<sup>1</sup>University of Science and Technology of China &nbsp;&middot;&nbsp; <sup>2</sup>Nanjing University &nbsp;&middot;&nbsp; <sup>3</sup>Zhongguancun Academy &nbsp;&middot;&nbsp; <sup>4</sup>Tsinghua University &nbsp;&middot;&nbsp; <sup>5</sup>Manifold AI  
<sup>&dagger;</sup>Corresponding authors (`chgao96@gmail.com`, `chenzhibo@ustc.edu.cn`)

---

## Overview

World action models (WAMs) advance robot manipulation by grounding control in visual foresight, yet existing formulations remain single-embodiment. We present **MAWAM**, a multi-agent world action model that introduces the **agent** as a first-class modeling axis:

- **Joint Spatiotemporal Imagination**: Within one unified causal sequence, joint self-attention aligns all robots' predicted future observations before decoding each robot's native embodiment actions.
- **MA-Task Harness & MA-Bench**: Formalizing *multi-agent-necessary* manipulation along three axes (*why*, *when*, and *who*), our coding-agent co-evolution harness produces **MA-Bench**—seven closed-loop multi-robot tasks spanning asynchronous handoffs, cross-table partial observability, partially synchronous holds, and synchronous $SE(3)$ / dynamic co-manipulation across homogeneous and heterogeneous robot teams.
- **Simulation & Real-Robot Performance**: MAWAM achieves **82.7%** mean joint success on MA-Bench and **63.3%** real-time closed-loop joint success on a heterogeneous physical **Franka FR3 + dual-arm AgileX Cobot Magic** robot team.

## Citation

```bibtex
@article{tang2026mawam,
  title   = {MAWAM: Joint Imagination for Collaborative Robot Manipulation
             with a Multi-Agent World Action Model},
  author  = {Rongze Tang and Chenyu Zhou and Jianjie Fang and Ziming Liu and
             Zhaolu Wang and Ziyou Wang and Xvyuan Liu and Wei Wu and
             Chen Gao and Yong Li and Zhibo Chen},
  journal = {arXiv preprint arXiv:2611.29501},
  year    = {2026}
}
```
