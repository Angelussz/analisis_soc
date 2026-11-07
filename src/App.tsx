import { Layout } from '@/components/layout/Layout'
import { DashboardPage } from '@/pages/DashboardPage'
import { IncidentsPage } from '@/pages/IncidentsPage'
import { LogsPage } from '@/pages/LogsPage'
import { ReportPage } from '@/pages/ReportPage'
import { useLogStore } from '@/store/logStore'

export default function App() {
  const { activeTab } = useLogStore()

  return (
    <Layout>
      {activeTab === 'dashboard' && <DashboardPage />}
      {activeTab === 'incidents' && <IncidentsPage />}
      {activeTab === 'logs' && <LogsPage />}
      {activeTab === 'report' && <ReportPage />}
    </Layout>
  )
}
