import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const syncRouter = router({
  getSyncs: protectedProcedure
    .input(
      z.object({
        skip: z.number(),
        take: z.number()
      })
    )
    .query(async ({ ctx: { user, db }, input: { skip, take }}) => {
      return Promise.all([
        db.sync.aggregate({ where: { userId: user.id }, _count: true }),
        db.sync.findMany({ skip, take, where: { userId: user.id }, 
          include: { 
            results: {
              include: {
                plaidItem: {
                  include: {
                    institution: true
                  }
                },
                destination: true
              }
            }, 
            triggerDestination: { include: { tableConfigs: { select: { isEnabled: true, table: true }}}}, triggerPlaidItem: { include: { institution: true }} }, orderBy: { createdAt: 'desc' }})
      ])
      .then(([ { _count: totalSyncs}, syncs ]) => {
        return { totalSyncs, syncs  }
      })
    })
})