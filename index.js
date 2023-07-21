import mysql from "mysql";
import readLine from "readline";
import dotenv from "dotenv";
dotenv.config();

const db = mysql.createConnection({
  database: process.env.DATABASE,
  host: process.env.HOST,
  user: process.env.USERDB,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

const reader = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const sql = () => {
  reader.question(
    `${1}. Display all books in the database \n${2}. Display all books by a given author \n${3}. Display all authors \n${4}. Add a new Author \n Enter response:  `,
    (answer) => {
      let q;
      let read = parseInt(answer);
      switch (read) {
        case 1:
          q = `SELECT * FROM book;`;
          break;

        case 2:
          reader.question("Enter author name: ", (author) => {
            q = `SELECT * FROM book WHERE Author_Name = '${author}';`;
            db.query(q, (err, data) => {
              if (!err) {
                console.log(data.map((row) => ({ ...row })));
                sql();
              } else {
                console.log(err);
              }
            });
          });
          break;
        case 3:
          q = `SELECT * FROM author`;
          break;
        case 4:
          reader.question("Add new Author: ", (author) => {
            q = `INSERT INTO author(Author_Name)VALUES('${author}')`;
            db.query(q, [author], (err, data) => {
              if (!err) {
                console.log(data);
                sql();
              } else {
                console.log(err);
              }
            });
          });
          break;
      }
      if (read !== 2 && read !== 4) {
        db.query(q, (err, data) => {
          if (!err) {
            console.log(data.map((row) => ({ ...row })));
            sql();
          } else {
            console.log(err);
          }
        });
      }
    }
  );
};

const DbConnection = () =>
  db.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      sql();
    }
  });

DbConnection();
