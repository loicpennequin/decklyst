import type { FC } from 'react'
import { PacmanLoader } from 'react-spinners'
import colors from 'tailwindcss/colors'

export const PageLoader: FC = () => (
  <div className="flex h-full w-full items-center justify-center grid-in-main">
    <div className="">
      <PacmanLoader size={32} color={colors.teal['400']} />
    </div>
  </div>
)