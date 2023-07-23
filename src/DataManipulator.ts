import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row {
    //Calculate stock prices
    const priceABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price)/2;
    const priceDEF = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price)/2;
    //Ratio calculation
    const ratio = priceABC / priceDEF;
    //Lower and upper bound calculations
    const upperBound = 1 + 0.05;
    const lowerBound = 1 - 0.05;
    return {
        price_abc: priceABC,
        price_def: priceDEF,
        ratio,
        timestamp: serverResponds[0].timestamp > serverResponds[1].timestamp ? 
          serverResponds[0].timestamp : serverResponds[1].timestamp, // selects the most recent timestamp
        upper_bound: upperBound,
        lower_bound: lowerBound,
        //If ratio is above or below the bounds return the ratio, if not return undefined
        trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio: undefined,
    };
  }
}
