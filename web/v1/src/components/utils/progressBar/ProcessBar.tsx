import React from "react";
import styles from "./ProcessBar.module.css"

interface ProcessBarProps {
  className?: string,
}

export const ProcessBar: React.FC<ProcessBarProps> = ({className}) => {
  return <div className={className}>
    <div className={styles.Icon}>
      <div className={styles.Cut}>
        <div className={styles.Donut}/>
      </div>
    </div>
  </div>
}
