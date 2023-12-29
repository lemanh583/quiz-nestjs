import mysql from "mysql2";
import axios from "axios";
import * as fs from "fs"

const filePath = './crawler.newcongchucvns.json';

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers.common[
  "Authorization"
] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDIyMjM5MDgsImV4cCI6MTcwNDgxNTkwOH0.I0WNMS9IyowspSsCyBZuUyxGpjFgyR1z4ejrGGWTdMo`;


function connectMysql() {
  try {
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "1",
      database: "quiz",
    });
    return connection;
  } catch (error) {
    throw error;
  }
}


async function handle(connectionMysql) {
  try {
    let data = fs.promises.readFile(filePath, 'utf8')
    console.log(data);
  } catch (error) {
    throw error;
  }
}

async function execQuery(connectionMysql, query, data) {
  return new Promise((resolve, reject) => {
    connectionMysql.query(query, data, (err, results) => {
      if (err) {
        reject("Error query:" + query + " : " + err);
        return;
      }
      resolve(results);
    });
  });
}

(async () => {
  try {
    let connectionMysql = connectMysql();
    await handle(connectionMysql);
    console.log("Done");
  } catch (error) {
    console.error(error);
  }
})();







// let files = await schema.find({ parent: { $nin: arrayEn } }).distinct("parent");
// for (let file of files) {
//   // insert to category mysql
//   let rsCategory = await axios.post("/admin/category/create", {
//     title: file?.trim(),
//     type: "exam",
//   });
//   let category = rsCategory.data?.data;
//   let titles = await schema.find({ parent: file }).distinct("title");
//   for (let [index, t] of titles.entries()) {
//     let count = await schema.countDocuments({ parent: file, title: t });
//     if (count == 0) {
//       continue;
//     }
//     console.log('t',t)
//     // insert to exam mysql
//     let rsExam = await axios.post("/admin/exam/create", {
//       title: t?.trim(),
//       category_id: category.id,
//       type: "import",
//       // lang_type: "en"
//     });
//     let exam = rsExam.data?.data

//     let skip = 0;
//     let limit = 50;
//     let rows = [1];
//     while (rows.length != 0) {
//       rows = await schema.find({ parent: file, title: t }).skip(skip).limit(limit);

//       for (let row of rows) {
//         // insert questions mysql
//         let question = await execQuery(connectionMysql, `INSERT INTO questions SET ?`, {
//           created_at: new Date(),
//           updated_at: new Date(),
//           title: row.question?.trim(),
//           recommend: row.recommend?.trim(),
//           type: "single",
//         });

//         await execQuery(connectionMysql, `INSERT INTO exam_questions SET ?`, {
//             created_at: new Date(),
//             updated_at: new Date(),
//             question_id: question.insertId,
//             exam_id: exam.id
//         })

//         await Promise.all(
//             row.answers.map( async (answer, index) => {
//                 await execQuery(connectionMysql, `INSERT INTO answers SET ?`, {
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                     title: answer.content?.trim(),
//                     correct: answer.correct,
//                     question_id: question.insertId,
//                     default_order: index
//                 })
//             })
//         )
//       }

//       skip += limit;
//     }
//   }
// }