if (document.location.href == "https://wizard-designer-pc.qa.agoda.is/deploy") {
  // Select the node that will be observed for mutations (in this case, the body)
  var targetNode = document.querySelector("body");

  // Options for the observer (which mutations to observe)
  var observerConfig = { childList: true, subtree: true };

  // Create an observer instance linked to the callback function
  var observer = new MutationObserver(function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      // Look through all nodes being added to the document
      for (let node of mutation.addedNodes) {
        if (node.id == "workflowFileContainer") {
          var inputfile = document.querySelector("input[type=file]");
          var tableContainer = document.querySelector(".tableContainer");

          if (!tableContainer) {
            tableContainer = document.createElement("div");
            tableContainer.classList.add("tableContainer");
            // Set the fixed width and height
            tableContainer.style.width = "100%";
            tableContainer.style.height = "500px";
            document.querySelector(".deployform").appendChild(tableContainer);
          }

          function handleFileLoad(event) {
            const fileList = this.files;
            const reader = new FileReader();

            reader.onload = function (e) {
              // Clear the existing table from the container
              tableContainer.innerHTML = "";

              var new_div = document.createElement("div");
              var table_preview = document.createElement("div");

              new_div.className = "csv-table";
              new_div.style.maxHeight = "500px";
              new_div.style.overflow = "auto";
              new_div.style.width = "75%";
              new_div.style.boxShadow = "0px 4px 8px 0px rgba(0,0,0,0.2)";
              new_div.style.display = "block";

              table_preview.textContent = "Table Preview";
              table_preview.style.fontWeight = "bold";
              table_preview.style.fontSize = "14px";
              table_preview.style.padding = "12px 0px";

              const table_html = csv_string_to_table(e.target.result, new_div);
              tableContainer.appendChild(table_preview);
              tableContainer.appendChild(new_div);
            };
            reader.readAsText(fileList[0]);
          }
          inputfile.addEventListener("change", handleFileLoad);

          function csv_string_to_table(csv_string, element_to_insert_table) {
            var rows = csv_string.trim().split(/\r?\n|\r/);
            //var comma_regex = /(,)(?=(?:[^"]*"[^"]*")*[^"]*$)/g; // Split by commas not inside quotes
            var comma_regex = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/g; // Split by commas not inside quotes

            var tableStyle =
              'style="border-collapse:collapse;width:100%;table-layout:auto;"';
            var thStyle =
              'style="border:1px solid black;padding:10px;text-align:left;background-color:#18499A;color:white;width:auto;overflow:hidden;text-overflow:ellipsis;"';
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
                //if (clean_column != ",") {
                  table_columns +=
                    row_index == 0
                      ? "<th " + thStyle + ">" + clean_column + "</th>"
                      : "<td " + tdStyle + ">" + clean_column + "</td>";
               // }
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
          observer.disconnect(); // Stop observing for mutations once we found our element
        }
      }
    }
  });

  // Start observing the target node for configured mutations
  observer.observe(targetNode, observerConfig);
}
