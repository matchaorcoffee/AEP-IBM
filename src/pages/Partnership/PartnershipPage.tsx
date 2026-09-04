import styles from './PartnershipPage.module.scss'
import partnershipImg from './assets/Partnership.png'
import accountLeadershipImg from './assets/AccountLeadership.png'
import projectLeadershipImg from './assets/ProjectLeadership.png'

export default function PartnershipPage() {
  return (
    <div className={styles.page}>
      <img src={partnershipImg} alt="Partnership" className={styles.partnershipImg} />
      <img src={accountLeadershipImg} alt="Account Leadership" className={styles.image} />
      <img src={projectLeadershipImg} alt="Project Leadership" className={styles.image} />
    </div>
  )
}
