import { getImageDataUri } from '@/common/getImageDataUri'
import { deckImageUrl } from '@/common/urls'
import { useDeck } from '@/context/useDeck'
import { deckcodeWithoutTitle$, faction$, title$ } from '@/data/deck'
import { trpc } from '@/utils/trpc'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'

export const useDeckActions = () => {
  const deck = useDeck()

  return useMemo(() => {
    const deckcode = deck?.deckcode ?? ''

    const copyDeckcode = async () => {
      if (deckcode) {
        await navigator.clipboard.writeText(deckcode)
      }
    }
    const copyDeckImageUrl = async () => {
      if (deckcode) {
        await navigator.clipboard.writeText(deckImageUrl(deckcode))
      }
    }
    return { copyDeckcode, copyDeckImageUrl }
  }, [deck])
}

export const useDeckImage = () => {
  const deck = useDeck()
  const deckcode = deck.deckcode

  const imageFilename = useMemo(
    () => `${title$(deck)}_${faction$(deck)}_${deckcodeWithoutTitle$(deck)}.png`,
    [deck],
  )

  const { mutateAsync: ensureDeckimage } = trpc.deckimage.ensure.useMutation()
  const { data: imageDataUriFromQuery, refetch: refetchDeckimage } = useQuery(
    ['deck-image', deckcode],
    async () => {
      const image = await ensureDeckimage({ code: deckcode })

      return getImageDataUri(image)
    },
    {
      staleTime: Infinity,
      retry: true,
      retryDelay: (retryCount) => 1000 * Math.pow(2, Math.max(0, retryCount - 5)),
    },
  )
  const [imageDataUri, setImageDataUri] = useState<string | null>(imageDataUriFromQuery ?? null)

  const regenerateImage = useCallback(async () => {
    setImageDataUri(null)
    try {
      const image = await ensureDeckimage({ code: deckcode, forceRerender: true })
      setImageDataUri(getImageDataUri(image))
    } catch (e) {
      await refetchDeckimage()
    }
  }, [deckcode, ensureDeckimage, refetchDeckimage])

  useEffect(() => {
    if (imageDataUriFromQuery && imageDataUri !== imageDataUriFromQuery) {
      setImageDataUri(imageDataUriFromQuery)
    }
  }, [imageDataUri, imageDataUriFromQuery])

  return { imageDataUri, imageFilename, regenerateImage }
}