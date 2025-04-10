let table = $('#myTable');
let localStorageKey = 'myTableData';


function loadDatalocalStorage() {
  let data = localStorage.getItem(localStorageKey);
  if (data) {
    table.html(data);
  }
}


function saveDatalocalStorage() {
  localStorage.setItem(localStorageKey, table.html());
}


function enableEdit(td) {
  let text = td.text();
  td.addClass('edit-mode').html('<input type="text" value="' + text + '">');
  let input = td.find('input').focus();

  
  input.on('blur keydown', function(e) {
    if (e.type === 'blur' || e.key === 'Enter') {
      let newText = input.val();
      td.removeClass('edit-mode').text(newText);
      saveData();
    }
  });
}


table.on('dblclick', 'td', function() {
  enableEdit($(this));
});


function addRowtable() {
  let numCols = table.find('tr:first-child td').length;
  let row = $('<tr></tr>');
  for (let i = 0; i < numCols; i++) {
    row.append('<td></td>');
  }
  table.append(row);
  saveData();
}


function removeRowtable() {
  if (table.find('tr').length > 1) {
    let lastRow = table.find('tr:last-child');
    let hasData = false;
    lastRow.find('td').each(function() {
      if ($(this).text().trim() !== '') {
        hasData = true;
        return false; 
      }
    });

    if (hasData && !confirm("Удалить строку с данными?")) {
      return;
    }
    lastRow.remove();
    saveData();
  } else {
    alert("Вы не можете удалить последнюю строку.");
  }
}


function addColumntable() {
  table.find('tr').each(function() {
    $(this).append('<td></td>');
  });
  saveData();
}


function removeColumntable() {
  let numCols = table.find('tr:first-child td').length;
  if (numCols > 1) {
    let hasData = false;
    table.find('tr').each(function() {
      let lastCell = $(this).find('td:last-child');
      if (lastCell.text().trim() !== '') {
        hasData = true;
        return false; 
      }
    });

    if (hasData && !confirm("Удалить столбец с данными?")) {
      return;
    }

    table.find('tr').each(function() {
      $(this).find('td:last-child').remove();
    });
    saveData();
  } else {
    alert("Вы не можете удалить последний столбец.");
  }
}

loadData();