import {
  BugReportIcon,
  CompareIcon,
  DeckbuilderIcon,
  DeckLibraryIcon,
  ExpandSidebarIcon,
  FeedbackIcon,
} from '@/components/Icons'
import { useAppShell } from '@/context/useAppShell'
import cx from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { FC, ReactNode } from 'react'
import type { IconType } from 'react-icons'

const AppNavLink: FC<{
  href?: string
  onClick?: () => void
  icon: IconType
  iconClassName?: string
  children: ReactNode
  active?: boolean
  className?: string
}> = ({ icon: Icon, iconClassName, active, className, href, onClick, children }) => {
  const [{ isNavExpanded }] = useAppShell()

  const router = useRouter()
  const Component = href ? Link : 'div'

  const isActive = active ?? (href ? router.pathname.startsWith(href) : false)

  return (
    <Component
      href={href as any}
      target={href && /^http/.test(href) ? '_blank' : undefined}
      onClick={onClick}
      className={cx(
        className,
        'flex items-center gap-x-3 overflow-hidden whitespace-nowrap',
        'border-l-2 py-4 px-4 font-semibold hover:cursor-pointer hover:bg-gray-800',
        'text-gray-400',
        isActive
          ? 'border-accent-400 bg-gray-850 text-accent-600 hover:border-accent-400 hover:text-accent-600'
          : 'border-transparent hover:border-gray-400 hover:text-gray-400',
      )}
    >
      <Icon
        className={cx(iconClassName, 'shrink-0 text-2xl transition-transform', {
          'text-accent-400': isActive,
        })}
      />
      {isNavExpanded && <span className="animate-in fade-in">{children}</span>}
    </Component>
  )
}

export const AppNav: FC = () => {
  const router = useRouter()
  const [{ isNavExpanded: isExpanded }, { toggleNav }] = useAppShell()

  return (
    <>
      <div
        className={cx(
          'z-30 flex flex-col gap-y-0.5 border-r border-gray-700 pt-6 shadow-nav grid-in-nav-t',
        )}
      >
        <AppNavLink
          href="/decks"
          icon={DeckLibraryIcon}
          active={router.pathname === '/decks' || router.pathname === `/[code]`}
        >
          Deck Libray
        </AppNavLink>
        <AppNavLink href="/build" icon={DeckbuilderIcon}>
          Deck Builder
        </AppNavLink>
        <AppNavLink href="/compare" icon={CompareIcon}>
          Deck Diff
        </AppNavLink>
      </div>
      <div className={cx('z-30 flex flex-col border-r border-gray-700 shadow-nav grid-in-nav-b')}>
        <div className="border-t border-gray-800">
          <AppNavLink
            href="discord://discord.com/channels/1041363184872857602/1041363185707528208"
            icon={FeedbackIcon}
          >
            Feedback
          </AppNavLink>
        </div>
        <div className="border-t border-gray-800">
          <AppNavLink
            href="discord://discord.com/channels/1041363184872857602/1041363436711465050"
            icon={BugReportIcon}
            iconClassName="py-0.5"
          >
            Report a bug
          </AppNavLink>
        </div>
        <div className="border-t border-gray-800">
          <AppNavLink
            onClick={toggleNav}
            icon={ExpandSidebarIcon}
            iconClassName={isExpanded ? '-rotate-180' : 'rotate-0'}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </AppNavLink>
        </div>
      </div>
    </>
  )
}