import type { ModelCallTop5Response, ModelData } from '@/mock/model'
import { getMenuData } from '@/mock/dataSource'

/** GET /api/models/call-top5 */
export async function getModelCallTop5(): Promise<ModelCallTop5Response> {
  const data = await getMenuData<ModelData>('model')
  return data.modelCallTop5
}
