import styles from './ResourceChurnChart.module.scss'

const DEFINITIONS = [
  { term: 'Planned Release',        desc: 'Resource released based on planned date' },
  { term: 'Performance',            desc: 'Resource released due to performance issue' },
  { term: 'ML/LOA/Medical Reasons', desc: 'Resource going on leave of absence, medical reasons, or maternity/paternity leave' },
  { term: 'Attrition',              desc: 'Practioner leaving the organization' },
  { term: 'AEP request',            desc: 'Resource released due to AEP request' },
]

export interface ChurnBar {
  label: string
  value: number
}

const DEFAULT_DATA: ChurnBar[] = [
  { label: 'Planned Release', value: 1 },
  { label: 'Performance',     value: 0 },
  { label: 'ML/LOA',          value: 1 },
  { label: 'Attrition',       value: 0 },
  { label: 'AEP Request',     value: 0 },
  { label: 'Others',          value: 3 },
]

/** Definition table — renders on the text/left side */
export function ResourceChurnTable() {
  return (
    <table className={styles.defTable}>
      <thead>
        <tr>
          <th>Definition</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {DEFINITIONS.map(d => (
          <tr key={d.term}>
            <td>{d.term}</td>
            <td>{d.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

interface BarChartProps {
  data?: ChurnBar[]
}

/** Bar chart — renders on the chart/right side */
export default function ResourceChurnChart({ data = DEFAULT_DATA }: BarChartProps) {
  const max = Math.max(...data.map(d => d.value), 1)
  const CHART_H = 180 // px height of the bar area

  // generate grid lines at even numbers up to max
  const gridValues: number[] = []
  for (let v = 2; v <= Math.ceil(max); v += 2) gridValues.push(v)
  if (!gridValues.includes(Math.ceil(max)) && max > 0) gridValues.push(Math.ceil(max))

  return (
    <div className={styles.chartWrap}>
      <div className={styles.barChart} style={{ height: `${CHART_H + 30}px` }}>
        {/* Grid lines */}
        {gridValues.map(v => (
          <div
            key={v}
            className={styles.gridLine}
            style={{ bottom: `${(v / max) * CHART_H}px` }}
          >
            <span>{v}</span>
          </div>
        ))}

        {/* Bars */}
        {data.map(d => (
          <div key={d.label} className={styles.barGroup}>
            {d.value > 0 ? (
              <div
                className={styles.bar}
                style={{ height: `${(d.value / max) * CHART_H}px` }}
                title={`${d.label}: ${d.value}`}
              >
                <span className={styles.barValue}>{d.value}</span>
              </div>
            ) : (
              <div className={styles.barZero} />
            )}
            <span className={styles.barLabel}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
