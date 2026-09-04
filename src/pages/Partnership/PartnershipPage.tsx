import styles from './PartnershipPage.module.scss'
import partnershipImg from './assets/Partnership.png'

export default function PartnershipPage() {
  return (
    <div className={styles.page}>
      <img src={partnershipImg} alt="Partnership" className={styles.partnershipImg} />
      <div className={styles.orgChartWrapper}>
        <iframe
          src="AEP_Org_Chart_v2.html"
          className={styles.orgChartFrame}
          title="AEP Account Org Chart"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  )
}
