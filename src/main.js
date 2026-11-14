const { invoke } = window.__TAURI__.core;
const appName = document.querySelector('.appName');
const appRunTime = document.querySelector('.appRunTime');
const TARGET_SOFTWARE = "sai2.exe";


/** @typedef {{ pid: number, name: string, run_time_seconds: number, start_time_epoch: number }} ProcessRuntime */

async function checkTargetSoftware() {
  const instances = await invoke('get_software_runtime', {
    processName: TARGET_SOFTWARE,
  });
  appName.textContent = TARGET_SOFTWARE;

  if (instances.length === 0) {
    console.log(`${TARGET_SOFTWARE} is not currently running.`);
    return;
  }

  const longestRunning = instances.reduce((prev, curr) =>
    curr.run_time_seconds > prev.run_time_seconds ? curr : prev
  );

    console.log(`${TARGET_SOFTWARE} has been running for ${longestRunning.run_time_seconds} seconds.`);
    appRunTime.textContent = longestRunning.run_time_seconds;
  }

  

checkTargetSoftware();
