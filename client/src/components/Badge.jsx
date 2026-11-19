// Small colored label. `tone` decides the color (see styles/index.css).
export default function Badge({ children, tone = 'neutral' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
