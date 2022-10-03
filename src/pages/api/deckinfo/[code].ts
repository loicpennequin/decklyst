// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { isShareOrDeckcode } from '@/common/utils'
import { createApiClient } from '@/server'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = (req.query.code as string | undefined)?.trim()

  if (!isShareOrDeckcode(code)) {
    return res.status(400).send('invalid deckcode or share code')
  }

  const client = await createApiClient()
  const deckinfo = await client.deckinfo.get({ code })

  if (deckinfo === null) {
    return res.status(404).send('deckinfo not found')
  }

  res.send(deckinfo)
}
