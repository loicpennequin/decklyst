import { CardsInDeck } from '@/components/Deckbuilder/CardsInDeck'
import { DeckManaCurve } from '@/components/DeckInfograph/DeckManaCurve'
import { OneTimeButton } from '@/components/OneTimeButton'
import { useDeck } from '@/context/useDeck'
import { useDeckcode } from '@/context/useDeckcode'
import cx from 'classnames'
import { debounce, noop } from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import { useCallback, useState } from 'react'
import { CompareIcon, CopyIcon, DoneIcon, ShareIcon, TrashIcon } from '../Icons'

export const DeckbuilderAside: FC = () => {
  const router = useRouter()
  const deck = useDeck()
  const [{ title, cards, $encoded: encodedDeckcode }, { baseDeckcode, updateTitle, clear }] =
    useDeckcode()
  const [titleValue, setTitleValue] = useState(title)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateTitleDebounced = useCallback(debounce(updateTitle, 500), [updateTitle])

  const canCompare = Boolean(
    baseDeckcode && Object.keys(cards).length && encodedDeckcode !== baseDeckcode,
  )

  const handleCopy = async () => {
    await navigator.clipboard.writeText(encodedDeckcode!)
  }

  return deck.general ? (
    <div className="flex w-72 shrink-0 flex-col gap-y-2 border-l border-gray-700 bg-alt-900 p-2 pt-4 grid-in-aside">
      <div className="flex gap-2">
        <input
          className="w-full bg-alt-800 px-2 py-2"
          placeholder="Untitled"
          autoFocus
          value={titleValue}
          onChange={(ev) => {
            setTitleValue(ev.target.value)
            updateTitleDebounced(ev.target.value)
          }}
        />

        <button
          className="flex bg-red-900 px-3 py-2 text-xl hover:bg-red-700"
          onClick={clear}
          aria-label="Delete"
        >
          <TrashIcon />
        </button>
      </div>
      <div className="mx-auto mb-2 ">
        <DeckManaCurve />
      </div>
      <div className="-mr-1.5 flex flex-1 overflow-y-hidden py-2">
        <div className="flex-1 overflow-y-scroll px-2">
          <CardsInDeck cardType="Minion" />
          <CardsInDeck cardType="Spell" />
          <CardsInDeck cardType="Artifact" />
        </div>
      </div>
      <div className="-mx-2 -mb-2 grid grid-cols-2 gap-2 border-t border-alt-600 bg-alt-1000 px-2 py-2">
        <div className={cx(`flex flex-1 justify-center font-mono text-xl font-bold`)}>
          <span className={` text-${deck.faction}`}>{deck.counts.total}</span>/
          <span
            className={cx({
              'text-red-400': deck.counts.total > 40,
              [`text-${deck.faction}`]: deck.counts.total === 40,
            })}
          >
            40
          </span>
        </div>
        <OneTimeButton onClick={handleCopy} timeout={2500} className="flex-1">
          {(copied) => (
            <>
              {copied ? <DoneIcon /> : <CopyIcon />}
              {copied ? 'Copied' : 'Copy'}
            </>
          )}
        </OneTimeButton>
        <button
          className={cx('btn flex-1 px-3 py-1', !canCompare && 'btn--disabled')}
          disabled={!canCompare}
          onClick={async () => {
            await router.push({
              pathname: '/compare',
              query: { left: baseDeckcode, right: encodedDeckcode },
            })
          }}
        >
          <CompareIcon />
          Compare
        </button>
        <Link
          href={{ pathname: '/[code]', query: { code: encodedDeckcode } }}
          prefetch={false}
          className={cx('btn flex-1 px-3 py-1', deck.counts.total > 40 && 'btn--disabled')}
        >
          <ShareIcon /> Share
        </Link>
      </div>
      <div className="-mx-2 -mb-2 border-t border-alt-600 bg-alt-1000 px-1">
        <input
          className="page-header-input w-full bg-alt-1000 px-4 text-alt-200"
          readOnly
          value={deck.deckcode}
          onChange={noop}
          onFocus={(ev) => setTimeout(() => ev.target.select(), 50)}
          aria-label="Deckcode"
        />
      </div>
    </div>
  ) : null
}