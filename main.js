import { readFile } from "xlsx";

var inputFile = document.getElementById("import");
console.log(inputFile);
inputFile.onchange = () => {
  handleImport(inputFile.files[0]);
  console.log(inputFile.files[0]);
};

async function handleImport(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = readFile(arrayBuffer);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}
