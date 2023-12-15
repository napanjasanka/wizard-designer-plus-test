var inputfile = document.querySelector("input[type=file]");
var tableContainer = document.querySelector(".tableContainer");
if (!tableContainer) {
  tableContainer = document.createElement("div");
  tableContainer.classList.add("tableContainer");
  document.querySelector(".deployform").appendChild(tableContainer);
}

function handleFileLoad(event) {
  const fileList = this.files;
  const reader = new FileReader();

  reader.onload = function (e) {
    // Clear the existing table from the container
    tableContainer.innerHTML = "";

    var new_div = document.createElement("div");

    new_div.className = "csv-table";
    new_div.style.maxHeight = "300px";
    new_div.style.overflow = "auto";
    new_div.style.width = "100%";
    new_div.style.boxShadow = "0px 4px 8px 0px rgba(0,0,0,0.2)";
    new_div.style.display = "block";

    const table_html = csv_string_to_table(e.target.result, new_div);
    tableContainer.appendChild(new_div);
  };
  reader.readAsText(fileList[0]);
}
inputfile.addEventListener("change", handleFileLoad);

function csv_string_to_table(csv_string, element_to_insert_table) {
  var rows = csv_string.trim().split(/\r?\n|\r/);
  var comma_regex = /(,)(?=(?:[^"]*"[^"]*")*[^"]*$)/g; // Split by commas not inside quotes

  var tableStyle =
    'style="border-collapse:collapse;width:100%;table-layout:auto;"';
  var thStyle =
    'style="border:1px solid black;padding:10px;text-align:left;background-color:#4CAF50;color:white;width:auto;overflow:hidden;text-overflow:ellipsis;"';
  var tdStyle =
    'style="border:1px solid black;padding:10px;text-align:left;width:auto;overflow:hidden;text-overflow:ellipsis;"';

  var table = "";
  var table_rows = "";
  var table_header = "";

  rows.forEach(function (row, row_index) {
    var table_columns = "";
    var columns = row.split(comma_regex); // Split by regex
    columns.forEach(function (column, column_index) {
      var clean_column = column.replaceAll('"', ""); // Removes extra quotes
      table_columns +=
        row_index == 0
          ? "<th " + thStyle + ">" + clean_column + "</th>"
          : "<td " + tdStyle + ">" + clean_column + "</td>";
    });

    if (row_index == 0) {
      table_header += "<tr>" + table_columns + "</tr>";
    } else {
      table_rows += "<tr>" + table_columns + "</tr>";
    }
  });

  table += "<table " + tableStyle + ">";
  table += "<thead>";
  table += table_header;
  table += "</thead>";
  table += "<tbody>";
  table += table_rows;
  table += "</tbody>";
  table += "</table>";

  element_to_insert_table.innerHTML = table;
}