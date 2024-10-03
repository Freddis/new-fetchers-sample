import { z } from "zod"

// export interface ForexTrade {
//     id: number,
//     symbol: string,
//     updatedAt: Date
// }
export const forexTradeValidator = z.object({
    id: z.number(),
    symbol: z.string(),
    updatedAt: z.date(),
})

export type ForexTradeValidator = typeof forexTradeValidator
export type ForexTrade = z.infer<typeof forexTradeValidator>