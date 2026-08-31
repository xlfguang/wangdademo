import { modelCallTop5 } from '@/mock/model'
import type { ModelCallTop5Response } from '@/mock/model'
import { delay } from '@/utils/mockApi'

/** GET /api/models/call-top5 */
export async function getModelCallTop5(): Promise<ModelCallTop5Response> {
  await delay(300)
  return modelCallTop5
}
