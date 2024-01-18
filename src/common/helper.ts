// import * as xlsToJson from "xls-to-json"
import * as ExcelJS from "exceljs"
export class Helper {
  static removeAccents(title: string, withTime: boolean): string {
    let slug = title.toLowerCase();
    //Đổi ký tự có dấu thành không dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, "a");
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, "e");
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, "i");
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, "o");
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, "u");
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, "y");
    slug = slug.replace(/đ/gi, "d");
    //Xóa các ký tự đặt biệt
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, "");
    //Đổi khoảng trắng thành ký tự gạch ngang
    slug = slug.replace(/ /gi, "-");
    //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    slug = slug.replace(/\-\-\-\-\-/gi, "-");
    slug = slug.replace(/\-\-\-\-/gi, "-");
    slug = slug.replace(/\-\-\-/gi, "-");
    slug = slug.replace(/\-\-/gi, "-");
    //Xóa các ký tự gạch ngang ở đầu và cuối
    slug = "@" + slug + "@";
    slug = slug.replace(/\@\-|\-\@|\@/gi, "");
    slug = withTime ? slug + "-" + Date.now() : slug + "";
    return slug;
  }

  static transformQueryList({ page, limit }: any): { page: number, limit: number } {
    let castPage = Number(page)
    let castLimit = Number(limit)
    page = castPage && castPage > 0 ? Number(page) : 1
    limit = castLimit && castLimit > 0 ? Number(limit) : 30
    return { page: page, limit: limit }
  }

  static calculateTimeWorkExam(startTime: Date, endTime: Date): string {
    if (!endTime) return "00:00:00";
    const timeDiffInSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    const hours = Math.floor(timeDiffInSeconds / 3600);
    const minutes = Math.floor((timeDiffInSeconds % 3600) / 60);
    const seconds = timeDiffInSeconds % 60;

    const formattedHours = hours < 10 ? `0${hours}` : hours.toString();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  static getRandomElements(array: any[], numberOfElements: number) {
    // Lấy số lượng phần tử ngẫu nhiên không trùng lặp từ mảng
    const shuffledArray = array.slice().sort(() => Math.random() - 0.5);
    
    // Chọn số lượng phần tử mong muốn
    return shuffledArray.slice(0, numberOfElements);
  }

  static transformTextExcel(plain: any): string {
    if(typeof plain === 'string') {
      return plain
    }
    if (typeof plain === 'object' && plain.richText) {
      return plain.richText.map((i: { text: string, font?: any }) => {
        return i.font ? `${i.text}` : i.text;
      }).join(' ')
    }
    return JSON.stringify(plain)
  }

  static async convertXlsToXlsx(inputFile: string, outputFile: string, sheetName: string) {
    // return new Promise((resolve, reject) => {
    //   xlsToJson({
    //     input: inputFile,
    //     output: outputFile,
    //   }, (err, result) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       console.log('File xls đã được chuyển đổi thành công thành xlsx:', outputFile);
    //       resolve(result);
    //     }
    //   });
    // });
  }

  static async convertXlsToXlsxExcelJS(inputFile, outputFile) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(inputFile);
  
    // Lưu workbook vào file xlsx
    await workbook.xlsx.writeFile(outputFile);
  
    console.log('File xls đã được chuyển đổi thành công thành xlsx:', outputFile);
  
    return outputFile; // Trả về đường dẫn của file xlsx mới
  } 

}