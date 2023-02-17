import { readFile, utils, writeFile } from "xlsx";

var fileInput = document.getElementById("import");
var districtInput = document.getElementById("districtCode");
var sheetNameInput = document.getElementById("sheet_name");
var fileNameInput = document.getElementById("file_name");
var transformButton = document.getElementById("transform_button");
console.log(fileInput);
// fileInput.onchange = () => {
//   handleImport(fileInput.files[0]).then((res) => {
//     let result = handleConvertion(res, districtInput.value);
//     // tableUI(result);
//     handleNewExcelFile(sheetNameInput.value, result, fileNameInput.value);
//     console.log(result);
//   });
// };

transformButton.addEventListener("click", () => {
  try {
    handleImport(fileInput.files[0]).then((res) => {
      let result = handleConvertion(res, districtInput.value);
      handleNewExcelFile(`${result[0].ShortDistrictCode}`, result, `${result[0].ShortDistrictCode}-import-file`);
      console.log(result);
    });
  } catch (error) {
    window.alert(error);    
  }
  
});

function tableUI(datas) {
  let div = document.querySelector("#table");

  let table = `
    <div class="overflow-x-auto">
      <div class="py-2 inline-block">
        <div class="overflow-scroll">
        <table class="">
            <thead class="bg-white border-b">            
              <tr>
              ${Object.keys(datas[0])
                .map((x) => {
                  console.log(x);
                  return `<th scope="col" class="text-sm font-medium text-gray-900 py-4">
                  ${x}
                  </th>`;
                })
                .join()}                
              </tr>
            </thead>
            <tbody>
              ${datas
                .map((y) => {
                  return `<tr class="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">${Object.values(
                    y
                  )
                    .map((x) => {
                      return `<td class="text-sm text-gray-900 font-light py-4 ">
                    ${x}
                    </td>`;
                    })
                    .join()}</tr>`;
                })
                .join()}
              <tr class="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
              
                <td class="text-sm text-gray-900 font-light py-4 whitespace-nowrap">
                  {{ $post->id }}
                </td>

                <td class="text-sm text-gray-900 font-light py-4 whitespace-nowrap">
                  {{ $post->title }}
                </td>

                <td class="text-sm text-gray-900 font-light py-4 whitespace-nowrap">
                  {{ $post->content }}
                </td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>
  `;

  div.insertAdjacentHTML("beforebegin", table);
}

async function handleImport(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = readFile(arrayBuffer);
    const firstSheet = utils.sheet_to_json(result.Sheets[result.SheetNames[0]]);
    return firstSheet;
  } catch (error) {
    console.log(error);
  }
}

function handleConvertion(fileArrays, districtCode) {
  let result = [];
  for (let file of fileArrays) {
    // let res = arrayMapping(file["Zone Number"], file["Area"], districtCode);
    let res = arrayMapping(file);
    result.push(res);
  }
  return result;
}

function arrayMapping(file) {
  let zone = file["Zone Number"];
  let area = file["Area"];
  let shortDistrictCode = file["District"];
  const ChapterName = file["Chapter Name"];
  const Venue = file["Name of Meeting Venue"];
  const Address = file["Address of Meeting Venue"];
  const City = file["City "];
  const State = file["State"];
  const MeetingDays = file["Meeting Day"];

  const array = [
    ["NC1","0101"],
    ["NC2","0102"],
    ["NC3","0103"],
    ["NC4","0104"],
    ["NC5","0105"],
    ["NE1","0201"],
    ["NE2","0202"],
    ["NW1","0301"],
    ["NW2","0302"],
    ["NW3","0303"],
    ["SE1","0401"],
    ["SE2","0402"],
    ["SE3","0403"],
    ["SS1","0501"],
    ["SS2","0502"],
    ["SS3","0503"],
    ["SS4","0504"],
    ["SW1","0601"],
    ["SW2","0602"],
    ["SW3","0603"],
    ["SW4","0604"],
    ["SW5","0605"],
    ["SW6","0606"],
    ["SW7","0607"],
    ["Zone1", "01"],
    ["Zone2", "02"],
    ["Zone3", "03"],
    ["Zone4", "04"],
    ["Zone5", "05"],
    ["Zone6", "06"],
    ["Zone7", "07"],
    ["Zone8", "08"],
    ["Zone9", "09"],
    ["Zone10", "10"],
    ["Zone11", "11"],
    ["Zone12", "12"],
    ["Zone13", "13"],
    ["Zone14", "14"],
    ["Zone15", "15"],
    ["Zone16", "16"],
    ["Zone17", "17"],
    ["Zone18", "18"],
    ["Zone19", "19"],
    ["Zone20", "20"],
    ["Area1", "01"],
    ["Area2", "02"],
    ["Area3", "03"],
    ["Area4", "04"],
    ["Area5", "05"],
  ];

  zone = zone.replace(/\s/g, "");
  area = area.replace(/\s/g, "");
  shortDistrictCode = shortDistrictCode.replace(/\s/g, "")

  let result = {
    ChapterName,
    DistrictCode: "",
    ZoneCode: "",
    AreaCode: "",
    ShortDistrictCode: shortDistrictCode,
    State,
    City,
    Venue,
    Address,
    MeetingDays,
  };

  array.forEach((item) => {
    if (item[0] === shortDistrictCode) {
      result.DistrictCode = `${item[1]}`;
    }
    if (item[0] === zone) {
      result.ZoneCode = `${result.DistrictCode}${item[1]}`;
    }
    if (item[0] === area) {
      result.AreaCode = `${result.ZoneCode}${item[1]}`;
    }
  });

  // result(`${district}${result[0]}`);
  // result.push(`${district}${result[0]}${result[1]}`);

  return result;
}

function handleNewExcelFile(sheetName, sheetDatas, fileName) {
  console.log(sheetDatas);
  const book = utils.book_new();
  const jsonToSheet = utils.json_to_sheet(sheetDatas);
  utils.book_append_sheet(book, jsonToSheet, sheetName);

  writeFile(book, `${fileName}.xlsx`);

  return {
    book,
    sheetDatas,
    sheetName,
    fileName,
  };
}
