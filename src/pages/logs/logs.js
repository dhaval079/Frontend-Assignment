import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/header';
import './logs.css';
import { MimicLogs } from '../../api/api-mimic.js'; 

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(60); // Default to 5 minutes
  const [liveLogsEnabled, setLiveLogsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const logContainerRef = useRef(null);
  const [time, setTime] = useState(5);
  const [selectedTime, setSelectedTime] = useState("Last 5 minutes");

  // Fetch logs for the specified time range
  const fetchLogs = async (startTs, endTs, limit) => {
    try {
      setLoading(true);
      const fetchedLogs = await MimicLogs.fetchPreviousLogs({ startTs, endTs, limit });
      setLogs(prevLogs => [...prevLogs, ...fetchedLogs]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLoading(false);
    }
  };

  // Subscribe to live logs if enabled
  useEffect(() => {
    let unsubscribeLiveLogs;
    if (liveLogsEnabled) {
      unsubscribeLiveLogs = MimicLogs.subscribeToLiveLogs(newLog => {
        setLogs(prevLogs => [...prevLogs, newLog]);
      });
    }
    return () => {
      if (unsubscribeLiveLogs) unsubscribeLiveLogs();
    };
  }, [liveLogsEnabled, setLogs]);

  // Fetch logs when component mounts or time range changes
  useEffect(() => {
    const endTime = Date.now();
    const startTime = endTime - (selectedTimeRange * time * 1000);
    setLogs([]);
    fetchLogs(startTime, endTime, 20);
  }, [selectedTimeRange, time]);

  useEffect(() => {
    if (logContainerRef.current && (liveLogsEnabled || logs.length > 0)) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, liveLogsEnabled]);

  return (
    <div className='logsMain'>

      <Header time={time} setTime={setTime} selectedTime={selectedTime} setSelectedTime={setSelectedTime}/>
      <p className='text-end flex-none h-[24px] text-[2vh]'>Showing logs for 09/08/2023 10:10 &rarr; 09/08/2023 10:20</p>

      <div className='logs w-full md:w-4/5 lg:w-4/5' ref={logContainerRef}>
        {loading && <p className='text-slate-500 text-center'>Loading...</p>}
        {logs.map((log, index) => (
          <ul key={index} className='flex gap-5'>
            <li className='timestamp'>{new Date(log.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })}&nbsp;  [info] </li>
            <li className='message'>{log.message}</li>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default Logs;
