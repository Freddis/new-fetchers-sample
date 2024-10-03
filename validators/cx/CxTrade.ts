import { z } from "zod";

const cxTradeValidator = z.object({
    id: z.number(),
    symbol: z.string(),
    somethingCxOnly: z.string(),
    updatedAt: z.date(),
})

export type CxTrade = z.infer<typeof cxTradeValidator>