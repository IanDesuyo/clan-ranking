import isLastDayOfMonth from "date-fns/isLastDayOfMonth";

export function convertDate(date) {
  date.setSeconds(0, 0);

  if (date.getDate() < 25) {
    date.setDate(0);
    date.setHours(23);
    date.setMinutes(50);
  } else {
    if (date.getMinutes() >= 50 && isLastDayOfMonth(date)) {
      date.setMinutes(50);
    } else if (date.getMinutes() >= 40) {
      date.setMinutes(40);
    } else if (date.getMinutes() >= 20) {
      date.setMinutes(20);
    } else {
      date.setMinutes(0);
    }
  }

  return date;
}

/**
 * 從分數推算目前狀態
 * @param {Number} score 分數
 */
export function caclulateState(score) {
  let currStage = 1;
  let currWeek = 1;
  let currBoss = 1;

  let stageData = [
    {
      stage: 1,
      weight: [1.2, 1.2, 1.3, 1.4, 1.5],
      hp: [6000000, 8000000, 10000000, 12000000, 15000000],
      max: 3,
    },
    {
      stage: 2,
      weight: [1.6, 1.6, 1.8, 1.9, 2],
      hp: [6000000, 8000000, 10000000, 12000000, 15000000],
      max: 10,
    },
    {
      stage: 3,
      weight: [2, 2, 2.4, 2.4, 2.6],
      hp: [7000000, 9000000, 13000000, 15000000, 20000000],
      max: 34,
    },
    {
      stage: 4,
      weight: [3.5, 3.5, 3.7, 3.8, 4],
      hp: [17000000, 18000000, 20000000, 21000000, 23000000],
      max: 44,
    },
    {
      stage: 5,
      weight: [3.5, 3.5, 3.7, 3.8, 4],
      hp: [85000000, 90000000, 95000000, 100000000, 110000000],
      max: 999,
    },
  ];

  while (score > 0) {
    let currData = stageData[currStage - 1];
    score -= currData.weight[currBoss - 1] * currData.hp[currBoss - 1];
    currBoss++;

    if (currBoss > 5) {
      currBoss = 1;
      currWeek++;
    }

    if (currWeek > currData.max) {
      currStage++;
    }
  }

  if (score < 0) {
    currBoss--;
  }

  if (currBoss === 0) {
    currBoss = 5;
    currWeek--;
  }

  let target = stageData.find(data => data.max > currWeek);
  currStage = target.stage;

  return {
    stage: currStage,
    week: currWeek,
    boss: currBoss,
  };
}

export function scoreToText(score) {
  let formated = score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  let details = caclulateState(score);

  return `${formated} (${details.week}周${details.boss}王)`;
}

export function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, 0);
  const day = String(date.getDate()).padStart(2, 0);
  const hour = String(date.getHours()).padStart(2, 0);
  const minute = String(date.getMinutes()).padStart(2, 0);

  return `${month}/${day} ${hour}:${minute}`;
}

export function handleError(error) {
  console.error(error);
  console.error("[Response]", error.response);

  if (error.response && error.response.data) {
    const detail = error.response.data.detail;
    return {
      title: error.response.status || "ERROR",
      description: detail.tw || detail.en || detail.msg,
      status: detail.toast || "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    };
  }

  return {
    title: "ERROR",
    description: error.message,
    status: "error",
    duration: null,
    isClosable: true,
    position: "bottom-left",
  };
}
