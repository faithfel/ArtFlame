const { invoke } = window.__TAURI__.core;
const { open } = window.__TAURI__.dialog;
const appName = document.querySelector('.appName');
const appRunTime = document.querySelector('.appRunTime');
const appSelectBtn = document.querySelector('.appSelect');
let TARGET_SOFTWARE = "";
let runtimeInterval = null;

export function selectApp(){


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
        TARGET_SOFTWARE = selectedPath.split(/[\\/]/).pop();
        appName.textContent = TARGET_SOFTWARE;
        appRunTime.textContent = 'Not running';
        if (runtimeInterval !== null) {
            window.clearInterval(runtimeInterval);
        }
        checkTargetSoftware(TARGET_SOFTWARE);
        runtimeInterval = window.setInterval(
            () => checkTargetSoftware(TARGET_SOFTWARE),
            1000
        );
    } else {
        console.log('User canceled the dialog');
    }
    }

    function formatDuration(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (num) => String(num).padStart(2, '0');
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    async function checkTargetSoftware(exeName) {
    const instancesByName = await invoke('get_software_runtime', {
        processNames: [exeName],
    });
    if (exeName !== TARGET_SOFTWARE) {
        return;
    }
    const instances = instancesByName[exeName];
    if (!instances) {
        throw new Error(`No runtime data returned for ${exeName}.`);
    }

    if (instances.length === 0) {
        console.log(`${exeName} is not currently running.`);
        appRunTime.textContent = 'Not running';
        return;
    }

    const longestRunning = instances.reduce((prev, curr) =>
        curr.run_time_seconds > prev.run_time_seconds ? curr : prev
    );
    appRunTime.textContent = formatDuration(longestRunning.run_time_seconds);
    }
}




