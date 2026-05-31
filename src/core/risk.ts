export function calculateRiskManagement(
  currentPrice: number,
  atr: number,
  signal: string
) {

  let stopLoss = 0;

  let target = 0;

  let riskReward = 0;

  if (signal === "BUY") {

    stopLoss =
      currentPrice - atr * 1.5;

    target =
      currentPrice + atr * 3;
  }

  else if (signal === "SELL") {

    stopLoss =
      currentPrice + atr * 1.5;

    target =
      currentPrice - atr * 3;
  }

  if (stopLoss !== 0) {

    const risk =
      Math.abs(
        currentPrice - stopLoss
      );

    const reward =
      Math.abs(
        target - currentPrice
      );

    riskReward =
      reward / risk;
  }

  return {

    stopLoss:
      Number(
        stopLoss.toFixed(2)
      ),

    target:
      Number(
        target.toFixed(2)
      ),

    riskReward:
      Number(
        riskReward.toFixed(2)
      ),
  };
}