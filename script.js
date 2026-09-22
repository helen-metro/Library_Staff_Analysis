"use strict";

const STATE_NAMES = {
  AK:"Alaska",AL:"Alabama",AR:"Arkansas",AS:"American Samoa",AZ:"Arizona",
  CA:"California",CO:"Colorado",CT:"Connecticut",DC:"District of Columbia",
  DE:"Delaware",FL:"Florida",GA:"Georgia",GU:"Guam",HI:"Hawaii",IA:"Iowa",
  ID:"Idaho",IL:"Illinois",IN:"Indiana",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",
  MA:"Massachusetts",MD:"Maryland",ME:"Maine",MI:"Michigan",MN:"Minnesota",
  MO:"Missouri",MP:"Northern Mariana Islands",MS:"Mississippi",MT:"Montana",
  NC:"North Carolina",ND:"North Dakota",NE:"Nebraska",NH:"New Hampshire",
  NJ:"New Jersey",NM:"New Mexico",NV:"Nevada",NY:"New York",OH:"Ohio",
  OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",PR:"Puerto Rico",
  RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",
  TX:"Texas",UT:"Utah",VA:"Virginia",VI:"U.S. Virgin Islands",VT:"Vermont",
  WA:"Washington",WI:"Wisconsin",WV:"West Virginia",WY:"Wyoming"
};

const COLORS = {
  orange: "#ff6f35",
  lightOrange: "#ffb372",
  purple: "#6d5ae6",
  blue: "#18aee0"
};

const app = {
  data: null,
  view: "national",
  metric: "staff",
  stateCode: "OK",
  snapshotYear: null,
  comparisonStart: null,
  comparisonEnd: null,
  populationTolerance: 35,
  budgetTolerance: 35,
  search: ""
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const formatNumber = (value, digits = 0) =>
  value == null || Number.isNaN(Number(value))
    ? "—"
    : new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(value);

const formatCompact = (value) =>
  value == null
    ? "—"
    : new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1
      }).format(value);

const formatMoney = (value, compact = false) =>
  value == null
    ? "—"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: compact ? "compact" : "standard",
        maximumFractionDigits: compact ? 1 : 0
      }).format(value);

const percentChange = (current, previous) =>
  current != null && previous != null && previous !== 0
    ? ((current - previous) / previous) * 100
    : null;

const formatPercent = (value) =>
  value == null ? "—" : `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;

const titleCase = (value = "") =>
  value.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const getRecordAtYear = (records, year) =>
  records.find((record) => record.year === year) ||
  [...records].reverse().find((record) => record.year <= year) ||
  records.at(-1);

const getPrimarySeries = () => {
  if (app.view === "state") {
    return app.data.states[app.stateCode] || app.data.states.OK;
  }
  if (app.view === "peers") return app.data.selected;
  return app.data.national;
};

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = value;
}

function initializeControls() {
  const { data } = app;
  const years = data.meta.years;
  app.snapshotYear = data.meta.latestYear;
  app.comparisonStart = years[0];
  app.comparisonEnd = years.includes(2023) ? 2023 : years.at(-1);

  $("#yearSelect").innerHTML = [...years]
    .reverse()
    .map((year) => `<option value="${year}">${year}</option>`)
    .join("");

  $("#stateSelect").innerHTML = Object.keys(data.states)
    .sort((a, b) => (STATE_NAMES[a] || a).localeCompare(STATE_NAMES[b] || b))
    .map((code) => `<option value="${code}">${escapeHtml(STATE_NAMES[code] || code)}</option>`)
    .join("");

  const startRange = $("#startYearRange");
  const endRange = $("#endYearRange");
  startRange.min = years[0];
  startRange.max = years.at(-1) - 1;
  startRange.value = app.comparisonStart;
  endRange.min = years[0] + 1;
  endRange.max = years.at(-1);
  endRange.value = app.comparisonEnd;

  setText("#rangeMin", years[0]);
  setText("#rangeMax", years.at(-1));
  setText("#latestYear", data.meta.latestYear);
  setText("#yearCoverage", `${years[0]}—${years.at(-1)}`);
  setText("#sourceText", `Source: ${data.meta.source} + LibraryInfo.csv`);
}

function updateHeaderAndFilters() {
  $$(".segmented [data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === app.view);
  });

  $$(".metric-toggle [data-metric]").forEach((button) => {
    button.classList.toggle("active", button.dataset.metric === app.metric);
  });

  $("#stateControl").hidden = app.view !== "state";
  $("#comparisonControl").hidden = app.view !== "peers";
  $("#stateSelect").value = app.stateCode;
  $("#yearSelect").value = app.snapshotYear;
  $("#qualityAlert").hidden = app.snapshotYear !== 2024;

  const viewNote =
    app.view === "peers"
      ? "Focus: OK0074"
      : app.view === "state"
        ? `State code: ${app.stateCode}`
        : "All U.S. systems";
  setText("#viewNote", viewNote);
}

function updateKpis(primary, current, previous) {
  const first = primary.find(
    (record) => record.year <= current.year && record[app.metric] != null
  );
  const staffChange = percentChange(current.staff, previous?.staff);
  const librarianChange = percentChange(current.librarians, previous?.librarians);
  const longTermChange = percentChange(current[app.metric], first?.[app.metric]);
  const librarianShare =
    current.staff && current.librarians ? (current.librarians / current.staff) * 100 : 0;

  setText("#staffChange", previous ? formatPercent(staffChange) : "BASE");
  $("#staffChange").title = previous ? `Change from ${previous.year}` : "First available year";
  setText("#staffValue", formatNumber(current.staff, 1));
  setText("#staffMeta", `FTE · ${current.year}`);

  setText("#librarianChange", previous ? formatPercent(librarianChange) : "BASE");
  $("#librarianChange").title = previous ? `Change from ${previous.year}` : "First available year";
  setText("#librarianValue", formatNumber(current.librarians, 1));
  setText(
    "#librarianMeta",
    `${librarianShare.toFixed(1)}% of paid staff · ${current.year}`
  );

  setText("#longTermBadge", formatPercent(longTermChange));
  setText("#longTermValue", formatPercent(longTermChange));
  setText(
    "#longTermMeta",
    `Since ${first?.year || current.year} · ${app.metric === "staff" ? "paid staff" : "librarians"}`
  );

  setText("#spendPerCapita", formatMoney(current.spendPerCapita));
  setText("#budgetValue", formatMoney(current.budget, true));
  setText("#budgetMeta", `investment · ${current.year}`);
}

function getChartSeries(primary) {
  if (app.view !== "peers") {
    const label =
      app.view === "state"
        ? `${STATE_NAMES[app.stateCode] || app.stateCode} workforce`
        : "Nationwide workforce";
    return [{ label, color: COLORS.orange, values: primary }];
  }

  const withinRange = (record) =>
    record.year >= app.comparisonStart && record.year <= app.comparisonEnd;

  return [
    {
      label: app.data.meta.selectedCode,
      color: COLORS.orange,
      values: app.data.selected.filter(withinRange)
    },
    {
      label: "Peer median",
      color: COLORS.purple,
      values: app.data.peerMedian.filter(withinRange)
    }
  ];
}

function createLineChart(series) {
  const width = 850;
  const height = 286;
  const padding = { left: 54, right: 18, top: 22, bottom: 39 };
  const values = series.flatMap((item) =>
    item.values.map((record) => record[app.metric]).filter((value) => value != null)
  );

  if (!values.length) {
    $("#lineChart").innerHTML = '<p class="empty-state">No trend data are available.</p>';
    return;
  }

  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const floor =
    series.length > 1 ? Math.max(0, minimum - (maximum - minimum) * 0.18) : 0;
  const ceiling = Math.max(maximum * 1.08, floor + 1);
  const years = series[0].values.map((record) => record.year);
  const x = (index) =>
    padding.left +
    (index / Math.max(1, years.length - 1)) * (width - padding.left - padding.right);
  const y = (value) =>
    padding.top +
    (1 - (value - floor) / Math.max(1, ceiling - floor)) *
      (height - padding.top - padding.bottom);
  const ticks = Array.from({ length: 5 }, (_, index) =>
    floor + ((ceiling - floor) * index) / 4
  ).reverse();
  const labelInterval = Math.max(1, Math.ceil(years.length / 6));

  const grid = ticks
    .map((tick) => {
      const label = tick >= 10000 ? `${formatNumber(tick / 1000)}k` : formatNumber(tick, 1);
      return `
        <line x1="${padding.left}" x2="${width - padding.right}" y1="${y(tick)}" y2="${y(tick)}" class="grid-line"></line>
        <text x="${padding.left - 11}" y="${y(tick) + 4}" text-anchor="end" class="axis-label">${label}</text>
      `;
    })
    .join("");

  const yearLabels = years
    .map((year, index) =>
      index % labelInterval === 0 || index === years.length - 1
        ? `<text x="${x(index)}" y="${height - 12}" text-anchor="middle" class="axis-label">${year}</text>`
        : ""
    )
    .join("");

  const selectedIndex = years.indexOf(app.snapshotYear);
  const selectedYearMarker =
    selectedIndex >= 0
      ? `
        <line x1="${x(selectedIndex)}" x2="${x(selectedIndex)}" y1="${padding.top}" y2="${height - padding.bottom}" stroke="#d8ccc5" stroke-dasharray="4 4"></line>
        <text x="${x(selectedIndex)}" y="${padding.top + 10}" text-anchor="middle" class="axis-label">snapshot</text>
      `
      : "";

  const paths = series
    .map((item) => {
      let path = "";
      item.values.forEach((record, index) => {
        const value = record[app.metric];
        if (value == null) return;
        path += `${path ? " L" : "M"} ${x(index)} ${y(value)}`;
      });

      const points = item.values
        .map((record, index) => {
          const value = record[app.metric];
          if (value == null) return "";
          const radius = record.year === app.snapshotYear ? 5 : 3.2;
          return `
            <circle cx="${x(index)}" cy="${y(value)}" r="${radius}" fill="${item.color}" stroke="#fff" stroke-width="2">
              <title>${escapeHtml(item.label)} · ${record.year}: ${formatNumber(value, 2)}</title>
            </circle>
          `;
        })
        .join("");

      return `<path d="${path}" fill="none" stroke="${item.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>${points}`;
    })
    .join("");

  $("#lineChart").innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" class="line-chart" aria-hidden="true">
      ${grid}
      ${yearLabels}
      ${selectedYearMarker}
      ${paths}
    </svg>
  `;

  $("#lineChart").setAttribute(
    "aria-label",
    `${app.metric === "staff" ? "Paid staff" : "Librarians"} trend from ${years[0]} through ${years.at(-1)}`
  );
}

function updateTrend(primary, current) {
  const series = getChartSeries(primary);
  const title =
    app.view === "national"
      ? "Nationwide workforce"
      : app.view === "state"
        ? `${STATE_NAMES[app.stateCode] || app.stateCode} workforce`
        : `${app.data.meta.selectedCode} vs peer median`;
  const subtitle =
    app.view === "national"
      ? `${formatNumber(current.reportingStaff || current.systems)} reporting public library systems`
      : app.view === "state"
        ? `${formatNumber(current.systems)} systems aggregated across ${STATE_NAMES[app.stateCode] || app.stateCode}`
        : "Eight closest systems by population and operating budget";

  setText("#trendTitle", title);
  setText("#trendSubtitle", subtitle);
  createLineChart(series);

  $("#chartLegend").innerHTML = series
    .map(
      (item) =>
        `<span><i style="background:${item.color}"></i>${escapeHtml(item.label)}</span>`
    )
    .join("");

  setText(
    "#chartHint",
    app.view === "peers"
      ? `${app.comparisonEnd - app.comparisonStart + 1} years selected`
      : "Hover points for exact values"
  );

  if (app.view === "peers") updateComparisonControl();
}

function updateComparisonControl() {
  const years = app.data.meta.years;
  const minimum = years[0];
  const maximum = years.at(-1);
  const span = Math.max(1, maximum - minimum);
  const startRecord = getRecordAtYear(app.data.selected, app.comparisonStart);
  const endRecord = getRecordAtYear(app.data.selected, app.comparisonEnd);
  const change = percentChange(endRecord?.[app.metric], startRecord?.[app.metric]);
  const output = $("#comparisonChange");

  $("#startYearRange").value = app.comparisonStart;
  $("#endYearRange").value = app.comparisonEnd;
  setText("#comparisonYears", `${app.comparisonStart}—${app.comparisonEnd}`);
  $("#rangeFill").style.left = `${((app.comparisonStart - minimum) / span) * 100}%`;
  $("#rangeFill").style.right = `${100 - ((app.comparisonEnd - minimum) / span) * 100}%`;
  output.classList.toggle("negative", change != null && change < 0);
  output.querySelector("b").textContent = formatPercent(change);
  output.querySelector("span").textContent =
    `OK0074 ${app.metric === "staff" ? "paid staff" : "librarians"}`;
}

function updateWorkforceMix(current) {
  const alaShare =
    current.staff && current.alaLibrarians ? (current.alaLibrarians / current.staff) * 100 : 0;
  const otherLibrarians = Math.max(
    0,
    (current.librarians || 0) - (current.alaLibrarians || 0)
  );
  const otherLibrarianShare = current.staff
    ? (otherLibrarians / current.staff) * 100
    : 0;
  const otherPaidStaff = current.otherPaidStaff ?? Math.max(
    0,
    (current.staff || 0) - (current.librarians || 0)
  );
  const otherShare = current.staff ? (otherPaidStaff / current.staff) * 100 : 0;
  const middle = Math.min(100, alaShare + otherLibrarianShare);

  setText("#mixYear", `${current.year} reconciled composition`);
  setText("#librarianShareBadge", `${formatNumber(current.staff, 1)} FTE`);
  setText("#mixTotal", formatCompact(current.staff));
  setText("#mixAla", `${formatNumber(current.alaLibrarians, 1)} FTE`);
  setText("#mixAlaShare", `${alaShare.toFixed(1)}%`);
  setText("#mixOtherLibrarians", `${formatNumber(otherLibrarians, 1)} FTE`);
  setText("#mixOtherLibrarianShare", `${otherLibrarianShare.toFixed(1)}%`);
  setText("#mixOtherFte", `${formatNumber(otherPaidStaff, 1)} FTE`);
  setText("#mixOtherShare", `${otherShare.toFixed(1)}%`);

  $("#workforceDonut").style.background =
    `conic-gradient(${COLORS.purple} 0 ${alaShare}%, ${COLORS.orange} ${alaShare}% ${middle}%, ${COLORS.blue} ${middle}% 100%)`;
}

function benchmarkRow(label, note, value, maximum, color) {
  const width = maximum ? Math.max(4, (value / maximum) * 100) : 0;
  return `
    <div class="benchmark-row">
      <div><b>${escapeHtml(label)}</b><small>${escapeHtml(note)}</small></div>
      <div class="bar-track"><i style="width:${width}%;background:${color}"></i></div>
      <strong>${formatNumber(value, 2)}</strong>
    </div>
  `;
}

function updateBenchmark() {
  const { data } = app;
  const selected = getRecordAtYear(data.selected, app.snapshotYear);
  const national = getRecordAtYear(data.national, app.snapshotYear);
  const oklahoma = getRecordAtYear(data.states.OK, app.snapshotYear);
  const peer = getRecordAtYear(data.peerMedian, app.snapshotYear);
  const selectedInfo = data.meta.selectedLibrary || {};
  const selectedName = titleCase(selectedInfo.name) || data.meta.selectedCode;
  const values = [
    selected.staffPer10k || 0,
    oklahoma.staffPer10k || 0,
    peer.staffPer10k || 0,
    national.staffPer10k || 0
  ];
  const maximum = Math.max(...values) * 1.12;
  const peerChange = percentChange(selected.staffPer10k, peer.staffPer10k);

  setText("#benchmarkTitle", `${selectedName} staffing benchmark`);
  setText("#benchmarkSubtitle", `OK0074 · Paid FTE per 10,000 residents · ${selected.year}`);
  setText("#benchmarkBadge", `${formatPercent(peerChange)} vs peers`);
  $("#benchmarkBadge").classList.toggle("negative", peerChange != null && peerChange < 0);
  $("#benchmarkRows").innerHTML = [
    benchmarkRow("OK0074", selectedName, values[0], maximum, COLORS.orange),
    benchmarkRow("Oklahoma", "State aggregate", values[1], maximum, COLORS.lightOrange),
    benchmarkRow("Peer median", "8 closest systems", values[2], maximum, COLORS.purple),
    benchmarkRow("Nationwide", "U.S. aggregate", values[3], maximum, COLORS.blue)
  ].join("");

  const direction = peerChange == null || peerChange >= 0 ? "more" : "less";
  setText("#signalYear", `WORKFORCE SIGNAL · ${selected.year}`);
  setText("#signalStaff", formatNumber(selected.staff, 1));
  setText("#signalTitle", `paid FTE at ${selectedName}`);
  setText(
    "#signalText",
    `That is ${Math.abs(peerChange || 0).toFixed(1)}% ${direction} staff per resident than the matched-system median, with ${formatMoney(selected.spendPerCapita)} invested per resident.`
  );
  setText("#signalLocation", `${titleCase(selectedInfo.city)}, ${selectedInfo.state || ""}`);
  setText("#signalPopulation", `${formatNumber(selected.population)} people`);

  setText("#focusName", selectedName);
  setText("#focusLocation", `${titleCase(selectedInfo.city)}, ${selectedInfo.state || ""} · ${selectedInfo.locale || "—"}`);
  setText("#focusStaff", formatNumber(selected.staff, 1));
  setText("#focusYear", selected.year);
}

function getMatchedPeers() {
  const target = app.data.selected.at(-1);
  if (!target?.population || !target?.budget) return [];
  const query = app.search.trim().toLowerCase();

  return app.data.latestSystems
    .filter(
      (record) =>
        record.code !== app.data.meta.selectedCode && record.population && record.budget
    )
    .map((record) => ({
      ...record,
      populationGap: Math.abs((record.population / target.population - 1) * 100),
      budgetGap: Math.abs((record.budget / target.budget - 1) * 100)
    }))
    .filter((record) => {
      if (query) {
        return [record.code, record.name, record.city, record.state, record.locale]
          .some((value) => String(value || "").toLowerCase().includes(query));
      }
      return (
        record.populationGap <= app.populationTolerance &&
        record.budgetGap <= app.budgetTolerance
      );
    })
    .sort(
      (a, b) =>
        a.populationGap + a.budgetGap - (b.populationGap + b.budgetGap)
    );
}

function updatePeerTable() {
  const peers = getMatchedPeers();
  const rows = peers.slice(0, 12);
  setText("#matchCount", peers.length);
  setText("#populationToleranceLabel", `±${app.populationTolerance}%`);
  setText("#budgetToleranceLabel", `±${app.budgetTolerance}%`);
  setText(
    "#peerDescription",
    `Match ${titleCase(app.data.meta.selectedLibrary?.name)} using population and operating expenditures. System-level finder results use ${app.data.meta.latestYear} records.`
  );

  $("#peerTableBody").innerHTML = rows
    .map(
      (record, index) => `
        <tr>
          <td><div class="system-cell"><span class="rank">${String(index + 1).padStart(2, "0")}</span><span><b>${escapeHtml(titleCase(record.name) || record.code)}</b><small>${escapeHtml(record.code)}</small></span></div></td>
          <td class="location"><b>${escapeHtml(titleCase(record.city) || "—")}</b><small>${escapeHtml(STATE_NAMES[record.state] || record.state)}</small></td>
          <td>${escapeHtml(record.locale || "—")}</td>
          <td>${formatNumber(record.population)}</td>
          <td>${formatMoney(record.budget, true)}</td>
          <td>${formatNumber(record.staff, 1)}</td>
          <td>${formatNumber(record.librarians, 1)}</td>
          <td>${formatNumber(record.buildings)}</td>
          <td><b>${formatNumber(record.staffPer10k, 2)}</b></td>
        </tr>
      `
    )
    .join("");

  $("#emptyState").hidden = rows.length > 0;
}

function updateDashboard() {
  const primary = getPrimarySeries();
  const current = getRecordAtYear(primary, app.snapshotYear);
  const previous = [...primary].reverse().find((record) => record.year < current.year);

  updateHeaderAndFilters();
  updateKpis(primary, current, previous);
  updateTrend(primary, current);
  updateWorkforceMix(current);
  updateBenchmark();
  updatePeerTable();
}

function setView(view) {
  app.view = view;
  updateDashboard();
}

function downloadCsv() {
  const primary = getPrimarySeries();
  const records =
    app.view === "peers"
      ? primary.filter(
          (record) =>
            record.year >= app.comparisonStart && record.year <= app.comparisonEnd
        )
      : primary;
  const rows = [
    ["Year", "Total paid staff", "Total librarians", "Population", "Operating budget"],
    ...records.map((record) => [
      record.year,
      record.staff ?? "",
      record.librarians ?? "",
      record.population ?? "",
      record.budget ?? ""
    ])
  ];
  const csv = rows
    .map((row) =>
      row
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(",")
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `library-staffing-${app.view}-${app.snapshotYear}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function openMenu() {
  $("#sidebar").classList.add("open");
  $("#scrim").hidden = false;
}

function closeMenu() {
  $("#sidebar").classList.remove("open");
  $("#scrim").hidden = true;
}

function attachEvents() {
  $$(".segmented [data-view]").forEach((button) =>
    button.addEventListener("click", () => setView(button.dataset.view))
  );

  $$(".metric-toggle [data-metric]").forEach((button) =>
    button.addEventListener("click", () => {
      app.metric = button.dataset.metric;
      updateDashboard();
    })
  );

  $$("[data-quick-view]").forEach((button) =>
    button.addEventListener("click", () => {
      if (button.dataset.quickView === "state") app.stateCode = "OK";
      setView(button.dataset.quickView);
      closeMenu();
    })
  );

  $("#stateSelect").addEventListener("change", (event) => {
    app.stateCode = event.target.value;
    updateDashboard();
  });

  $("#yearSelect").addEventListener("change", (event) => {
    app.snapshotYear = Number(event.target.value);
    updateDashboard();
  });

  $("#startYearRange").addEventListener("input", (event) => {
    app.comparisonStart = Math.min(
      Number(event.target.value),
      app.comparisonEnd - 1
    );
    updateDashboard();
  });

  $("#endYearRange").addEventListener("input", (event) => {
    app.comparisonEnd = Math.max(
      Number(event.target.value),
      app.comparisonStart + 1
    );
    updateDashboard();
  });

  $("#populationTolerance").addEventListener("input", (event) => {
    app.populationTolerance = Number(event.target.value);
    updatePeerTable();
  });

  $("#budgetTolerance").addEventListener("input", (event) => {
    app.budgetTolerance = Number(event.target.value);
    updatePeerTable();
  });

  $("#searchInput").addEventListener("input", (event) => {
    app.search = event.target.value;
    const exactState = Object.entries(STATE_NAMES).find(
      ([code, name]) =>
        code.toLowerCase() === app.search.trim().toLowerCase() ||
        name.toLowerCase() === app.search.trim().toLowerCase()
    );
    if (exactState && app.data.states[exactState[0]]) {
      app.stateCode = exactState[0];
      app.view = "state";
    } else if (app.search.trim().toLowerCase() === app.data.meta.selectedCode.toLowerCase()) {
      app.view = "peers";
    }
    updateDashboard();
  });

  $("#exportButton").addEventListener("click", downloadCsv);
  $("#openMenu").addEventListener("click", openMenu);
  $("#closeMenu").addEventListener("click", closeMenu);
  $("#scrim").addEventListener("click", closeMenu);
  $$(".nav-link").forEach((link) => link.addEventListener("click", closeMenu));
}

function start() {
  try {
    if (!window.STAFFING_DATA) {
      throw new Error("staffing-data.js is missing.");
    }
    app.data = window.STAFFING_DATA;
    initializeControls();
    attachEvents();
    updateDashboard();
    $("#loading").hidden = true;
  } catch (error) {
    console.error(error);
    $("#loading").hidden = true;
    $("#errorMessage").hidden = false;
  }
}

document.addEventListener("DOMContentLoaded", start);
