import cx from 'classnames'
import type { FC, ReactNode } from 'react'

export const PageHeader: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div
      className={cx(
        'flex items-end justify-between gap-x-8',
        'h-20 px-8 pb-4 pt-6',
        'z-50 bg-gradient-to-r from-gray-850 to-alt-900 shadow-header',
      )}
    >
      {children}
    </div>
  )
}
