import { useState } from 'react';
import styles from './AIDock.module.css';

const tools = [
  {
    id: 'claude',
    name: 'Claude Code',
    icon: '✦',
    color: '#D97757',
    description: 'My primary AI coding partner. I use Claude Code for architecture decisions, complex refactors, and building production-ready components. It understands context deeply and writes code that actually fits the codebase.',
    usage: 'Daily — embedded in my workflow for design system development, prototyping, and code review.',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    icon: '⚡',
    color: '#6366F1',
    description: 'AI-native IDE for rapid prototyping and iteration. Cursor lets me move from idea to working code in minutes, not hours. I use it for building interactive prototypes that go beyond static mockups.',
    usage: 'Daily — primary development environment for all front-end work.',
  },
  {
    id: 'figma',
    name: 'Figma',
    icon: '🎨',
    color: '#1E1E1E',
    description: 'The foundation of my design process. Figma is where strategy becomes visual — wireframes, component systems, interaction specs, and stakeholder presentations all live here.',
    usage: 'Daily — design exploration, component libraries, team collaboration, and handoff.',
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: '💬',
    color: '#10A37F',
    description: 'My research and thinking partner. I use ChatGPT for exploring problem spaces, pressure-testing design rationale, writing user-facing copy, and synthesizing research findings.',
    usage: 'Frequently — research, content strategy, and design critique.',
  },
];

export default function AIDock() {
  const [activeId, setActiveId] = useState(tools[0].id);
  const activeTool = tools.find((t) => t.id === activeId);

  return (
    <div className={styles.dockSection}>
      {/* Shelf */}
      <div className={styles.shelf}>
        <span className={styles.shelfLabel}>My AI Toolkit</span>
        <div className={styles.dock}>
          {tools.map((tool) => (
            <button
              key={tool.id}
              className={`${styles.dockItem} ${activeId === tool.id ? styles.active : ''}`}
              onClick={() => setActiveId(tool.id)}
              aria-pressed={activeId === tool.id}
              aria-label={tool.name}
            >
              <div className={styles.dockIcon} style={{ background: tool.color }}>
                <span className={styles.dockEmoji}>{tool.icon}</span>
              </div>
              <span className={styles.dockName}>{tool.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content card — changes with selection */}
      <div className={styles.toolDetail} key={activeId}>
        <div className={styles.toolHeader}>
          <div className={styles.toolIconSmall} style={{ background: activeTool.color }}>
            <span className={styles.toolIconEmoji}>{activeTool.icon}</span>
          </div>
          <div>
            <h3 className={styles.toolName}>{activeTool.name}</h3>
            <span className={styles.toolUsage}>{activeTool.usage}</span>
          </div>
        </div>
        <p className={styles.toolDesc}>{activeTool.description}</p>
      </div>
    </div>
  );
}
