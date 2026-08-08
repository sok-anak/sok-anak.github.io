(function() {
  'use strict';

  // ============================================================
  // MODAL CONTROLLER
  // ============================================================
  const modalOverlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');
  const modalTitle = document.getElementById('modalTitle');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  function openModal(title, content) {
    modalTitle.innerHTML = title;
    modalBody.innerHTML = content;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  // ============================================================
  // LIVE CLOCK & CONNECTION STATUS
  // ============================================================
  const dateTimeEl = document.querySelector('#liveDateTime span');
  const connectionStatus = document.getElementById('connectionStatus');
  const deviceCount = document.getElementById('deviceCount');

  function updateClock() {
    const now = new Date();
    const opts = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      second: '2-digit', hour12: false };
    dateTimeEl.textContent = now.toLocaleString('en-US', opts);
  }
  updateClock();
  setInterval(updateClock, 1000);

  let online = true;
  setInterval(() => {
    if (Math.random() < 0.03) {
      online = !online;
      if (online) {
        connectionStatus.textContent = 'All systems operational';
        connectionStatus.style.color = 'var(--accent-3)';
        document.querySelector('.status-dot').style.background = 'var(--accent-3)';
      } else {
        connectionStatus.textContent = '⚠️ Connection lost';
        connectionStatus.style.color = 'var(--accent-4)';
        document.querySelector('.status-dot').style.background = 'var(--accent-4)';
      }
    }
    const base = 12;
    const variation = Math.floor(Math.random() * 3) - 1;
    deviceCount.textContent = Math.max(8, base + variation);
  }, 5000);

  // ============================================================
  // CHARTS
  // ============================================================
  const tempCtx = document.getElementById('tempChart').getContext('2d');
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0') + ':00');

  function randomTemp() { return +(18 + Math.random() * 12).toFixed(1); }
  let tempData = Array.from({ length: 24 }, randomTemp);

  const tempChart = new Chart(tempCtx, {
    type: 'line',
    data: {
      labels: hours,
      datasets: [{
        label: '°C',
        data: tempData,
        borderColor: '#4f8cff',
        backgroundColor: 'rgba(79,140,255,0.08)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
        pointRadius: 2,
        pointBackgroundColor: '#4f8cff',
        pointBorderColor: '#0b0e14',
        pointBorderWidth: 1.5,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a232f',
          titleColor: '#eef2f8',
          bodyColor: '#94a9c9',
          borderColor: '#2a3748',
          borderWidth: 1,
          cornerRadius: 10,
          padding: 10,
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(42,55,72,0.3)', drawBorder: false },
          ticks: { color: '#5e7496', font: { size: 10, family: 'Inter' }, maxTicksLimit: 8 }
        },
        y: {
          grid: { color: 'rgba(42,55,72,0.3)', drawBorder: false },
          ticks: { color: '#5e7496', font: { size: 10, family: 'Inter' } },
          min: 10,
          max: 35,
        }
      },
      interaction: { intersect: false, mode: 'index' }
    }
  });

  const humidCtx = document.getElementById('humidChart').getContext('2d');
  const humidChart = new Chart(humidCtx, {
    type: 'bar',
    data: {
      labels: ['Humidity', 'AQI'],
      datasets: [{
        label: 'Current',
        data: [58, 42],
        backgroundColor: ['rgba(0,212,170,0.7)', 'rgba(108,92,231,0.7)'],
        borderColor: ['#00d4aa', '#6c5ce7'],
        borderWidth: 2,
        borderRadius: 6,
        barPercentage: 0.6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a232f',
          titleColor: '#eef2f8',
          bodyColor: '#94a9c9',
          borderColor: '#2a3748',
          borderWidth: 1,
          cornerRadius: 10,
          padding: 10,
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#5e7496', font: { size: 12, family: 'Inter' } }
        },
        y: {
          grid: { color: 'rgba(42,55,72,0.3)', drawBorder: false },
          ticks: { color: '#5e7496', font: { size: 10, family: 'Inter' } },
          beginAtZero: true,
          max: 100,
        }
      }
    }
  });

  // ============================================================
  // DATA STATE & ALERTS
  // ============================================================
  const tempStat = document.getElementById('tempStat');
  const humidStat = document.getElementById('humidStat');
  const aqiStat = document.getElementById('aqiStat');
  const powerStat = document.getElementById('powerStat');
  const alertStat = document.getElementById('alertStat');

  const tempChange = document.getElementById('tempChange');
  const humidChange = document.getElementById('humidChange');
  const aqiChange = document.getElementById('aqiChange');
  const powerChange = document.getElementById('powerChange');
  const alertChange = document.getElementById('alertChange');

  const sTempVal = document.getElementById('sensorTempValue');
  const sTempStatus = document.getElementById('sensorTempStatus');
  const sTempBar = document.getElementById('sensorTempBar');

  const sHumidVal = document.getElementById('sensorHumidValue');
  const sHumidStatus = document.getElementById('sensorHumidStatus');
  const sHumidBar = document.getElementById('sensorHumidBar');

  const sAqiVal = document.getElementById('sensorAqiValue');
  const sAqiStatus = document.getElementById('sensorAqiStatus');
  const sAqiBar = document.getElementById('sensorAqiBar');

  const sPowerVal = document.getElementById('sensorPowerValue');
  const sPowerStatus = document.getElementById('sensorPowerStatus');
  const sPowerBar = document.getElementById('sensorPowerBar');

  const alertList = document.getElementById('alertList');
  const sidebarBadge = document.getElementById('sidebarAlertBadge');
  const notifDot = document.getElementById('notifDot');

  let currentTemp = 22.4;
  let currentHumid = 58;
  let currentAqi = 42;
  let currentPower = 1.84;
  let alertCount = 3;
  let prevTemp = currentTemp,
    prevHumid = currentHumid,
    prevAqi = currentAqi,
    prevPower = currentPower;

  let alerts = [
    { title: 'Temperature spike on Node #4', time: '2 min ago', severity: 'critical' },
    { title: 'Humidity threshold exceeded', time: '18 min ago', severity: 'warning' },
    { title: 'Sensor #12 reconnected', time: '1 hour ago', severity: 'resolved' },
    { title: 'Gateway latency > 120ms', time: '2 hours ago', severity: 'warning' }
  ];

  // ============================================================
  // RENDER ALERTS
  // ============================================================
  function renderAlerts() {
    alertList.innerHTML = '';
    alerts.forEach((alert, index) => {
      const div = document.createElement('div');
      div.className = 'alert-item';
      div.dataset.index = index;

      let iconClass = 'icon';
      let iconHtml = '<i class="fas fa-exclamation"></i>';
      if (alert.severity === 'resolved') {
        iconClass += ' green';
        iconHtml = '<i class="fas fa-check-circle"></i>';
      } else if (alert.severity === 'warning') {
        iconClass += ' yellow';
        iconHtml = '<i class="fas fa-exclamation-triangle"></i>';
      } else {
        iconHtml = '<i class="fas fa-exclamation"></i>';
      }

      div.innerHTML = `
        <div class="${iconClass}">${iconHtml}</div>
        <div class="content">
          <div class="title">${alert.title}</div>
          <div class="time"><i class="far fa-clock"></i> ${alert.time}</div>
        </div>
        <span class="badge ${alert.severity}">${alert.severity}</span>
      `;
      div.addEventListener('click', function(e) {
        e.stopPropagation();
        const idx = parseInt(this.dataset.index);
        if (alerts[idx].severity !== 'resolved') {
          alerts[idx].severity = 'resolved';
          alerts[idx].title = alerts[idx].title + ' (resolved)';
          alertCount = alerts.filter(a => a.severity !== 'resolved').length;
          updateAlertUI();
          renderAlerts();
          notifDot.classList.remove('hidden');
        } else {
          alerts.splice(idx, 1);
          alertCount = alerts.filter(a => a.severity !== 'resolved').length;
          updateAlertUI();
          renderAlerts();
          if (alertCount === 0) notifDot.classList.add('hidden');
        }
      });
      alertList.appendChild(div);
    });
  }

  function updateAlertUI() {
    alertStat.textContent = alertCount;
    sidebarBadge.textContent = alertCount;
    if (alertCount === 0) {
      alertChange.innerHTML = '<i class="fas fa-check-circle"></i> All clear';
      alertChange.className = 'change down';
      notifDot.classList.add('hidden');
      sidebarBadge.style.display = 'none';
    } else {
      alertChange.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${alertCount} active`;
      alertChange.className = 'change up';
      notifDot.classList.remove('hidden');
      sidebarBadge.style.display = 'inline-block';
    }
  }

  function addRandomAlert() {
    const msgs = [
      { title: 'Device #5 offline', severity: 'critical' },
      { title: 'Battery low on Sensor #2', severity: 'warning' },
      { title: 'Firmware update available', severity: 'warning' },
      { title: 'Network reconnection successful', severity: 'resolved' },
      { title: 'Temperature critical on Rack 3', severity: 'critical' }
    ];
    const pick = msgs[Math.floor(Math.random() * msgs.length)];
    const timeOpts = ['just now', '1 min ago', '3 min ago', '5 min ago', '10 min ago'];
    alerts.unshift({
      title: pick.title,
      time: timeOpts[Math.floor(Math.random() * timeOpts.length)],
      severity: pick.severity
    });
    if (alerts.length > 8) alerts.pop();
    alertCount = alerts.filter(a => a.severity !== 'resolved').length;
    updateAlertUI();
    renderAlerts();
    notifDot.classList.remove('hidden');
  }

  renderAlerts();
  updateAlertUI();

  // ============================================================
  // UPDATE SENSOR UI
  // ============================================================
  function updateSensorUI() {
    tempStat.textContent = currentTemp.toFixed(1) + ' °C';
    humidStat.textContent = currentHumid.toFixed(0) + ' %';
    aqiStat.textContent = currentAqi;
    powerStat.textContent = currentPower.toFixed(2) + ' W';

    const tempDiff = currentTemp - prevTemp;
    const humidDiff = currentHumid - prevHumid;
    const aqiDiff = currentAqi - prevAqi;
    const powerDiff = currentPower - prevPower;

    tempChange.innerHTML = (tempDiff >= 0 ? '<i class="fas fa-arrow-up"></i>' :
      '<i class="fas fa-arrow-down"></i>') + ' ' + Math.abs(tempDiff).toFixed(1) + '°';
    tempChange.className = 'change ' + (tempDiff >= 0 ? 'up' : 'down');

    humidChange.innerHTML = (humidDiff >= 0 ? '<i class="fas fa-arrow-up"></i>' :
      '<i class="fas fa-arrow-down"></i>') + ' ' + Math.abs(humidDiff).toFixed(1) + '%';
    humidChange.className = 'change ' + (humidDiff >= 0 ? 'up' : 'down');

    aqiChange.innerHTML = (aqiDiff >= 0 ? '<i class="fas fa-arrow-up"></i>' :
      '<i class="fas fa-arrow-down"></i>') + ' ' + Math.abs(aqiDiff).toFixed(0);
    aqiChange.className = 'change ' + (aqiDiff >= 0 ? 'up' : 'down');

    powerChange.innerHTML = (powerDiff >= 0 ? '<i class="fas fa-arrow-up"></i>' :
      '<i class="fas fa-arrow-down"></i>') + ' ' + Math.abs(powerDiff).toFixed(2) + ' kW';
    powerChange.className = 'change ' + (powerDiff >= 0 ? 'up' : 'down');

    sTempVal.innerHTML = currentTemp.toFixed(1) + ' <small>°C</small>';
    const tempPct = Math.min(100, Math.max(0, ((currentTemp - 10) / 30) * 100));
    sTempBar.style.width = tempPct + '%';
    if (currentTemp > 28) { sTempStatus.textContent = 'high';
      sTempStatus.className = 'status danger'; } else if (currentTemp < 16) { sTempStatus.textContent = 'low';
      sTempStatus.className = 'status warning'; } else { sTempStatus.textContent = 'normal';
      sTempStatus.className = 'status'; }

    sHumidVal.innerHTML = currentHumid.toFixed(0) + ' <small>%</small>';
    sHumidBar.style.width = Math.min(100, currentHumid) + '%';
    if (currentHumid > 75) { sHumidStatus.textContent = 'high';
      sHumidStatus.className = 'status danger'; } else if (currentHumid < 30) { sHumidStatus.textContent = 'low';
      sHumidStatus.className = 'status warning'; } else { sHumidStatus.textContent = 'normal';
      sHumidStatus.className = 'status'; }

    sAqiVal.innerHTML = currentAqi + ' <small>AQI</small>';
    sAqiBar.style.width = Math.min(100, (currentAqi / 150) * 100) + '%';
    if (currentAqi > 80) { sAqiStatus.textContent = 'unhealthy';
      sAqiStatus.className = 'status danger'; } else if (currentAqi > 50) { sAqiStatus.textContent = 'moderate';
      sAqiStatus.className = 'status warning'; } else { sAqiStatus.textContent = 'good';
      sAqiStatus.className = 'status'; }

    sPowerVal.innerHTML = currentPower.toFixed(2) + ' <small>kW</small>';
    const pPct = Math.min(100, (currentPower / 3.5) * 100);
    sPowerBar.style.width = pPct + '%';
    if (currentPower > 2.8) { sPowerStatus.textContent = 'high';
      sPowerStatus.className = 'status danger'; } else if (currentPower < 0.5) { sPowerStatus.textContent = 'low';
      sPowerStatus.className = 'status warning'; } else { sPowerStatus.textContent = 'normal';
      sPowerStatus.className = 'status'; }

    prevTemp = currentTemp;
    prevHumid = currentHumid;
    prevAqi = currentAqi;
    prevPower = currentPower;
  }

  // ============================================================
  // SIMULASI DATA
  // ============================================================
  function simulateData() {
    currentTemp += (Math.random() - 0.48) * 0.6;
    currentTemp = Math.min(35, Math.max(12, currentTemp));

    currentHumid += (Math.random() - 0.5) * 2.5;
    currentHumid = Math.min(92, Math.max(22, currentHumid));

    currentAqi += (Math.random() - 0.45) * 2.0;
    currentAqi = Math.min(120, Math.max(15, Math.round(currentAqi)));

    currentPower += (Math.random() - 0.5) * 0.08;
    currentPower = Math.min(3.8, Math.max(0.3, currentPower));

    if (Math.random() < 0.05 && alerts.length < 10) {
      addRandomAlert();
    }

    updateSensorUI();

    tempData.push(currentTemp);
    tempData.shift();
    tempChart.data.datasets[0].data = tempData;
    tempChart.update('none');

    humidChart.data.datasets[0].data = [currentHumid, currentAqi];
    humidChart.update('none');
  }

  updateSensorUI();
  setInterval(simulateData, 2000);

  // ============================================================
  // INTERAKSI TOMBOL & ELEMEN
  // ============================================================

  // --- SIDEBAR NAV ---
  document.querySelectorAll('.sidebar nav a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelectorAll('.sidebar nav a').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      const page = this.dataset.page || 'dashboard';
      const pageNames = {
        dashboard: '🏠 Dashboard',
        devices: '📡 Devices',
        sensors: '🌡️ Sensors',
        energy: '⚡ Energy',
        alerts: '🔔 Alerts',
        settings: '⚙️ Settings'
      };
      openModal(
        `<i class="fas fa-arrow-right"></i> ${pageNames[page] || 'Page'}`,
        `<p>You are now viewing <strong>${pageNames[page] || page}</strong>.</p>
        <p style="color: var(--text-secondary); margin-top: 8px;">This is a simulated navigation. All data is live and updating in the background.</p>
        <div style="margin-top: 16px; background: var(--bg-secondary); padding: 12px; border-radius: 8px; border-left: 3px solid var(--accent-1);">
          <small style="color: var(--text-muted);">💡 Tip: Click on any stat card or sensor for detailed info.</small>
        </div>`
      );
    });
  });

  // --- STAT CARDS ---
  document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('click', function() {
      const stat = this.dataset.stat;
      let title, content;
      switch (stat) {
        case 'temperature':
          title = '🌡️ Temperature Detail';
          content =
            `<p><strong>Current:</strong> ${currentTemp.toFixed(1)} °C</p>
            <p><strong>Range:</strong> 12 – 35 °C</p>
            <p><strong>Status:</strong> ${currentTemp > 28 ? '⚠️ High' : currentTemp < 16 ? '❄️ Low' : '✅ Normal'}</p>
            <div style="margin-top:10px; background:var(--bg-secondary); padding:8px; border-radius:6px;">
              <small style="color:var(--text-muted);">Last 24h avg: ${(tempData.reduce((a,b)=>a+b,0)/tempData.length).toFixed(1)} °C</small>
            </div>`;
          break;
        case 'humidity':
          title = '💧 Humidity Detail';
          content =
            `<p><strong>Current:</strong> ${currentHumid.toFixed(0)} %</p>
            <p><strong>Range:</strong> 22 – 92 %</p>
            <p><strong>Status:</strong> ${currentHumid > 75 ? '⚠️ High' : currentHumid < 30 ? '🌵 Low' : '✅ Normal'}</p>`;
          break;
        case 'aqi':
          title = '🌬️ Air Quality Detail';
          content =
            `<p><strong>Current AQI:</strong> ${currentAqi}</p>
            <p><strong>Category:</strong> ${currentAqi > 80 ? 'Unhealthy' : currentAqi > 50 ? 'Moderate' : 'Good'}</p>
            <p><strong>Recommendation:</strong> ${currentAqi > 80 ? 'Avoid outdoor activities' : 'Normal'}</p>`;
          break;
        case 'power':
          title = '⚡ Power Usage Detail';
          content =
            `<p><strong>Current:</strong> ${currentPower.toFixed(2)} kW</p>
            <p><strong>Peak:</strong> 3.8 kW</p>
            <p><strong>Status:</strong> ${currentPower > 2.8 ? '⚠️ High' : currentPower < 0.5 ? '🔋 Low' : '✅ Normal'}</p>`;
          break;
        case 'alerts':
          title = '🔔 Alerts Detail';
          const active = alerts.filter(a => a.severity !== 'resolved');
          content = `<p><strong>Active alerts:</strong> ${active.length}</p>
            <p><strong>Total alerts:</strong> ${alerts.length}</p>
            <ul style="margin-top:8px; list-style:none; padding:0;">
              ${active.map(a => `<li style="padding:4px 0; border-bottom:1px solid var(--border-color);">🔴 ${a.title}</li>`).join('') || '<li style="color:var(--text-muted);">✅ No active alerts</li>'}
            </ul>`;
          break;
        default:
          title = '📊 Detail';
          content = `<p>Detail for ${stat} not available.</p>`;
      }
      openModal(title, content);
    });
  });

  // --- SENSOR ITEMS ---
  document.querySelectorAll('.sensor-item').forEach(item => {
    item.addEventListener('click', function() {
      const sensor = this.dataset.sensor;
      let title, content;
      switch (sensor) {
        case 'temp':
          title = '🌡️ Temperature Sensor';
          content =
            `<p><strong>Value:</strong> ${currentTemp.toFixed(1)} °C</p>
            <p><strong>Status:</strong> ${sTempStatus.textContent}</p>
            <p><strong>Bar:</strong> ${sTempBar.style.width}</p>
            <div style="margin-top:10px; background:var(--bg-secondary); padding:8px; border-radius:6px;">
              <small style="color:var(--text-muted);">🟦 Node #4 · Firmware v2.3</small>
            </div>`;
          break;
        case 'humidity':
          title = '💧 Humidity Sensor';
          content =
            `<p><strong>Value:</strong> ${currentHumid.toFixed(0)} %</p>
            <p><strong>Status:</strong> ${sHumidStatus.textContent}</p>
            <p><strong>Bar:</strong> ${sHumidBar.style.width}</p>
            <div style="margin-top:10px; background:var(--bg-secondary); padding:8px; border-radius:6px;">
              <small style="color:var(--text-muted);">🟩 Node #7 · Firmware v1.8</small>
            </div>`;
          break;
        case 'aqi':
          title = '🌬️ Air Quality Sensor';
          content =
            `<p><strong>Value:</strong> ${currentAqi} AQI</p>
            <p><strong>Status:</strong> ${sAqiStatus.textContent}</p>
            <p><strong>Bar:</strong> ${sAqiBar.style.width}</p>
            <div style="margin-top:10px; background:var(--bg-secondary); padding:8px; border-radius:6px;">
              <small style="color:var(--text-muted);">🟣 Node #2 · Firmware v3.1</small>
            </div>`;
          break;
        case 'power':
          title = '⚡ Power Sensor';
          content =
            `<p><strong>Value:</strong> ${currentPower.toFixed(2)} kW</p>
            <p><strong>Status:</strong> ${sPowerStatus.textContent}</p>
            <p><strong>Bar:</strong> ${sPowerBar.style.width}</p>
            <div style="margin-top:10px; background:var(--bg-secondary); padding:8px; border-radius:6px;">
              <small style="color:var(--text-muted);">🟠 Rack #3 · Firmware v2.0</small>
            </div>`;
          break;
        default:
          title = 'Sensor Detail';
          content = `<p>Detail for ${sensor} not available.</p>`;
      }
      openModal(title, content);
    });
  });

  // --- NOTIFICATION BELL ---
  document.getElementById('notifBell').addEventListener('click', function() {
    const dot = this.querySelector('.dot');
    if (!dot.classList.contains('hidden')) {
      alerts.forEach(a => {
        if (a.severity !== 'resolved') {
          a.severity = 'resolved';
          a.title = a.title + ' (resolved)';
        }
      });
      alertCount = 0;
      updateAlertUI();
      renderAlerts();
      dot.classList.add('hidden');
      this.style.borderColor = 'var(--accent-1)';
      setTimeout(() => { this.style.borderColor = ''; }, 400);
      openModal('🔔 Notifications cleared', '<p>All alerts have been marked as read.</p><p style="color:var(--text-muted);">New alerts will appear automatically.</p>');
    } else {
      openModal('🔔 No new notifications', '<p>You have no unread alerts.</p><p style="color:var(--text-muted);">Stay tuned for updates.</p>');
    }
  });

  // --- VIEW ALL ALERTS ---
  document.getElementById('viewAllAlerts').addEventListener('click', function(e) {
    e.stopPropagation();
    const list = alerts.map((a, i) =>
      `<div class="modal-alert-item">
        <span>${a.title}</span>
        <span class="sev ${a.severity}">${a.severity}</span>
      </div>`
    ).join('');
    openModal(
      '📋 All Alerts',
      `<div style="max-height:300px; overflow-y:auto;">${list || '<p style="color:var(--text-muted);">No alerts.</p>'}</div>
      <div style="margin-top:12px; font-size:12px; color:var(--text-muted);">Click on alert in dashboard to resolve or delete.</div>`
    );
  });

  // --- USER AVATAR ---
  document.querySelector('.user-avatar').addEventListener('click', function() {
    openModal(
      '👤 User Profile',
      `<p><strong>Name:</strong> John Doe</p>
      <p><strong>Role:</strong> Administrator</p>
      <p><strong>Email:</strong> john.doe@nexusiot.com</p>
      <p><strong>Devices managed:</strong> 12</p>
      <div style="margin-top:12px; background:var(--bg-secondary); padding:8px; border-radius:6px;">
        <small style="color:var(--text-muted);">🔒 Last login: ${new Date().toLocaleString()}</small>
      </div>`
    );
  });

  console.log('🚀 Nexus IoT Dashboard – all buttons functional.');
})();