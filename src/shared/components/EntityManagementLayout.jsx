import { useState } from 'react'
import { PageHeader } from './PageHeader'
import { TabNavigation } from './TabNavigation'

/**
 * Generic EntityManagementLayout Component
 * Reusable layout for entity management pages (drivers, vehicles, riders, etc.)
 *
 * Props:
 * - title: Page title
 * - description: Page description
 * - headerActions: Optional JSX for header actions (dropdown, buttons, etc.)
 * - tabs: Array of tab configurations
 *   - id: Tab identifier
 *   - label: Tab label
 *   - content: Tab content (function or JSX)
 * - defaultTab: Default active tab id
 * - className: Additional classes
 */

export const EntityManagementLayout = ({
  title,
  description,
  headerActions,
  tabs = [],
  defaultTab,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const activeTabConfig = tabs.find(tab => tab.id === activeTab)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Page Header */}
      <PageHeader title={title} description={description}>
        {headerActions}
      </PageHeader>

      {/* Tab Navigation */}
      {tabs.length > 1 && (
        <TabNavigation
          tabs={tabs.map(tab => ({ id: tab.id, label: tab.label }))}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}

      {/* Tab Content */}
      <div>
        {activeTabConfig?.content && (
          typeof activeTabConfig.content === 'function'
            ? activeTabConfig.content()
            : activeTabConfig.content
        )}
      </div>
    </div>
  )
}
