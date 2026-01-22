import './styles.css';

let exceptions = [];
let idCounter = 1;

document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("exception-form");
  const tableBody = document.getElementById("exceptions-tbody");
  const emptyState = document.getElementById("empty-state");
  const filterIssue = document.getElementById("filter-issue-type");
  const filterStatus = document.getElementById("filter-status");

  form.addEventListener("submit", addException);
  filterIssue.addEventListener("change", applyFilter);
  filterStatus.addEventListener("change", applyFilter);

  function addException(e) {
    e.preventDefault();

    const deliveryId = document.getElementById("delivery-id").value;
    const customerName = document.getElementById("customer-name").value;
    const issueType = document.getElementById("issue-type").value;
    const priority = document.querySelector("input[name='priority']:checked");
    const notes = document.getElementById("notes").value;

    if (!deliveryId || !customerName || !issueType || !priority) return;

    const exception = {
      id: idCounter++,
      deliveryId,
      customerName,
      issueType,
      priority: priority.value,
      status: "Open"
    };

    exceptions.push(exception);
    addRow(exception);
    form.reset();
    showEmptyState();
  }

  function addRow(ex) {
    const row = document.createElement("tr");
    row.dataset.id = ex.id;
    row.dataset.issue = ex.issueType;
    row.dataset.status = ex.status;

    row.innerHTML = `
      <td>${ex.deliveryId}</td>
      <td>${ex.customerName}</td>
      <td>${ex.issueType}</td>
      <td>${ex.priority}</td>
      <td class="status">${ex.status}</td>
      <td>
        <button onclick="resolve(${ex.id})">Resolve</button>
        <button onclick="remove(${ex.id})">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  }

  window.resolve = function (id) {
    const ex = exceptions.find(e => e.id === id);
    if (!ex) return;

    ex.status = "Resolved";

    const row = document.querySelector(`tr[data-id='${id}']`);
    row.dataset.status = "Resolved";
    row.querySelector(".status").innerText = "Resolved";

    applyFilter();
  };

  window.remove = function (id) {
    exceptions = exceptions.filter(e => e.id !== id);
    document.querySelector(`tr[data-id='${id}']`).remove();
    showEmptyState();
  };

  function applyFilter() {
    const issueValue = filterIssue.value;
    const statusValue = filterStatus.value;

    document.querySelectorAll("#exceptions-tbody tr").forEach(row => {
      const matchIssue = !issueValue || row.dataset.issue === issueValue;
      const matchStatus = !statusValue || row.dataset.status === statusValue;

      row.style.display = (matchIssue && matchStatus) ? "" : "none";
    });

    showEmptyState();
  }

  function showEmptyState() {
    emptyState.style.display =
      tableBody.children.length === 0 ? "block" : "none";
  }
});
