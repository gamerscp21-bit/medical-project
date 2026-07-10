/**
 * HealthSync - Device Pairing Wizard Script
 * Supports real Web Bluetooth API scanning for ESP32/BLE boards
 * and simulation mode for demo purposes.
 */

// State Management
let isSimulationMode = true;
let bluetoothDevice = null;
let gattServer = null;
let currentStep = 1;
let progressInterval = null;

/**
 * Initializes simulation mode checkbox state and default device list.
 */
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('sim-mode-toggle');
    if (toggle) {
        toggle.checked = isSimulationMode;
    }
    renderDeviceList();

    // Auto-open wizard if ?wizard=1 in URL
    if (new URLSearchParams(window.location.search).get('wizard') === '1') {
        openWizard();
    }
});

/**
 * Toggles simulation mode state.
 */
function toggleSimMode() {
    const toggle = document.getElementById('sim-mode-toggle');
    isSimulationMode = toggle ? toggle.checked : true;
    
    // Reset any ongoing Bluetooth search or connection
    if (!isSimulationMode) {
        disconnectRealDevice();
    }
    
    renderDeviceList();
}

/**
 * Disconnects any active Bluetooth device connections.
 */
function disconnectRealDevice() {
    if (gattServer) {
        try {
            gattServer.disconnect();
            console.log('Real Bluetooth GATT disconnected.');
        } catch (e) {
            console.error('Error disconnecting GATT:', e);
        }
        gattServer = null;
    }
    bluetoothDevice = null;
}

/**
 * Renders the device list in Step 1 depending on Simulation / Real mode.
 */
function renderDeviceList(customDevices = null) {
    const container = document.getElementById('device-list');
    if (!container) return;

    container.innerHTML = '';

    if (isSimulationMode) {
        // In simulation mode, show the predefined HealthPatch Pro device
        container.innerHTML = `
            <button onclick="selectSimulatedDevice()" class="w-full p-4 bg-white border border-outline-variant rounded-xl flex items-center justify-between hover:border-primary hover:bg-surface-container transition-all active:scale-[0.99] shadow-sm">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <span class="material-symbols-outlined">wifi</span>
                    </div>
                    <div class="text-left font-body-md">
                        <p class="font-bold text-on-surface text-sm">HealthPatch Pro #442</p>
                        <p class="text-xs text-on-surface-variant font-medium">Ready to pair</p>
                    </div>
                </div>
                <span class="material-symbols-outlined text-primary">chevron_right</span>
            </button>
        `;
    } else {
        // Real Scan Mode
        if (customDevices && customDevices.length > 0) {
            customDevices.forEach(device => {
                container.innerHTML += `
                    <button onclick="selectRealDevice()" class="w-full p-4 bg-white border border-outline-variant rounded-xl flex items-center justify-between hover:border-primary hover:bg-surface-container transition-all active:scale-[0.99] shadow-sm">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                <span class="material-symbols-outlined">bluetooth</span>
                            </div>
                            <div class="text-left font-body-md">
                                <p class="font-bold text-on-surface text-sm">${device.name || 'Unnamed BLE Device'}</p>
                                <p class="text-xs text-green-600 font-semibold animate-pulse">Device found - Click to pair</p>
                            </div>
                        </div>
                        <span class="material-symbols-outlined text-primary">chevron_right</span>
                    </button>
                `;
            });
        } else {
            // Empty state for real mode
            container.innerHTML = `
                <div class="w-full p-6 bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl text-center">
                    <span class="material-symbols-outlined text-outline text-3xl mb-2">bluetooth_disabled</span>
                    <p class="text-xs text-on-surface-variant font-semibold">No devices found.</p>
                    <p class="text-[10px] text-outline mt-1">Tap the Bluetooth icon above to start scanning for ESP / Bluetooth boards.</p>
                </div>
            `;
        }
    }
}

/**
 * Handles Bluetooth Icon clicking (initiates scan)
 */
function handleBluetoothIconClick() {
    const icon = document.getElementById('bluetooth-scan-icon');
    if (icon) {
        icon.classList.add('animate-spin');
        setTimeout(() => icon.classList.remove('animate-spin'), 1500);
    }

    if (isSimulationMode) {
        // Simulated Search: brief status update
        const title = document.getElementById('search-status-title');
        const text = document.getElementById('search-status-text');
        
        if (title) title.innerText = 'Searching...';
        if (text) text.innerText = 'Looking for nearby HealthPatch devices.';
        
        setTimeout(() => {
            if (title) title.innerText = 'Searching for Devices';
            if (text) text.innerText = 'Please ensure your HealthPatch is turned on and nearby.';
            renderDeviceList();
        }, 1500);
    } else {
        // Trigger real scan
        startRealBluetoothScan();
    }
}

/**
 * Scans for BLE Devices using the browser's Web Bluetooth API
 */
async function startRealBluetoothScan() {
    if (!navigator.bluetooth) {
        alert('Web Bluetooth API is not supported in this browser or requires a secure HTTPS connection. Please use Simulation Mode instead.');
        // Auto check Simulation checkbox
        const toggle = document.getElementById('sim-mode-toggle');
        if (toggle) {
            toggle.checked = true;
            toggleSimMode();
        }
        return;
    }

    const title = document.getElementById('search-status-title');
    const text = document.getElementById('search-status-text');

    if (title) title.innerText = 'Opening Bluetooth Chooser...';
    if (text) text.innerText = 'Please choose your ESP or Bluetooth device from the browser popup.';

    try {
        // Prompt browser's native Bluetooth selection dialog
        // Filter specifically for ESP32/ESP devices, Bio-Link, HealthPatch, or allow all devices
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['battery_service', 'device_information']
        });

        console.log('Bluetooth device chosen:', device);
        bluetoothDevice = device;

        if (title) title.innerText = 'Device Selected';
        if (text) text.innerText = `Found: ${device.name || 'Unnamed BLE Device'}. Ready to connect.`;

        // Render this specific chosen device in the list
        renderDeviceList([device]);

    } catch (error) {
        console.error('Bluetooth Scan Cancelled or Failed:', error);
        if (title) title.innerText = 'Scanning Cancelled';
        if (text) text.innerText = 'Tap the Bluetooth icon to try again or switch to Simulation Mode.';
        renderDeviceList();
    }
}

/**
 * Logic to connect to simulated device
 */
function selectSimulatedDevice() {
    const devName = 'HealthPatch Pro #442';
    document.getElementById('connecting-device-name').innerText = devName;
    document.getElementById('paired-device-name').innerText = devName;
    document.getElementById('battery-value').innerText = '98%';
    document.getElementById('sync-value').innerText = 'Live';
    goToStep(2);
}

/**
 * Logic to connect to real device
 */
async function selectRealDevice() {
    if (!bluetoothDevice) return;

    const devName = bluetoothDevice.name || 'ESP32 Device';
    document.getElementById('connecting-device-name').innerText = devName;
    document.getElementById('paired-device-name').innerText = devName;
    
    // Update battery/status fields to indicate reading/connecting
    document.getElementById('battery-value').innerText = 'Reading...';
    document.getElementById('sync-value').innerText = 'Connecting...';
    
    goToStep(2);
}

/**
 * Cancels connection and reverts to step 1
 */
function cancelPairing() {
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
    
    disconnectRealDevice();
    goToStep(1);
}

/**
 * Steps navigation control
 */
function goToStep(targetStep) {
    currentStep = targetStep;

    const totalSteps = 4;
    const stepsIndicator = document.getElementById('steps-indicator-container');
    const wizardTitle = document.getElementById('wizard-title');

    // Title and Steps Indicator management
    if (targetStep === 4) {
        if (stepsIndicator) stepsIndicator.classList.add('hidden');
        if (wizardTitle) wizardTitle.innerText = 'Device Pairing';
    } else {
        if (stepsIndicator) stepsIndicator.classList.remove('hidden');
        if (wizardTitle) wizardTitle.innerText = 'Device Pairing Wizard';
    }

    // Step views hide/show with simple transitions
    for (let i = 1; i <= totalSteps; i++) {
        const view = document.getElementById(`view-${i}`);
        const indicator = document.getElementById(`ind-${i}`);

        if (!view) continue;

        if (i === targetStep) {
            view.classList.remove('hidden', 'absolute', 'hs-step-exit');
            view.classList.add('relative', 'hs-step-view');
            setTimeout(() => view.classList.remove('hs-step-view'), 500);
            
            // Activate step indicator badge color
            if (indicator) {
                indicator.classList.remove('opacity-40');
                const badge = indicator.querySelector('div');
                if (badge) {
                    badge.className = 'w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm';
                }
            }
        } else {
            if (!view.classList.contains('hidden')) {
                view.classList.add('hs-step-exit');
                setTimeout(() => {
                    view.classList.add('hidden', 'absolute');
                    view.classList.remove('relative', 'hs-step-exit');
                }, 250);
            } else {
                view.classList.add('hidden', 'absolute');
                view.classList.remove('relative');
            }
            
            // Deactivate step indicator
            if (indicator) {
                indicator.classList.add('opacity-40');
                const badge = indicator.querySelector('div');
                if (badge) {
                    badge.className = 'w-10 h-10 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-sm transition-all duration-300';
                }
            }
        }
    }

    // Handle animations/logic based on active step
    if (targetStep === 1) {
        // Reset progress bar
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) progressBar.style.width = '0%';
    } 
    else if (targetStep === 2) {
        animateProgressBarAndConnect();
    }
}

/**
 * Animate the pairing progress bar and attempt real GATT connection if in real mode
 */
function animateProgressBarAndConnect() {
    const progressBar = document.getElementById('progress-bar');
    if (!progressBar) return;

    progressBar.style.width = '0%';
    let progress = 0;
    
    if (progressInterval) {
        clearInterval(progressInterval);
    }

    // Start progress animation (takes 3 seconds total)
    progressInterval = setInterval(() => {
        progress += 4;
        if (progress > 100) progress = 100;
        
        progressBar.style.width = `${progress}%`;

        if (progress === 100) {
            clearInterval(progressInterval);
            progressInterval = null;
            
            // Move to success screen
            setTimeout(() => {
                goToStep(3);
            }, 300);
        }
    }, 120);

    // If real mode, initiate GATT connection in background
    if (!isSimulationMode && bluetoothDevice) {
        connectToGattServer();
    }
}

/**
 * Performs GATT server connection for real BLE devices in the background
 */
async function connectToGattServer() {
    try {
        console.log('Connecting to BLE GATT server...');
        const server = await bluetoothDevice.gatt.connect();
        gattServer = server;
        console.log('GATT Connected.');

        // Update stats values in Step 4
        document.getElementById('sync-value').innerText = 'Live';

        // Try reading battery level service
        try {
            const service = await server.getPrimaryService('battery_service');
            const characteristic = await service.getCharacteristic('battery_level');
            const value = await characteristic.readValue();
            const batteryPercent = value.getUint8(0);
            
            console.log(`Battery level read: ${batteryPercent}%`);
            document.getElementById('battery-value').innerText = `${batteryPercent}%`;
        } catch (batteryErr) {
            console.warn('Could not read BLE Battery level service, using 98% default.', batteryErr);
            document.getElementById('battery-value').innerText = '98%';
        }

    } catch (connError) {
        console.error('Real GATT connection failed:', connError);
        // Fallback gracefully so the demo doesn't freeze
        document.getElementById('sync-value').innerText = 'Live (Simulated)';
        document.getElementById('battery-value').innerText = '98%';
    }
}

/**
 * Opens wizard screen
 */
function openWizard() {
    const profile = document.getElementById('profile-screen');
    const wizard = document.getElementById('wizard-screen');
    profile.classList.add('hs-step-exit');
    setTimeout(() => {
        profile.classList.add('hidden');
        profile.classList.remove('hs-step-exit');
        wizard.classList.remove('hidden');
        wizard.classList.add('hs-step-view');
        setTimeout(() => wizard.classList.remove('hs-step-view'), 500);
        goToStep(1);
    }, 280);
}

/**
 * Closes wizard and returns to profile screen
 */
function closeWizard() {
    const profile = document.getElementById('profile-screen');
    const wizard = document.getElementById('wizard-screen');
    wizard.classList.add('hs-step-exit');
    setTimeout(() => {
        wizard.classList.add('hidden');
        wizard.classList.remove('hs-step-exit');
        profile.classList.remove('hidden');
        profile.classList.add('hs-step-view');
        setTimeout(() => profile.classList.remove('hs-step-view'), 500);
    }, 280);
}

/**
 * Handles back button in top app bar
 */
function handleWizardBack() {
    if (currentStep === 1) {
        closeWizard();
    } else if (currentStep === 2) {
        cancelPairing();
    } else if (currentStep === 3) {
        goToStep(2);
    } else if (currentStep === 4) {
        goToStep(1);
    }
}

/**
 * Redirects to dashboard page
 */
function goToDashboard() {
    window.location.href = 'dashboard.html';
}

// Attach listeners for placeholder hash links only
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            HealthSyncApp.toast('Feature coming soon', 'info');
        });
    });
});