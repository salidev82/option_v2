import React, { FC, useState } from 'react'
import CoveredCallSummaryModal from './CoveredCallSummaryModal'
import CoveredCallRiskCalclutor from './CoveredCallRiskCalclutor'
import CoveredCallModalChart from './CoveredCallModalChart'

type Props = {
    row: any
}

const CoveredCallModal: FC<Props> = ({ row }) => {

    const [historicalDays, setHistroicalDays] = useState(250)


    return (
        <div className='space-y-5'>
            <CoveredCallSummaryModal data={row} />
            <CoveredCallRiskCalclutor data={row} historicalDays={historicalDays} setHistroicalDays={setHistroicalDays} />
            <CoveredCallModalChart data={row} />
        </div>
    )
}

export default React.memo(CoveredCallModal)