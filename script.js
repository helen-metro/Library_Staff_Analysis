const YEARS = [
  2009, 2010, 2011, 2012,
  2013, 2014, 2015, 2016,
  2017, 2018, 2019, 2020,
  2021, 2022, 2023, 2024
];

const DATA = {
  national: {
    title: "Nationwide workforce",
    subtitle: "Public library systems reporting nationwide",
    note: "All U.S. public library systems",

    staff: [
      144573.27, 139964.69, 137830.35, 137424.08,
      137614.09, 138819.22, 139422.03, 140319.63,
      142378.52, 143555.08, 144681.54, 140671.59,
      138826.58, 141455.14, 143579.28, 147368.45
    ],

    librarians: [
      48071.62, 47064.09, 46904.52, 46997.43,
      47566.02, 47370.13, 48049.22, 48774.97,
      49681.86, 50665.33, 51205.14, 50530.41,
      50906.3, 51321.11, 52163.01, 53137.72
    ],

    latest: {
      staff: 147368.45,
      librarians: 53137.72,
      alaLibrarians: 34461.92,
      budget: 16165992977,
      population: 343095245
    }
  },

  state: {
    title: "Oklahoma workforce",
    subtitle: "122 public library systems aggregated across Oklahoma",
    note: "State code: OK",

    staff: [
      1312.78, 1338.23, 1342.97, 1390.8,
      1413.51, 1469.09, 1423.51, 1581.1,
      1740.84, 1533.21, 1566.01, 1543.51,
      1463.45, 1505.41, 1478.42, 1744.55
    ],

    librarians: [
      630.39, 640.03, 639.48, 661.02,
      665.72, 679.94, 736.19, 813.43,
      937.06, 876.86, 883.48, 984.16,
      894, 976.65, 1041, 1085.85
    ],

    latest: {
      staff: 1744.55,
      librarians: 1085.85,
      alaLibrarians: 338.3,
      budget: 151334236,
      population: 3311462
    }
  },

  peers: {
    title: "Metropolitan Library System vs peer median",
    subtitle: "Eight closest systems by population and operating budget",
    note: "Focus system: OK0074",

    staff: [
      314.6, 321.76, 330.92, 349.94,
      376.11, 366.64, 382.46, 382.22,
      398.13, 391.39, 402.86, 396.75,
      353.88, 387.9, 354.29, 637.3
    ],

    librarians: [
      100.55, 99.84, 100.7, 115.98,
      125.55, 130.55, 134.84, 199.16,
      151.88, 158, 151.25, 249,
      178.5, 244.25, 233.25, 278.5
    ],

    peerStaff: [
      328.26, 321.88, 311.61, 312.82,
      341.41, 348.08, 379.73, 363,
      367.56, 366.69, 369.86, 351.15,
      354, 375.24, 398.99, 399.38
    ],

    peerLibrarians: [
      80.1, 77.81, 82.95, 88.5,
      86.5, 88.04, 93.62, 97.25,
      98.5, 98.25, 100.75, 108.5,
      96.38, 87.5, 96, 90.75
    ],

    latest: {
      staff: 637.3,
      librarians: 278.5,
      alaLibrarians: 139.25,
      budget: 48471374,
      population: 808866
    }
  }
};

const LIBRARIES = [
  {
    code: "MD0004",
    name: "Baltimore County Public Library",
    city: "Towson",
    state: "Maryland",
    locale: "City (13)",
    buildings: 23,
    population: 849316,
    budget: 54010716,
    staff: 455,
    librarians: 194,
    staffPer10k: 5.36
  },
  {
    code: "UT0049",
    name: "Salt Lake County Library",
    city: "West Jordan",
    state: "Utah",
    locale: "Suburban (21)",
    buildings: 19,
    population: 926667,
    budget: 51648615,
    staff: 404.75,
    librarians: 92.5,
    staffPer10k: 4.37
  },
  {
    code: "TN0135",
    name: "Nashville Public Library",
    city: "Nashville",
    state: "Tennessee",
    locale: "City (11)",
    buildings: 21,
    population: 712334,
    budget: 53474087,
    staff: 426.85,
    librarians: 89,
    staffPer10k: 5.99
  },
  {
    code: "WA0065",
    name: "Sno-Isle Libraries",
    city: "Marysville",
    state: "Washington",
    locale: "Suburban (22)",
    buildings: 24,
    population: 819554,
    budget: 61193924,
    staff: 394.01,
    librarians: 49.38,
    staffPer10k: 4.81
  },
  {
    code: "WA0063",
    name: "Pierce County Library System",
    city: "Tacoma",
    state: "Washington",
    locale: "Suburban (21)",
    buildings: 19,
    population: 665760,
    budget: 43362407,
    staff: 303.29,
    librarians: 75.5,
    staffPer10k: 4.56
  },
  {
    code: "MO0036",
    name: "Saint Louis County Library",
    city: "St. Louis",
    state: "Missouri",
    locale: "Suburban (21)",
    buildings: 29,
    population: 863407,
    budget: 61211314,
    staff: 525.9,
    librarians: 269,
    staffPer10k: 6.09
  },
  {
    code: "FL0042",
    name: "Lee County Library System",
    city: "Fort Myers",
    state: "Florida",
    locale: "City (13)",
    buildings: 14,
    population: 779221,
    budget: 37294791,
    staff: 239,
    librarians: 85,
    staffPer10k: 3.07
  },
  {
    code: "MD0017",
    name: "Prince George's County Memorial Library System",
    city: "Largo",
    state: "Maryland",
    locale: "Suburban (21)",
    buildings: 19,
    population: 955306,
    budget: 39936076,
    staff: 377.13,
    librarians: 175.13,
    staffPer10k: 3.95
  }
];

const TARGET = {
  population: 808866,
  budget: 48471374
};

let currentView = "national";
let currentMetric = "staff";
let searchQuery = "";

let trendChart;
let mixChart;

const numberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1
});

const integerFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0
});

const compactFormat = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1
});

const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const compactCurrencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1
});

function percentChange(current, previous) {
  return previous ? ((current - previous) / previous) * 100 : 0;
}

function formatPercent(value) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function currentData() {
  return DATA[currentView];
}

function initializeCharts() {
  const trendContext = document
    .getElementById("trendChart")
    .getContext("2d");

  trendChart = new Chart(trendContext, {
    type: "line",

    data: {
      labels: YEARS,
      datasets: []
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: "#292522",
          padding: 10,
          callbacks: {
            label(context) {
              return `${context.dataset.label}: ${numberFormat.format(
                context.raw
              )} FTE`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          border: {
            display: false
          },
          ticks: {
            color: "#aaa49f",
            font: {
              size: 9
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "#eee9e5"
          },
          border: {
            display: false
          },
          ticks: {
            color: "#aaa49f",
            font: {
              size: 9
            },
            callback(value) {
              return value >= 10000
                ? `${Math.round(value / 1000)}K`
                : numberFormat.format(value);
            }
          }
        }
      }
    }
  });

  const mixContext = document
    .getElementById("mixChart")
    .getContext("2d");

  mixChart = new Chart(mixContext, {
    type: "doughnut",

    data: {
      labels: [
        "ALA-MLS librarians",
        "Other librarians",
        "Other paid staff"
      ],

      datasets: [
        {
          data: [],
          backgroundColor: [
            "#ff6f35",
            "#6d5ae6",
            "#18aee0"
          ],
          borderColor: "#ffffff",
          borderWidth: 5,
          borderRadius: 6,
          hoverOffset: 4
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

function updateTrendChart() {
  const data = currentData();

  const datasets = [
    {
      label: currentView === "peers"
        ? "Metropolitan Library System"
        : data.title,

      data: data[currentMetric],
      borderColor: "#ff6f35",
      backgroundColor: "rgba(255,111,53,0.14)",
      pointBackgroundColor: "#ff6f35",
      pointBorderColor: "#ffffff",
      pointBorderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 6,
      borderWidth: 3,
      fill: currentView !== "peers",
      tension: 0.35
    }
  ];

  if (currentView === "peers") {
    datasets.push({
      label: "Peer median",
      data: currentMetric === "staff"
        ? data.peerStaff
        : data.peerLibrarians,
      borderColor: "#6d5ae6",
      backgroundColor: "transparent",
      pointBackgroundColor: "#6d5ae6",
      pointBorderColor: "#ffffff",
      pointBorderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 6,
      borderWidth: 3,
      fill: false,
      tension: 0.35
    });
  }

  trendChart.data.datasets = datasets;
  trendChart.options.scales.y.beginAtZero =
    currentView !== "peers";

  trendChart.update();

  document.getElementById("chartLegend").innerHTML =
    datasets.map((dataset) => `
      <span>
        <i style="background:${dataset.borderColor}"></i>
        ${dataset.label}
      </span>
    `).join("");
}

function updateMixChart() {
  const latest = currentData().latest;

  const otherLibrarians = Math.max(
    0,
    latest.librarians - latest.alaLibrarians
  );

  const otherPaidStaff = Math.max(
    0,
    latest.staff - latest.librarians
  );

  const categories = [
    {
      name: "ALA-MLS librarians",
      value: latest.alaLibrarians,
      color: "#ff6f35"
    },
    {
      name: "Other librarians",
      value: otherLibrarians,
      color: "#6d5ae6"
    },
    {
      name: "Other paid staff",
      value: otherPaidStaff,
      color: "#18aee0"
    }
  ];

  mixChart.data.datasets[0].data =
    categories.map((category) => category.value);

  mixChart.update();

  const librarianShare =
    (latest.librarians / latest.staff) * 100;

  document.getElementById("mixPercentage").textContent =
    `${librarianShare.toFixed(1)}%`;

  document.getElementById("mixTotal").textContent =
    compactFormat.format(latest.staff);

  document.getElementById("mixLegend").innerHTML =
    categories.map((category) => {
      const share = category.value / latest.staff * 100;

      return `
        <div>
          <i style="background:${category.color}"></i>

          <span>
            <b>${category.name}</b>
            <small>${numberFormat.format(category.value)} FTE</small>
          </span>

          <strong>${share.toFixed(1)}%</strong>
        </div>
      `;
    }).join("");
}

function updateKpis() {
  const data = currentData();
  const latest = data.latest;

  const staffChange = percentChange(
    data.staff[data.staff.length - 1],
    data.staff[10]
  );

  const librarianChange = percentChange(
    data.librarians[data.librarians.length - 1],
    data.librarians[10]
  );

  const activeSeries = data[currentMetric];

  const longTermChange = percentChange(
    activeSeries[activeSeries.length - 1],
    activeSeries[0]
  );

  const librarianShare =
    latest.librarians / latest.staff * 100;

  const spendingPerResident =
    latest.budget / latest.population;

  document.getElementById("staffTotal").textContent =
    numberFormat.format(latest.staff);

  document.getElementById("librarianTotal").textContent =
    numberFormat.format(latest.librarians);

  document.getElementById("staffChangeBadge").textContent =
    formatPercent(staffChange);

  document.getElementById("librarianChangeBadge").textContent =
    formatPercent(librarianChange);

  document.getElementById("librarianShare").textContent =
    `${librarianShare.toFixed(1)}% of paid staff`;

  document.getElementById("longTermChange").textContent =
    formatPercent(longTermChange);

  document.getElementById("longTermBadge").textContent =
    formatPercent(longTermChange);

  document.getElementById("longTermLabel").textContent =
    `${currentMetric === "staff"
      ? "Paid staff"
      : "Librarians"} since 2009`;

  document.getElementById("operatingBudget").textContent =
    compactCurrencyFormat.format(latest.budget);

  document.getElementById("spendingBadge").textContent =
    currencyFormat.format(spendingPerResident);
}

function updateDashboard() {
  const data = currentData();

  document.getElementById("trendTitle").textContent =
    data.title;

  document.getElementById("trendSubtitle").textContent =
    data.subtitle;

  document.getElementById("viewNote").textContent =
    data.note;

  document.getElementById("stateControl").classList.toggle(
    "visible",
    currentView === "state"
  );

  updateKpis();
  updateTrendChart();
  updateMixChart();
}

function selectView(view) {
  currentView = view;

  document.querySelectorAll("#viewControls button")
    .forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.view === view
      );
    });

  updateDashboard();
  closeSidebar();
}

function selectMetric(metric) {
  currentMetric = metric;

  document.querySelectorAll("#metricControls button")
    .forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.metric === metric
      );
    });

  updateDashboard();
}

function renderPeerTable() {
  const populationTolerance = Number(
    document.getElementById("populationTolerance").value
  );

  const budgetTolerance = Number(
    document.getElementById("budgetTolerance").value
  );

  document.getElementById("populationLabel").textContent =
    `±${populationTolerance}%`;

  document.getElementById("budgetLabel").textContent =
    `±${budgetTolerance}%`;

  const query = searchQuery.trim().toLowerCase();

  let systems = LIBRARIES.map((library) => {
    const populationDifference = Math.abs(
      library.population / TARGET.population - 1
    ) * 100;

    const budgetDifference = Math.abs(
      library.budget / TARGET.budget - 1
    ) * 100;

    return {
      ...library,
      populationDifference,
      budgetDifference,
      combinedDifference:
        populationDifference + budgetDifference
    };
  });

  if (query) {
    systems = systems.filter((library) => {
      const searchableValues = [
        library.code,
        library.name,
        library.city,
        library.state,
        library.locale
      ];

      return searchableValues.some((value) =>
        value.toLowerCase().includes(query)
      );
    });
  } else {
    systems = systems.filter((library) =>
      library.populationDifference <= populationTolerance &&
      library.budgetDifference <= budgetTolerance
    );
  }

  systems.sort(
    (first, second) =>
      first.combinedDifference - second.combinedDifference
  );

  document.getElementById("matchCount").textContent =
    systems.length;

  document.getElementById("matchLabel").textContent =
    query ? "search results" : "systems match";

  document.getElementById("peerTableBody").innerHTML =
    systems.map((library, index) => `
      <tr>
        <td class="system-cell">
          <span class="rank">
            ${String(index + 1).padStart(2, "0")}
          </span>

          <span>
            <b>${library.name}</b>
            <small>${library.code}</small>
          </span>
        </td>

        <td>
          <span class="location-cell">
            <b>${library.city}</b>
            <small>${library.state}</small>
          </span>
        </td>

        <td>${library.locale}</td>
        <td>${integerFormat.format(library.population)}</td>
        <td>${compactCurrencyFormat.format(library.budget)}</td>
        <td>${numberFormat.format(library.staff)}</td>
        <td>${numberFormat.format(library.librarians)}</td>
        <td>${integerFormat.format(library.buildings)}</td>
        <td><b>${library.staffPer10k.toFixed(2)}</b></td>
      </tr>
    `).join("");

  document.getElementById("emptyState").style.display =
    systems.length ? "none" : "block";
}

function exportCurrentView() {
  const data = currentData();

  const rows = [
    [
      "Year",
      "Total Paid Staff",
      "Total Librarians"
    ]
  ];

  YEARS.forEach((year, index) => {
    rows.push([
      year,
      data.staff[index],
      data.librarians[index]
    ]);
  });

  const csv = rows
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8"
  });

  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download =
    `library-staffing-${currentView}-2009-2024.csv`;

  link.click();
  URL.revokeObjectURL(link.href);
}

function handleSearch(value) {
  searchQuery = value;
  const normalized = value.trim().toLowerCase();

  if (
    normalized === "ok" ||
    normalized.includes("oklahoma")
  ) {
    selectView("state");
  } else if (
    normalized.includes("national") ||
    normalized.includes("nationwide")
  ) {
    selectView("national");
  } else if (normalized) {
    selectView("peers");
  }

  renderPeerTable();
}

function openSidebar() {
  document.getElementById("sidebar")
    .classList.add("open");

  document.getElementById("sidebarOverlay")
    .classList.add("visible");
}

function closeSidebar() {
  document.getElementById("sidebar")
    .classList.remove("open");

  document.getElementById("sidebarOverlay")
    .classList.remove("visible");
}

function initializeEvents() {
  document.querySelectorAll("#viewControls button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        selectView(button.dataset.view);
      });
    });

  document.querySelectorAll(".quick-link")
    .forEach((button) => {
      button.addEventListener("click", () => {
        selectView(button.dataset.view);
      });
    });

  document.querySelectorAll("#metricControls button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        selectMetric(button.dataset.metric);
      });
    });

  document.getElementById("populationTolerance")
    .addEventListener("input", renderPeerTable);

  document.getElementById("budgetTolerance")
    .addEventListener("input", renderPeerTable);

  document.getElementById("dashboardSearch")
    .addEventListener("input", (event) => {
      handleSearch(event.target.value);
    });

  document.getElementById("exportButton")
    .addEventListener("click", exportCurrentView);

  document.getElementById("mobileMenu")
    .addEventListener("click", openSidebar);

  document.getElementById("closeMenu")
    .addEventListener("click", closeSidebar);

  document.getElementById("sidebarOverlay")
    .addEventListener("click", closeSidebar);

  document.querySelectorAll(".nav-link")
    .forEach((link) => {
      link.addEventListener("click", closeSidebar);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  initializeCharts();
  initializeEvents();
  renderPeerTable();
  updateDashboard();
});