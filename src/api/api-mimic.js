const LOREM_IPSUM_TEXT =`[INFO] Application started successfully. All services are up and running. Database connection established. Initializing modules.
[INFO] User "admin" logged in. Access granted. Session ID: abcd1234. Last login: 2024-03-30 08:00:15.
[INFO] Task 'GenerateReport' completed successfully. Report ID: 12345. Execution time: 25 seconds.
[WARNING] High memory usage detected. Consider optimizing resource usage to prevent performance degradation.
[INFO] Configuration file updated. Changes applied successfully. Restarting affected services.
[INFO] User "user123" created a new document. Document ID: DOC-2024-03-30-001. Timestamp: 2024-03-30 09:30:45.
[WARNING] Disk space running low on drive C:\. Free space: 10%. Cleanup operation recommended.
[ERROR] Database connection failed. Please check database credentials. Retrying in 10 seconds...
[INFO] System update installed successfully. Version: 2.1.0. Restarting system for changes to take effect.
[WARNING] Network connectivity issues detected. Check network settings and try reconnecting.
[ERROR] Exception encountered in module 'PaymentProcessing'. Error: NullReferenceException. Stack trace: [...]
[INFO] User "testuser" updated their profile information. Last updated: 2024-03-30 10:15:22.
[ERROR] Task 'BackupData' failed. Unable to locate backup destination. Verify backup settings and try again.
[INFO] Email notification sent to user "john@example.com". Subject: "Important Update". Timestamp: 2024-03-30 11:00:10.
[WARNING] CPU temperature exceeds safe limit. Check cooling system and ensure proper ventilation.
[INFO] Application shutdown initiated. Saving data and closing connections. Cleaning up resources.
[INFO] Application shutdown complete. All processes terminated gracefully. Goodbye!
`;
const getRandomLog = () => {
  const randomIndex = Math.floor(Math.random() * LOREM_IPSUM_TEXT.length - 50);
  const logLength = 50 + Math.floor(Math.random() * 700);
  return LOREM_IPSUM_TEXT.slice(randomIndex, randomIndex + logLength);
};

export class MimicLogs {
  /**
   *
   * @param {number} startTs
   * @param {number} endTs
   * @param {number} limit
   * @returns {Promise<{timestamp: number; message: string}[]>}
   */
  static fetchPreviousLogs({ startTs, endTs, limit }) {
    return new Promise((resolve) => {
      const delay = 250 + Math.random() * 2750;
      const randomPastTs = Math.max(
        endTs - (600000 + Math.random() * 1000 * 60 * 60 * 6),
        startTs
      );

      const gap = Math.floor((endTs - randomPastTs) / limit);
      const logs = Array.from({ length: limit }).map((_, i) => ({
        timestamp: endTs - (i ? i * gap : 1),
        message: getRandomLog(),
      }));
      setTimeout(() => resolve(logs), delay);
    });
  }

  static subscribeToLiveLogs(callback) {
    let timeout;
    const generateNextLog = () => {
      const nextLog = { timestamp: Date.now(), message: getRandomLog() };
      callback(nextLog);
      timeout = setTimeout(generateNextLog, 10 + Math.random() * 1990);
    };
    timeout = setTimeout(generateNextLog, 10 + Math.random() * 1990);

    return () => clearInterval(timeout);
  }
}

const timeWindowsList = [
  60 * 5,
  60 * 15,
  60 * 30,
  60 * 60,
  60 * 60 * 3,
  60 * 60 * 6,
  60 * 60 * 12,
  60 * 60 * 24,
  60 * 60 * 24 * 2,
  60 * 60 * 24 * 7,
  60 * 60 * 24 * 30,
];
const timeWindowToStepSizeMap = {
  [60 * 5]: 1,
  [60 * 15]: 5,
  [60 * 30]: 15,
  [60 * 60]: 30,
  [60 * 60 * 3]: 60,
  [60 * 60 * 6]: 300,
  [60 * 60 * 12]: 600,
  [60 * 60 * 24]: 900,
  [60 * 60 * 24 * 2]: 1800,
  [60 * 60 * 24 * 7]: 3600,
  [60 * 60 * 24 * 30]: 21600,
};
const getStepSize = (startTs, endTs) => {
  const timeDiff = endTs - startTs;
  const matched =
    timeWindowsList.find((v) => v * 1000 > timeDiff) ||
    timeWindowsList[timeWindowsList.length - 1];
  const stepSize = timeWindowToStepSizeMap[matched];

  return stepSize;
};
const normaliseTime = (timestamp, step) => {
  const utcOffsetSeconds = new Date().getTimezoneOffset() * 60;
  return timestamp - ((timestamp - utcOffsetSeconds * 1000) % (step * 1000));
};

const populateDataValues = (startTs, endTs, stepSize, min = 0, max = 100) => {
  const dataValues = [];
  for (let i = startTs; i <= endTs; i += stepSize * 1000) {
    dataValues.push({
      timestamp: i,
      value: min + Math.floor(Math.random() * (max - min) * 100) / 100,
    });
  }
  return dataValues;
};

export class MimicMetrics {
  static fetchMetrics({ startTs, endTs }) {
    const stepSize = getStepSize(startTs, endTs);
    const normalisedStartTs = normaliseTime(startTs, stepSize);
    const normalisedEndTs = normaliseTime(endTs, stepSize);

    const getGraph = (name, linesConfig) => ({
      name,
      graphLines: linesConfig.map(([name, min, max]) => ({
        name,
        values: populateDataValues(
          normalisedStartTs,
          normalisedEndTs,
          stepSize,
          min,
          max
        ),
      })),
    });
    const getProportionateMinMax = (min, max, newPeak) => [
      (min * newPeak) / 100,
      (max * newPeak) / 100,
    ];
    return new Promise((resolve) => {
      const delay = 250 + Math.random() * 2750;
      setTimeout(
        () =>
          resolve([
            getGraph("CPU Usage", [
              ["Limits", 80, 100],
              ["Requested", 40, 85],
              ["Used", 10, 60],
            ]),
            getGraph("Memory Usage", [
              ["Limits", ...getProportionateMinMax(80, 100, 32768)],
              ["Requested", ...getProportionateMinMax(40, 85, 32768)],
              ["Used", ...getProportionateMinMax(10, 60, 32768)],
            ]),
            getGraph("Network Usage", [
              ["Limits", ...getProportionateMinMax(80, 100, 512)],
              ["Requested", ...getProportionateMinMax(40, 85, 512)],
              ["Used", ...getProportionateMinMax(10, 60, 512)],
            ]),
            getGraph("Disk IOPS", [
              ["Read", ...getProportionateMinMax(80, 100, 25)],
              ["Write", ...getProportionateMinMax(10, 60, 25)],
            ]),
          ]),
        delay
      );
    });
  }
}
