import moment from "moment-timezone";

const sdk = require('api')('@baremetrics-api/v1.0#h5yun3cl7e585mk');
sdk.auth(process.env.BAREMETRICS_API_KEY);

type Metric = { plan: { interval: 'month' | 'year' }, value: number }

export const metrics = async () => {
  const date = moment().tz('America/New_York').format("YYYY-MM-DD");
  const planBreakoutPromise = sdk.showPlanBreakout({
    start_date: date,
    end_date: date,
    metric: 'active_subscriptions'
  }).then(({ metrics }: { metrics: Metric[]}) => {
    const month = metrics.filter(metric => metric.plan.interval === 'month').reduce((total, metric) => total + metric.value, 0)
    const year = metrics.filter(metric => metric.plan.interval === 'year').reduce((total, metric) => total + metric.value, 0)
    return { subscriptions: { month, year } } as { subscriptions: { month: number; year: number }}
  });

  const mrrPromise = sdk.showMetric({
    start_date: date, 
    end_date: date, 
    metric: 'mrr'
  })
  .then(({ metrics }: { metrics: Metric[] }) => { return { mrr: metrics[0]?.value / 100.0 } as { mrr: number }})

  const arrPromise = sdk.showMetric({
    start_date: date, 
    end_date: date, 
    metric: 'arr'
  })
  .then(({ metrics }: { metrics: Metric[] }) => { return { arr: metrics[0]?.value / 100.0 } as { arr: number }})

  const netRevenuePromise = sdk.showMetric({
    start_date: '2020-01-01', 
    end_date: date, 
    metric: 'net_revenue'
  })
  .then(({ metrics }: { metrics: Metric[] }) => { return { net_revenue: metrics.reduce((total, metric) => total + metric.value / 100.0 , 0) } as { net_revenue: number }})

  const trialsPromise = sdk.showMetric({
    start_date: date, 
    end_date: date, 
    metric: 'active_trials'
  }).then(({ metrics }: { metrics: Metric[] }) => ({ trials: metrics[0]?.value }))

  const { subscriptions, mrr, arr, net_revenue, trials } = await Promise.all([ planBreakoutPromise, mrrPromise, arrPromise, netRevenuePromise, trialsPromise ]).then(responses => responses.reduce((total, response ) => ({ ...total, ...response }), {}) )
  return { subscriptions, mrr, arr, net_revenue, trials } as { subscriptions: { month: number; year: number }, mrr: number, arr: number , net_revenue: number, trials: number }
}