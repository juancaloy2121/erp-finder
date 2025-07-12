let allData = [];

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const cols = line.split(',');
    let obj = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = cols[i].trim();
    });
    return obj;
  });
}

async function loadCSV() {
  try {
    const response = await fetch('data.csv');
    const text = await response.text();
    allData = parseCSV(text);
  } catch (err) {
    console.error('Failed to load CSV:', err);
  }
}

function filterData(query) {
  query = query.toLowerCase();
  return allData.filter(row => row['Part Name'].toLowerCase().includes(query));
}

function showListBox(filtered) {
  const container = document.getElementById('listBoxContainer');

  if (filtered.length === 0) {
    container.innerHTML = '<p>No parts found.</p>';
    return;
  }

  let html = '<table><thead><tr>';
  html += '<th>ERP Parts No</th><th>DEPARTMENT</th><th>Part Name</th><th>Model</th>';
  html += '</tr></thead><tbody>';

  filtered.forEach((row, index) => {
    html += `<tr data-index="${index}">`;
    html += `<td>${row['ERP Parts No']}</td>`;
    html += `<td>${row['DEPARTMENT']}</td>`;
    html += `<td>${row['Part Name']}</td>`;
    html += `<td>${row['Model']}</td>`;
    html += '</tr>';
  });

  html += '</tbody></table>';
  container.innerHTML = html;

  const rows = container.querySelectorAll('tbody tr');
  rows.forEach(row => {
    row.addEventListener('click', () => {
      rows.forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');

      const idx = row.getAttribute('data-index');
      const selectedRow = filtered[idx];
      const erpNo = selectedRow['ERP Parts No'];
      const partName = selectedRow['Part Name'];

      const erpSpan = document.getElementById('erpNumber');
      erpSpan.textContent = erpNo;

      // Show part name next to ERP number
      let partNameSpan = document.getElementById('selectedPartName');
      if (!partNameSpan) {
        partNameSpan = document.createElement('span');
        partNameSpan.id = 'selectedPartName';
        partNameSpan.style.marginLeft = '10px';
        partNameSpan.style.fontWeight = 'normal';

        document.getElementById('selectedERP').appendChild(partNameSpan);
      }
      partNameSpan.textContent = ` - ${partName}`;
    });
  });
}

async function main() {
  await loadCSV();

  const input = document.getElementById('partNameInput');
  input.addEventListener('input', () => {
    const query = input.value.trim();
    if (query.length > 0) {
      const filtered = filterData(query);
      showListBox(filtered);
    } else {
      document.getElementById('listBoxContainer').innerHTML = '';
      document.getElementById('erpNumber').textContent = '';
      const partNameSpan = document.getElementById('selectedPartName');
      if (partNameSpan) partNameSpan.textContent = '';
    }
  });
}

main();
