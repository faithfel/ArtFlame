const { invoke } = window.__TAURI__.core;
const { open } = window.__TAURI__.dialog;
const appName = document.querySelector('.appName');
const appRunTime = document.querySelector('.appRunTime');
const appSelectBtn = document.querySelector('.appSelect');
let TARGET_SOFTWARE = "";


appSelectBtn.addEventListener("click", selectExeFile)

async function selectExeFile() {
  const selectedPath = await open({
    multiple: false,
    directory: false,
    title: 'Select an Executable',
    filters: [
      {
        name: 'Executable Files',
        extensions: ['exe']
      }
    ]
  });

  if (selectedPath) {
    console.log('Selected .exe path:', selectedPath);
    TARGET_SOFTWARE = selectedPath;
    checkTargetSoftware();
  } else {
    console.log('User canceled the dialog');
  }
}

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





