
# Veridion Multi Agent Orchestrator (Node.js)

> Async multi agent workflow orchestration, LangGraph state machine execution, BullMQ queue management, and real time WebSocket streaming.

---

## Overview & Responsibilities

The Node.js orchestrator serves as the primary workflow coordinator for Veridion. Built on LangGraph, it executes state graph workflows using specialised agents, coordinates background tasks through BullMQ queues, checks semantic caches, and streams real time state updates to the UI via WebSockets.

### Core Responsibilities
- **LangGraph Agent Workflow**: Orchestrating multi agent state machines to verify legal clauses, draft compliance summaries, and format UI visualizers.
- **BullMQ Human in the Loop (HITL)**: Managing asynchronous queues for human compliance review when agent confidence drops below specified thresholds.
- **Semantic Caching**: Performing vector similarity checks in Redis to instantly return cached workflow outputs for similar queries.
- **WebSocket Gateway**: Streaming step-by-step agent execution nodes, token logs, and execution states to the Next.js client.
- **FastAPI Integration**: Driving downstream RAG retrieval, chunking, and evaluation requests via async HTTP.

---

## Agent Architecture

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'fontSize': '16px',
    'fontFamily': 'inter, sans-serif'
  },
  'flowchart': {
    'nodeSpacing': 40,
    'rankSpacing': 50,
    'curve': 'basis'
  }
}}%%
flowchart TD
    %% Custom Node Styling
    classDef inputStyle fill:#0F172A,stroke:#38BDF8,stroke-width:2px,color:#F8FAFC
    classDef cacheStyle fill:#0F172A,stroke:#EC4899,stroke-width:2px,color:#F8FAFC
    classDef agentStyle fill:#0F172A,stroke:#A855F7,stroke-width:2px,color:#F8FAFC
    classDef decisionStyle fill:#0F172A,stroke:#F59E0B,stroke-width:2px,color:#F8FAFC
    classDef queueStyle fill:#0F172A,stroke:#EF4444,stroke-width:2px,color:#F8FAFC
    classDef outStyle fill:#0F172A,stroke:#10B981,stroke-width:2px,color:#F8FAFC

    %% Diagram Nodes
    REQ(["Incoming User Request"]):::inputStyle
    CACHE["Node Semantic Cache"]:::cacheStyle
    LEGAL["Legal Verifier Agent<br/><i>(Queries FastAPI Retrieval)</i>"]:::agentStyle
    SUMM["Summarizer Agent<br/><i>(Builds Version Diff)</i>"]:::agentStyle
    
    CONF{Confidence Check}:::decisionStyle
    
    VIS["Visualizer Agent<br/><i>(Generates UI Artifacts)</i>"]:::agentStyle
    HITL["BullMQ HITL Queue<br/><i>(Pending Reviewer Action)</i>"]:::queueStyle
    
    WS["WebSocket Client Broadcast"]:::outStyle

    %% Sequential Execution
    REQ --> CACHE
    CACHE -->|"Cache Miss"| LEGAL
    LEGAL --> SUMM
    SUMM --> CONF

    %% Conditional Branching
    CONF -->|"> 0.8"| VIS
    CONF -->|"<= 0.8"| HITL

    %% Convergence
    VIS --> WS
    HITL --> WS
```

### Agent Roles & Specifications
1. **Legal Verifier Agent**
   - **Responsibilities**: Queries FastAPI RAG endpoints, verifies document version matches, and validates regulatory authority.
2. **Summarizer Agent**
   - **Responsibilities**: Computes version-to-version compliance deltas, highlights form requirements, and structures textual output.
3. **Visualizer Agent**
   - **Responsibilities**: Formats structured data models for rendering interactive timelines, form error maps, and comparison charts in the frontend.

---

## Human-in-the-Loop (HITL) Queue Flow

When an agent detects low retrieval confidence or potential version conflicts, it suspends execution and enqueues a job into BullMQ:

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'fontSize': '16px',
    'fontFamily': 'inter, sans-serif'
  },
  'flowchart': {
    'nodeSpacing': 35,
    'rankSpacing': 45,
    'curve': 'basis'
  }
}}%%
flowchart TD
    %% Custom Styling
    classDef agentStyle fill:#0F172A,stroke:#A855F7,stroke-width:2px,color:#F8FAFC
    classDef failStyle fill:#0F172A,stroke:#EF4444,stroke-width:2px,color:#F8FAFC
    classDef queueStyle fill:#0F172A,stroke:#F59E0B,stroke-width:2px,color:#F8FAFC
    classDef portalStyle fill:#0F172A,stroke:#38BDF8,stroke-width:2px,color:#F8FAFC
    classDef passStyle fill:#0F172A,stroke:#10B981,stroke-width:2px,color:#F8FAFC

    %% Nodes
    AGENT(["Agent Execution"]):::agentStyle
    CHECK{"Confidence Check"}:::failStyle
    QUEUE["BullMQ Queue<br/><i>(Pending Task)</i>"]:::queueStyle
    PORTAL["Human Reviewer Portal<br/><i>(Manual Review)</i>"]:::portalStyle
    RESUME(["Workflow Resumes"]):::passStyle

    %% Top-Down Flow
    AGENT --> CHECK
    CHECK -->|"Failed (<= 0.8)"| QUEUE
    QUEUE --> PORTAL
    PORTAL -->|"Reviewer Approves"| RESUME
```

---

## Semantic Cache Strategy

Before delegating execution to the LangGraph engine, the Node service embeds the incoming query and performs a cosine similarity check against Redis stored workflow results:

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'fontSize': '18px',
    'fontFamily': 'inter, sans-serif'
  },
  'flowchart': {
    'nodeSpacing': 80,
    'rankSpacing': 90
  }
}}%%
flowchart LR
    %% Custom Styling
    classDef inputStyle fill:#0F172A,stroke:#38BDF8,stroke-width:3px,color:#F8FAFC,font-size:18px,padding:16px;
    classDef embedStyle fill:#0F172A,stroke:#A855F7,stroke-width:3px,color:#F8FAFC,font-size:18px,padding:16px;
    classDef redisStyle fill:#0F172A,stroke:#EF4444,stroke-width:3px,color:#F8FAFC,font-size:18px,padding:16px;
    classDef checkStyle fill:#0F172A,stroke:#F59E0B,stroke-width:3px,color:#F8FAFC,font-size:18px,padding:16px;
    classDef hitStyle fill:#0F172A,stroke:#10B981,stroke-width:3px,color:#F8FAFC,font-size:18px,padding:16px;
    classDef missStyle fill:#0F172A,stroke:#64748B,stroke-width:3px,color:#F8FAFC,font-size:18px,padding:16px;

    USER(["User Query"]):::inputStyle
    EMBED["Generate Query Embedding"]:::embedStyle
    REDIS[("Redis Vector Index Search")]:::redisStyle
    CHECK{"Similarity Check"}:::checkStyle
    
    CACHE_HIT["Return Cached Response"]:::hitStyle
    CACHE_MISS["Call LLM & Cache Result"]:::missStyle

    USER --> EMBED --> REDIS --> CHECK
    CHECK -->|"Hit (> 0.92)"| CACHE_HIT
    CHECK -->|"Miss (≤ 0.92)"| CACHE_MISS
    CACHE_HIT --> USER
    CACHE_MISS --> USER
```
---

## Real time WebSockets Interface

The WebSocket gateway (`/ws/agent-monitor`) streams real time execution states directly to the Performance Center and Live Agent Dashboard:

- `AGENT_START`: Triggered when an agent node receives control.
- `AGENT_STREAM_TOKEN`: Delta text tokens emitted during generation.
- `AGENT_COMPLETE`: Emitted upon node execution success.
- `HITL_REQUIRED`: Dispatched when execution halts for human approval.

---

## Production Improvements

The following architectural updates are planned for production scaling:

- **Connection Pooling (pgBouncer)**: In production, deploy pgBouncer between application services and PostgreSQL to reduce connection overhead, improve concurrency, and protect the database under high request volumes. This complements SQLAlchemy pooling and is especially valuable when running multiple FastAPI and Node.js instances.
- **Authentication & RBAC**: Implement WebSocket connection token validation and role based agent tool access control.
- **Supervisor Agent Architecture**: Transition linear LangGraph graphs to dynamic hierarchical supervisor topologies with planning capability.
- **Agent Memory Persistence**: Implement long term episodic and conversational memory backed by PostgreSQL.
- **Multi Agent Voting**: Introduce consensus voting nodes among multiple verifier agents to reduce false positives in legal analysis.